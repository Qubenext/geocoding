import { useMap } from "@/components/ui/map";
import { useEffect } from "react";
import { MapMouseEvent } from "maplibre-gl";

interface ILocation {
    location: (lng: number, lat: number) => void;
}

export default function SelectEventAction({ location }: ILocation) {
    const { map } = useMap();

    useEffect(() => {
        if (!map) return;

        const handleClick = (e: MapMouseEvent) => {
            location(e.lngLat.lng, e.lngLat.lat);
        };

        map.on("click", handleClick);
        return () => {
            map.off("click", handleClick);
        };
    }, [map, location]);

    return null;
}