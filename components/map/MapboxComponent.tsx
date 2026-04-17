"use client";

import {useState, useCallback} from "react";
import {Map, MapControls, MapMarker, MarkerContent, MapViewport} from "@/components/ui/map";
import {Card} from "@/components/ui/card";
import SelectEventAction from "@/actions/SelectEventAction";
import UserLocatorAction from "@/actions/UserLocatorAction";
import StatusComponent from "@/components/map/StatusComponent";
import DetailComponent from "@/components/map/DetailComponent";


export function MapboxComponent() {
    const [viewport, setViewport] = useState<MapViewport>({
        center: [88.36592070677423, 22.57394462525124],
        zoom: 11,
        bearing: 0,
        pitch: 0,
    });


    // ======== NEED TO FIX


    const [selectedLocation, setSelectedLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [address, setAddress] = useState("");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    const [formData, setFormData] = useState({
        floor: "",
        apartment: "",
        unit: "",
    });

    const [confirmedList, setConfirmedList] = useState<Array<{
        id: number;
        coordinates: string;
        address: string;
        floor: string;
        apartment: string;
        unit: string;
    }>>([]);

    const handleMapClick = useCallback(async (lng: number, lat: number) => {
        setSelectedLocation({lng, lat});
        setIsLoadingAddress(true);

        try {
            // Using OpenStreetMap's Nominatim API for reverse geocoding
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();

            if (data && data.display_name) {
                setAddress(data.display_name);
            } else {
                setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
        } catch (error) {
            console.error("Failed to fetch address", error);
            setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
            setIsLoadingAddress(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newData = {
            id: Date.now(),
            coordinates: selectedLocation ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}` : "",
            address,
            floor: formData.floor,
            apartment: formData.apartment,
            unit: formData.unit,
        };
        setConfirmedList((prev) => [newData, ...prev]);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full gap-4 sm:gap-6 overflow-hidden">
            {/* Map Section */}
            <Card
                className="w-full lg:w-[70%] h-[40vh] lg:h-full p-0 overflow-hidden relative shadow-lg border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col bg-white dark:bg-zinc-900">
                <Map
                    center={[88.36592070677423, 22.57394462525124]}
                    zoom={11}
                    onViewportChange={setViewport}
                >
                    <MapControls position="bottom-right"
                                 showZoom
                                 showCompass
                                 showLocate
                                 showFullscreen/>
                    <SelectEventAction location={handleMapClick}/>
                    <UserLocatorAction location={handleMapClick}/>

                    {/* Render a marker if the user has clicked on the map */}
                    {selectedLocation && (
                        <MapMarker longitude={selectedLocation.lng} latitude={selectedLocation.lat}>
                            <MarkerContent/>
                        </MapMarker>
                    )}
                    <StatusComponent viewport={viewport}/>
                </Map>
            </Card>

            {/* Right Panel: Form & List */}
            <div className="w-full lg:w-[30%] flex flex-col gap-4 sm:gap-6 overflow-hidden h-full">
                {/* Address Form Section */}
                <Card
                    className="shrink-0 p-5 sm:p-6 shadow-lg border-zinc-200 dark:border-zinc-800 overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="latitude"
                                       className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Latitude</label>
                                <input
                                    id="latitude"
                                    className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedLocation ? selectedLocation.lat.toFixed(6) : ""}
                                    readOnly
                                    placeholder="Click map"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="longitude"
                                       className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Longitude</label>
                                <input
                                    id="longitude"
                                    className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedLocation ? selectedLocation.lng.toFixed(6) : ""}
                                    readOnly
                                    placeholder="Click map"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="address" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Selected
                                Address</label>
                            <textarea
                                id="address"
                                className="flex min-h-[60px] w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                                value={isLoadingAddress ? "Loading address..." : address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Click on the map to automatically fill the address"
                                readOnly={isLoadingAddress}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="floor"
                                       className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Floor
                                    No.</label>
                                <input id="floor" type="text"
                                       className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                                       value={formData.floor}
                                       onChange={(e) => setFormData({...formData, floor: e.target.value})}
                                       placeholder="e.g. 3"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="apartment"
                                       className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Apartment</label>
                                <input id="apartment" type="text"
                                       className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                                       value={formData.apartment}
                                       onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                                       placeholder="e.g. 3B"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="unit"
                                       className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Unit</label>
                                <input id="unit" type="text"
                                       className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                                       value={formData.unit}
                                       onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                       placeholder="e.g. 12"/>
                            </div>
                        </div>

                        <button type="submit"
                                className="w-full mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 h-9 px-4 py-2">
                            Confirm Details
                        </button>
                    </form>
                </Card>

                <DetailComponent collection={confirmedList} />
            </div>
        </div>
    );
}