import { MapViewport } from "@/components/ui/map";
import { ListItem } from "@/components/partials/status";

interface IProps {
    viewport: MapViewport;
}

export default function StatusComponent({ viewport }: IProps) {
    return (
        <div
            className="bg-white/80 dark:bg-zinc-900/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded-md border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 font-mono text-xs text-zinc-900 dark:text-zinc-100 shadow-sm backdrop-blur">
            <ListItem label="lng:" value={viewport.center[0].toFixed(3)} />
            <ListItem label="lat:" value={viewport.center[1].toFixed(3)} />
            <ListItem label="zoom:" value={viewport.zoom.toFixed(1)} />
            <ListItem label="bearing:" value={`${viewport.bearing.toFixed(1)}°`} />
            <ListItem label="pitch:" value={`${viewport.pitch.toFixed(1)}°`} />
        </div>
    );
}