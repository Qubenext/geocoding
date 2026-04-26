"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShapeGeoFeature } from "@/types/map.type";

const SHAPE_CONFIG: Record<string, { color: string; dot: string }> = {
  Polygon:      { color: "text-blue-400 border-blue-800 bg-blue-950/60",       dot: "bg-blue-400"   },
  Point:        { color: "text-rose-400 border-rose-800 bg-rose-950/60",       dot: "bg-rose-400"   },
  LineString:   { color: "text-amber-400 border-amber-800 bg-amber-950/60",    dot: "bg-amber-400"  },
  MultiPolygon: { color: "text-violet-400 border-violet-800 bg-violet-950/60", dot: "bg-violet-400" },
};
const FALLBACK = SHAPE_CONFIG.Polygon;

interface ShapesSidebarProps {
  features: ShapeGeoFeature[];
  isLoading: boolean;
  count: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function ShapesSidebar({
  features,
  isLoading,
  count,
  selectedId,
  onSelect,
}: ShapesSidebarProps) {
  return (
    <aside className="flex flex-col w-56 shrink-0 rounded-xl border border-slate-800 bg-[#0f172a] shadow-xl overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3.5 border-b border-slate-800">
        <p className="text-sm font-semibold text-slate-100 tracking-tight">
          Map Shapes
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isLoading
            ? "Loading…"
            : `${count} shape${count !== 1 ? "s" : ""} loaded`}
        </p>
      </div>

      {/*
        ── Scrollable list ──────────────────────────────────────────────
        flex-1 + min-h-0 = shrinks within the flex column correctly.
        overflow-y-auto = native scroll, avoids ShadCN ScrollArea
        height-resolution issues inside constrained flex parents.
      */}
      <div className="scrollbar-clean flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-2 py-2 space-y-0.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2 py-2.5">
                <Skeleton className="h-2 w-2 rounded-full bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4 bg-slate-800" />
                  <Skeleton className="h-2.5 w-1/3 bg-slate-800" />
                </div>
              </div>
            ))
          : features.map((feature) => {
              const { id, name, description, shapeType } = feature.properties;
              const isSelected = selectedId === id;
              const cfg = SHAPE_CONFIG[shapeType] ?? FALLBACK;

              return (
                <button
                  key={id}
                  onClick={() => onSelect(isSelected ? null : id)}
                  className={[
                    "w-full text-left flex items-center gap-2.5",
                    "px-2 py-2 rounded-md transition-colors duration-100",
                    isSelected
                      ? "bg-slate-700/80 text-slate-100"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100",
                  ].join(" ")}
                >
                  {/* Dot — avoids unicode rendering inconsistencies */}
                  <span
                    className={[
                      "shrink-0 w-2 h-2 rounded-full",
                      isSelected ? "bg-orange-400" : cfg.dot,
                    ].join(" ")}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-4">
                      {name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge
                        variant="outline"
                        className={[
                          "text-[10px] px-1.5 py-0 h-4 font-normal border",
                          isSelected
                            ? "text-orange-400 border-orange-800 bg-orange-950/50"
                            : cfg.color,
                        ].join(" ")}
                      >
                        {shapeType}
                      </Badge>
                      {description && (
                        <span className="text-[10px] text-slate-600 truncate">
                          {description}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-3 py-2 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 font-mono truncate">
          src/data/example.csv
        </p>
      </div>
    </aside>
  );
}