import type { Geometry } from "geojson";
import type { WKTShapeType } from '@/types/map.type';

type Coordinate = [number, number];

function parseCoordinatePair(pair: string): Coordinate {
  const parts = pair.trim().split(/\s+/);
  return [parseFloat(parts[0]), parseFloat(parts[1])];
}

function parseCoordinateSequence(sequence: string): Coordinate[] {
  return sequence.split(",").map((pair) => parseCoordinatePair(pair.trim()));
}

export function parseWKT(wkt: string): Geometry | null {
  const trimmed = wkt.trim();

  // POINT (lon lat)
  const pointMatch = trimmed.match(/^POINT\s*\(\s*([^)]+)\s*\)$/i);
  if (pointMatch) {
    const [lon, lat] = pointMatch[1].trim().split(/\s+/).map(Number);
    return { type: "Point", coordinates: [lon, lat] };
  }

  // POLYGON ((ring1), (ring2), ...)
  const polygonMatch = trimmed.match(/^POLYGON\s*\(\s*([\s\S]+)\s*\)$/i);
  if (polygonMatch) {
    const ringsStr = polygonMatch[1];
    const rings: Coordinate[][] = [];
    const ringRegex = /\(([^)]+)\)/g;
    let ringMatch;
    while ((ringMatch = ringRegex.exec(ringsStr)) !== null) {
      rings.push(parseCoordinateSequence(ringMatch[1]));
    }
    if (rings.length === 0) return null;
    return { type: "Polygon", coordinates: rings };
  }

  // LINESTRING (coords)
  const lineMatch = trimmed.match(/^LINESTRING\s*\(\s*([^)]+)\s*\)$/i);
  if (lineMatch) {
    const coordinates = parseCoordinateSequence(lineMatch[1]);
    return { type: "LineString", coordinates };
  }

  // MULTIPOLYGON - basic support
  const multiPolygonMatch = trimmed.match(/^MULTIPOLYGON\s*\(\s*([\s\S]+)\s*\)$/i);
  if (multiPolygonMatch) {
    const polygons: Coordinate[][][] = [];
    const outerRingRegex = /\(\s*(\([^)]+\)(?:\s*,\s*\([^)]+\))*)\s*\)/g;
    let outerMatch;
    while ((outerMatch = outerRingRegex.exec(multiPolygonMatch[1])) !== null) {
      const rings: Coordinate[][] = [];
      const innerRingRegex = /\(([^)]+)\)/g;
      let innerMatch;
      while ((innerMatch = innerRingRegex.exec(outerMatch[1])) !== null) {
        rings.push(parseCoordinateSequence(innerMatch[1]));
      }
      if (rings.length > 0) polygons.push(rings);
    }
    return { type: "MultiPolygon", coordinates: polygons };
  }

  console.warn(`[wkt-parser] Unsupported WKT format: ${trimmed.slice(0, 60)}`);
  return null;
}

export function detectShapeType(wkt: string): WKTShapeType {
  const upper = wkt.trim().toUpperCase();
  if (upper.startsWith("POINT")) return "Point";
  if (upper.startsWith("LINESTRING")) return "LineString";
  if (upper.startsWith("MULTIPOLYGON")) return "MultiPolygon";
  return "Polygon";
}