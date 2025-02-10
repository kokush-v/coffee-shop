import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/src/components/ui/button";

export const AuthBackButton = () => {
  return (
    <Button variant="link">
      <Link href="/" className="flex items-center text-zinc-600 gap-1.5">
        <ArrowLeft size={18} />
        <span className="text-xs font-semibold">На головну</span>
      </Link>
    </Button>
  );
};
