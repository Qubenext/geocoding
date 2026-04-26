import type { Feature, Geometry, GeoJsonProperties } from "geojson";

export interface IFormData {
    floor: string;
    apartment: string;
    unit: string;
}

export interface IDataList {
    id: number;
    coordinates: string;
    address: string;
    floor: string;
    apartment: string;
    unit: string;
}

export const CFormData: IFormData = {
    floor: "",
    apartment: "",
    unit: "",
};


export type WKTShapeType = "Polygon" | "Point" | "LineString" | "MultiPolygon";

export interface RawShapeRow {
  WKT: string;
  name: string;
  description: string;
}

export interface ShapeFeature {
  id: string;
  name: string;
  description: string;
  shapeType: WKTShapeType;
  geometry: Geometry;
}

export type ShapeGeoFeature = Feature<Geometry, GeoJsonProperties> & {
  properties: {
    id: string;
    name: string;
    description: string;
    shapeType: WKTShapeType;
  };
};

export interface ShapesGeoJSON {
  type: "FeatureCollection";
  features: ShapeGeoFeature[];
}

export interface MapBounds {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}