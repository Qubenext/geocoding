
export function DataItem({label, value}: {label: string, value: string}) {
    return (
        <p>
            <span className="font-semibold text-zinc-500 dark:text-zinc-400 capitalize">
                { label }
            </span>
            <br />
            {value || "N/A"}
        </p>
    )
}