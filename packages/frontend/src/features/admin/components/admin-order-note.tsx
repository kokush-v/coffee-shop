import { Info } from "lucide-react";

export const AdminOrderNote = ({ value }: { value: string }) => {
  if (!value) return null;

  return (
    <div className="space-y-1 text-zinc-400">
      <p className="flex items-center gap-1 text-sm font-medium">
        <Info size={14} />
        Замовник також просив:
      </p>
      <span className="text-xs text-zinc-800 font-semibold">{value}</span>
    </div>
  );
};
