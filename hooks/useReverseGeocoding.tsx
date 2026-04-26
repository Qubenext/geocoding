import {useCallback, useState} from "react";

export default function useReverseGeocoding() {
    const [location, setLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [response, setResponse] = useState("");
    const [progress, setProgress] = useState(false);

    const handleMapClick = useCallback(async (lng: number, lat: number) => {
        setLocation({lng, lat});
        setProgress(true);

        try {
            // Using OpenStreetMap's Nominatim API for reverse geocoding
            const req = new Request(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const res = await fetch(req);
            const arr = await res.json();

            console.log(arr)
            if (arr && arr.display_name) {
                setResponse(arr.display_name);
            } else {
                setResponse(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
        } catch (err) {
            console.error("Failed to fetch address", err);
            setResponse(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
            setProgress(false);
        }
    }, []);

    return { location, response, setResponse, progress, handleMapClick };
}