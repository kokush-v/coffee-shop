import { AuthBackButton } from "@/src/features/auth/components/auth-back-button";
import { History } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coffee Shop - Auth",
  description: "Best coffee beans",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-white max-w-6xl mx-auto min-h-screen grid items-center flex-col">
      <main className="flex mx-auto flex-1 w-full items-baseline my-auto justify-center px-4 gap-4">
        <section className="flex-1 max-w-[310px]">
          <AuthBackButton />
          {children}
        </section>
        <aside className="space-y-2 flex-none max-md:hidden">
          <h1 className="text-xl font-bold text-zinc-700">Переваги авторизації:</h1>
          <div className="flex gap-1.5 text-zinc-500 font-medium text-sm items-center">
            <History className="text-amber-500" size={18} />
            <span>Доступ до історії замовлень</span>
          </div>
        </aside>
      </main>
    </main>
  );
}
