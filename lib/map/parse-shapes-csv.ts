import type {
  RawShapeRow,
  ShapeFeature,
  ShapeGeoFeature,
  ShapesGeoJSON,
  MapBounds,
} from '@/types/map.type';
import { parseWKT, detectShapeType } from "./wkt-parser";

/** Minimal RFC-4180 CSV parser that handles quoted fields and embedded commas */
function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = tokenizeLine(lines[0]);

  return lines.slice(1).reduce<Record<string, string>[]>((acc, line) => {
    if (!line.trim()) return acc;
    const values = tokenizeLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] ?? "").trim();
    });
    acc.push(row);
    return acc;
  }, []);
}

function tokenizeLine(line: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < line.length) {
    if (line[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let value = "";
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          value += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          value += line[i++];
        }
      }
      tokens.push(value);
      if (line[i] === ",") i++; // skip comma
    } else {
      // Unquoted field
      const end = line.indexOf(",", i);
      if (end === -1) {
        tokens.push(line.slice(i));
        break;
      } else {
        tokens.push(line.slice(i, end));
        i = end + 1;
      }
    }
  }

  return tokens;
}

export function parseShapesCSV(csvContent: string): ShapeFeature[] {
  const rows = parseCSV(csvContent) as unknown as RawShapeRow[];
  const features: ShapeFeature[] = [];

  rows.forEach((row, index) => {
    const wkt = row.WKT?.trim();
    if (!wkt) return;

    const geometry = parseWKT(wkt);
    if (!geometry) return;

    features.push({
      id: `shape-${index}`,
      name: row.name || `Shape ${index + 1}`,
      description: row.description || "",
      shapeType: detectShapeType(wkt),
      geometry,
    });
  });

  return features;
}

export function toGeoJSON(features: ShapeFeature[]): ShapesGeoJSON {
  return {
    type: "FeatureCollection",
    features: features.map(
      (f): ShapeGeoFeature => ({
        type: "Feature",
        id: f.id,
        geometry: f.geometry,
        properties: {
          id: f.id,
          name: f.name,
          description: f.description,
          shapeType: f.shapeType,
        },
      })
    ),
  };
}

/** Compute bounding box for auto-fitting the map */
export function computeBounds(features: ShapeFeature[]): MapBounds | null {
  let minLon = Infinity,
    minLat = Infinity,
    maxLon = -Infinity,
    maxLat = -Infinity;

  function processCoord(lon: number, lat: number) {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  function walkGeometry(geom: ShapeFeature["geometry"]) {
    if (geom.type === "Point") {
      processCoord(geom.coordinates[0], geom.coordinates[1]);
    } else if (geom.type === "LineString") {
      geom.coordinates.forEach(([lon, lat]) => processCoord(lon, lat));
    } else if (geom.type === "Polygon") {
      geom.coordinates[0]?.forEach(([lon, lat]) => processCoord(lon, lat));
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) =>
        poly[0]?.forEach(([lon, lat]) => processCoord(lon, lat))
      );
    }
  }

  features.forEach((f) => walkGeometry(f.geometry));

  if (!isFinite(minLon)) return null;
  return { minLon, minLat, maxLon, maxLat };
}