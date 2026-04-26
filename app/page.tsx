import { MapboxComponent } from "@/components/map/MapboxComponent";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-zinc-100 font-sans dark:bg-zinc-950 p-4 sm:p-6 overflow-hidden">
      <ClientOnly
        fallback={
          <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white dark:bg-zinc-900">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading map...</p>
            </div>
          </div>
        }
      >
        <MapboxComponent />
      </ClientOnly>
    </div>
  );
}
