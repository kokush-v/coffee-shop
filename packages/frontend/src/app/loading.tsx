import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full grid place-content-center bg-white">
      <Loader className="animate-spin text-zinc-600" size={14} />
    </div>
  );
}
