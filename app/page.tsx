import { MapboxComponent } from "@/components/map/MapboxComponent";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-zinc-100 font-sans dark:bg-zinc-950 p-4 sm:p-6 overflow-hidden">
        <MapboxComponent />
    </div>
  );
}
