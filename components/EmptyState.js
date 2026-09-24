import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your search or filters.",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-200 bg-white py-16 text-center">
      <div className="rounded-full bg-brand-50 p-3">
        <PackageSearch className="h-6 w-6 text-brand-600" />
      </div>
      <p className="font-medium text-ink-800">{title}</p>
      <p className="max-w-xs text-sm text-ink-500">{description}</p>
    </div>
  );
}
