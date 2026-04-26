import { useState, useEffect } from "react";
import type { ShapesGeoJSON, MapBounds } from "@/types/map.type";

interface UseShapesResult {
  geojson: ShapesGeoJSON | null;
  bounds: MapBounds | null;
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useShapes(): UseShapesResult {
  const [geojson, setGeojson] = useState<ShapesGeoJSON | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchShapes() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/shapes");
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (cancelled) return;

        setGeojson(data.geojson);
        setBounds(data.bounds);
        setCount(data.count ?? 0);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchShapes();
    return () => { cancelled = true; };
  }, [trigger]);

  return {
    geojson,
    bounds,
    count,
    isLoading,
    error,
    refetch: () => setTrigger((t) => t + 1),
  };
}