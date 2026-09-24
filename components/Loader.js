import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
