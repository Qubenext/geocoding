import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parseShapesCSV, toGeoJSON, computeBounds } from "@/lib/map/parse-shapes-csv";

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "data", "map-kolkata.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");

    const features = parseShapesCSV(csvContent);
    const geojson = toGeoJSON(features);
    const bounds = computeBounds(features);

    return NextResponse.json({ geojson, bounds, count: features.length });
  } catch (error) {
    console.error("[/api/shapes] Failed to load shapes:", error);
    return NextResponse.json(
      { error: "Failed to load shapes data" },
      { status: 500 }
    );
  }
}