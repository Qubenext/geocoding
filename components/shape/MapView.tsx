"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  ScaleControl,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { useShapes } from "@/hooks/use-shapes";
import { ShapesSidebar } from "./ShapesSidebar";
import type { ShapeGeoFeature } from "@/types/map.type";

// ─── Dark theme — mirrors MapCN default palette ──────────────────────────────
const THEME = {
  polygonFill: "#3b82f6",
  polygonFillSelected: "#f97316",
  polygonStroke: "#60a5fa",
  polygonStrokeSelected: "#f97316",
  point: "#f87171",
  pointSelected: "#f97316",
};

// ─── Layer definitions ───────────────────────────────────────────────────────
const polygonFillLayer = {
  id: "polygon-fill",
  type: "fill" as const,
  filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
  paint: {
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      THEME.polygonFillSelected,
      THEME.polygonFill,
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      0.55,
      0.28,
    ],
  },
};

const polygonOutlineLayer = {
  id: "polygon-outline",
  type: "line" as const,
  filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
  paint: {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      THEME.polygonStrokeSelected,
      THEME.polygonStroke,
    ],
    "line-width": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      2.5,
      1.5,
    ],
    "line-opacity": 0.95,
  },
};

const pointCircleLayer = {
  id: "point-circle",
  type: "circle" as const,
  filter: ["==", ["geometry-type"], "Point"],
  paint: {
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      THEME.pointSelected,
      THEME.point,
    ],
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      10,
      7,
    ],
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
    "circle-opacity": 1,
  },
};

const labelLayer = {
  id: "shape-labels",
  type: "symbol" as const,
  layout: {
    "text-field": ["get", "name"],
    "text-size": 11,
    "text-offset": [0, 1.5],
    "text-anchor": "top" as const,
    "text-max-width": 10,
  },
  paint: {
    "text-color": "#e2e8f0",
    "text-halo-color": "#0f172a",
    "text-halo-width": 1.5,
  },
};

// ─── Tooltip state type ───────────────────────────────────────────────────────
interface TooltipState {
  x: number;
  y: number;
  name: string;
  shapeType: string;
  description: string;
}

// CartoDB Dark Matter — same look as MapCN default dark theme
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// ─── Component ────────────────────────────────────────────────────────────────
export function MapView() {
  const mapRef = useRef<MapRef>(null);
  const { geojson, bounds, isLoading, error, count } = useShapes();

  // Track whether the map style is fully loaded before touching feature-state
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const prevSelectedIdRef = useRef<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // ── Auto-fit bounds when data + map are ready ──────────────────────────
  useEffect(() => {
    if (!bounds || !mapRef.current || !isMapLoaded) return;
    const pad = 0.02;
    mapRef.current.fitBounds(
      [
        [bounds.minLon - pad, bounds.minLat - pad],
        [bounds.maxLon + pad, bounds.maxLat + pad],
      ],
      { padding: 48, duration: 900 }
    );
  }, [bounds, isMapLoaded]);

  // ── Sync selected feature state on the GPU side ────────────────────────
  // MUST run after isMapLoaded — calling setFeatureState before the style
  // loads causes silent failures, which was breaking sidebar selection.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !isMapLoaded) return;

    // Deselect previous
    if (prevSelectedIdRef.current) {
      try {
        map.setFeatureState(
          { source: "shapes", id: prevSelectedIdRef.current },
          { selected: false }
        );
      } catch (_) { /* feature may not exist yet — safe to ignore */ }
    }

    // Select new
    if (selectedId) {
      try {
        map.setFeatureState(
          { source: "shapes", id: selectedId },
          { selected: true }
        );
      } catch (_) { /* safe to ignore */ }
    }

    prevSelectedIdRef.current = selectedId;
  }, [selectedId, isMapLoaded]);

  // ── Click a shape on the map ──────────────────────────────────────────
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const features = e.features ?? [];
    if (!features.length) {
      setSelectedId(null);
      setTooltip(null);
      return;
    }
    const feature = features[0] as ShapeGeoFeature;
    const featureId = String(feature.id ?? feature.properties?.id ?? "");
    setSelectedId((prev) => (prev === featureId ? null : featureId));
  }, []);

  // ── Hover tooltip ─────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const features = e.features ?? [];
    if (!features.length) { setTooltip(null); return; }
    const { name, shapeType, description } =
      (features[0] as ShapeGeoFeature).properties ?? {};
    setTooltip({
      x: e.point.x,
      y: e.point.y,
      name: name ?? "Unknown",
      shapeType: shapeType ?? "Shape",
      description: description ?? "",
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // ── Sidebar item click → select + fly to feature centroid ────────────
  const handleSidebarSelect = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      if (!id || !mapRef.current || !geojson) return;

      const feature = geojson.features.find((f) => f.properties?.id === id);
      if (!feature) return;

      const geom = feature.geometry;

      if (geom.type === "Point") {
        const [lon, lat] = geom.coordinates as [number, number];
        mapRef.current.flyTo({ center: [lon, lat], zoom: 14, duration: 700 });
      } else if (geom.type === "Polygon" && geom.coordinates[0]?.length) {
        const coords = geom.coordinates[0];
        const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
        const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
        mapRef.current.flyTo({ center: [lon, lat], zoom: 13, duration: 700 });
      } else if (geom.type === "MultiPolygon" && geom.coordinates[0]?.[0]?.length) {
        const coords = geom.coordinates[0][0];
        const lon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
        const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
        mapRef.current.flyTo({ center: [lon, lat], zoom: 13, duration: 700 });
      }
    },
    [geojson]
  );

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d1117]">
      {/* Dark sidebar */}
      <ShapesSidebar
        features={(geojson?.features ?? []) as ShapeGeoFeature[]}
        isLoading={isLoading}
        count={count}
        selectedId={selectedId}
        onSelect={handleSidebarSelect}
      />

      {/* Map */}
      <div className="relative flex-1">
        <Map
          ref={mapRef}
          mapStyle={MAP_STYLE}
          initialViewState={{ longitude: 88.45, latitude: 22.65, zoom: 10 }}
          interactiveLayerIds={["polygon-fill", "polygon-outline", "point-circle"]}
          onLoad={() => setIsMapLoaded(true)}
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "100%", height: "100%" }}
          cursor={tooltip ? "pointer" : "grab"}
        >
          {/* Match MapCN default control positions */}
          <NavigationControl position="bottom-right" visualizePitch />
          <ScaleControl position="bottom-left" unit="metric" />

          {/* Render shapes only after map style is ready */}
          {geojson && isMapLoaded && (
            <Source id="shapes" type="geojson" data={geojson} promoteId="id">
              <Layer {...polygonFillLayer} />
              <Layer {...polygonOutlineLayer} />
              <Layer {...pointCircleLayer} />
              <Layer {...labelLayer} />
            </Source>
          )}
        </Map>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Loading shapes…</p>
            </div>
          </div>
        )}

        {/* Error toast */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-900/80 border border-red-700 text-red-300 text-sm px-4 py-2.5 rounded-lg shadow-lg backdrop-blur-sm">
            ⚠ {error}
          </div>
        )}

        {/* Hover tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-20 bg-[#1e293b]/95 border border-slate-700 shadow-xl rounded-lg px-3 py-2.5 text-xs backdrop-blur-sm"
            style={{
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-semibold text-slate-100">{tooltip.name}</p>
            <p className="text-blue-400 mt-0.5">{tooltip.shapeType}</p>
            {tooltip.description && (
              <p className="text-slate-500 mt-0.5">{tooltip.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}