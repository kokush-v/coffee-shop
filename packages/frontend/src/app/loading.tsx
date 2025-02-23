import { ActivityIndicator } from "@/src/components/ui/activity-indicator";

export default function Loading() {
  return (
    <div className="min-h-screen w-full grid place-content-center bg-white">
      <ActivityIndicator />
    </div>
  );
}
