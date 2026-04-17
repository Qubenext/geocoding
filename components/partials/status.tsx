export function ListItem({ label, value }: { label: string, value: string }) {
    return (
        <span>
            <span className="text-zinc-500 dark:text-zinc-400">
                {label}
            </span>{" "}
            {value}
        </span>
    )
}