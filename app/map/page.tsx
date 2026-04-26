import { ClientOnly } from "@/components/ClientOnly";
import { MapView } from "@/components/shape/MapView";

export default function MapPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 p-4 font-sans dark:bg-zinc-950 sm:p-6">
      <div className="h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <ClientOnly
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-zinc-900">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Loading map...</p>
              </div>
            </div>
          }
        >
          <MapView />
        </ClientOnly>
      </div>
    </div>
  );
}