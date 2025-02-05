import type { Metadata } from "next";

import { Header } from "@/src/components/ui/header";
import { Footer } from "@/src/features/footer/ui/footer";

export const metadata: Metadata = {
  title: "Coffee Shop",
  description: "Best coffee beans",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-white max-w-6xl mx-auto h-screen flex flex-col">
      <Header />
      <section className="flex-1">{children}</section>
      <Footer />
    </main>
  );
}
