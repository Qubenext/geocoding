import { Card } from "@/components/ui/card";
import { DataItem } from "../partials/detail";

interface ICollection {
    id: number;
    coordinates: string;
    address: string;
    floor: string;
    apartment: string;
    unit: string;
}

export default function DetailComponent({ collection }: { collection: ICollection[] }) {
    return (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
            {collection.map((item) => (
                <Card key={item.id}
                    className="p-5 bg-white dark:bg-zinc-900 border-green-500/50 shadow-md flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300 rounded-3xl">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-green-600 dark:text-green-400">
                            Confirmed Location
                        </h3>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(item.id).toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
                        <DataItem label="coordinates" value={item.coordinates} />
                        <DataItem label="address" value={item.address} />
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                            <DataItem label="floor" value={item.floor} />
                            <DataItem label="apartment" value={item.apartment} />
                            <DataItem label="unit" value={item.unit} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}