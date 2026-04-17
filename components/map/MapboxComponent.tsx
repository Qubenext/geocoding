"use client";

import {useState} from "react";
import {Map, MapControls, MapMarker, MarkerContent, MapViewport} from "@/components/ui/map";
import {Card} from "@/components/ui/card";
import SelectEventAction from "@/actions/SelectEventAction";
import UserLocatorAction from "@/actions/UserLocatorAction";
import StatusComponent from "@/components/map/StatusComponent";
import DetailComponent from "@/components/map/DetailComponent";
import SubmitComponent from "@/components/map/SubmitComponent";
import {IDataList} from "@/types/map.type";
import useReverseGeocoding from "@/hooks/useReverseGeocoding";


export function MapboxComponent() {
    const [viewport, setViewport] = useState<MapViewport>({
        center: [88.36592070677423, 22.57394462525124],
        zoom: 11,
        bearing: 0,
        pitch: 0,
    });
    const {location, response, setResponse, progress, handleMapClick } = useReverseGeocoding();
    const [dataList, setDataList] = useState<IDataList[]>([]);

    return (
        <div className="flex flex-col lg:flex-row h-full w-full gap-4 sm:gap-6 overflow-hidden">
            <Card
                className="w-full lg:w-[70%] h-[40vh] lg:h-full p-0 overflow-hidden relative shadow-lg border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col bg-white dark:bg-zinc-900">
                <Map center={[88.36592070677423, 22.57394462525124]} zoom={11} onViewportChange={setViewport}>
                    <MapControls position="bottom-right" showZoom showCompass showLocate showFullscreen/>
                    <SelectEventAction location={handleMapClick}/>
                    <UserLocatorAction location={handleMapClick}/>
                    {/* Render a marker if the user has clicked on the map */}
                    {location && (
                        <MapMarker longitude={location.lng} latitude={location.lat}>
                            <MarkerContent/>
                        </MapMarker>
                    )}
                    <StatusComponent viewport={viewport}/>
                </Map>
            </Card>
            <div className="w-full lg:w-[30%] flex flex-col gap-4 sm:gap-6 overflow-hidden h-full">
                <SubmitComponent location={location} reversed={response} setReversed={setResponse} progress={progress} setDatalist={setDataList}/>
                <DetailComponent collection={dataList}/>
            </div>
        </div>
    );
}