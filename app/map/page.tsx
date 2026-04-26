"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/shape/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Loading map…</p>
        </div>
      </div>
    ),
  }
);

export default function MapPage() {
  return (
      <MapView />
    );
}