import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Header } from "@/src/components/header";
import { Footer } from "@/src/components/footer";

import { Unplug } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-white max-w-6xl mx-auto min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="rounded-full bg-primary/5 p-4 mb-2">
          <Unplug className="text-zinc-600" />
        </div>
        <p className="text-sm text-primary/70 font-medium">Схоже цієї сторінки не існує</p>
        <Link href="/">
          <Button variant="link">Повернутись на головну</Button>
        </Link>
      </main>
      <Footer />
    </main>
  );
}
