import { useMap } from "@/components/ui/map";
import { useEffect, useRef } from "react";

interface ILocation {
    location: (lng: number, lat: number) => void;
}

export default function UserLocatorAction({ location }: ILocation): null {
    const { map } = useMap();
    const hasLocated = useRef(false);
    const isInFlight = useRef(false);

    useEffect(() => {
        if (!map || hasLocated.current || isInFlight.current) return;
        if (!("geolocation" in navigator)) return;

        isInFlight.current = true;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                isInFlight.current = false;
                hasLocated.current = true;

                const { longitude, latitude } = position.coords;
                map.flyTo({ center: [longitude, latitude], zoom: 10, duration: 1500 });
                location(longitude, latitude);
            },
            () => {
                isInFlight.current = false;
            }
        );
    }, [map, location]);

    return null;
}