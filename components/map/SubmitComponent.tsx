import {Card} from "@/components/ui/card";
import React from "react";
import {IDataList} from "@/types/map.type";
import useConfirmedAddress from "@/hooks/useConfirmedAddress";
import {CheckCircle2} from "lucide-react";

interface IProps {
    location: { lng: number; lat: number } | null;
    reversed: string;
    setReversed: React.Dispatch<React.SetStateAction<string>>;
    progress: boolean;
    setDatalist: React.Dispatch<React.SetStateAction<IDataList[]>>;
}

export default function SubmitComponent({location, reversed, setReversed, progress, setDatalist}: IProps) {
    const {formData, setFormData, handleSubmit} = useConfirmedAddress({location, reversed, setDatalist});

    return (
        <Card
            className="shrink-0 p-5 sm:p-6 shadow-lg border-zinc-200 dark:border-zinc-800 overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="latitude" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Latitude
                        </label>
                        <input
                            id="latitude"
                            className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                            value={location ? location.lat.toFixed(6) : ""}
                            readOnly
                            placeholder="Click map"
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="longitude" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Longitude
                        </label>
                        <input
                            id="longitude"
                            className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                            value={location ? location.lng.toFixed(6) : ""}
                            readOnly
                            placeholder="Click map"
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                    <label htmlFor="address" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Address
                    </label>
                    <textarea
                        id="address"
                        className="flex min-h-15 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                        value={progress ? "Loading address..." : reversed}
                        onChange={(e) => setReversed(e.target.value)}
                        placeholder="Click on the map to automatically fill the address"
                        readOnly={progress}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="floor" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Floor No.
                        </label>
                        <input id="floor" type="text"
                               className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                               value={formData.floor}
                               onChange={(e) => setFormData({...formData, floor: e.target.value})}
                               placeholder="e.g. 3"/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="apartment" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Apartment
                        </label>
                        <input id="apartment" type="text"
                               className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                               value={formData.apartment}
                               onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                               placeholder="e.g. 3B"/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="unit" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Unit
                        </label>
                        <input id="unit" type="text"
                               className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                               value={formData.unit}
                               onChange={(e) => setFormData({...formData, unit: e.target.value})}
                               placeholder="e.g. 12"/>
                    </div>
                </div>

                <button type="submit"
                        className="w-full mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 h-9 px-4 py-2">
                    <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true"/>
                    Confirm Details
                </button>
            </form>
        </Card>
    )
}