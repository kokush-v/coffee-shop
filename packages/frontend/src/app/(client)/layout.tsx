import type { Metadata } from "next";

import { AnimatePresence } from "framer-motion";

import { Header } from "@/src/components/header";
import { Footer } from "@/src/components/footer";
import { Chat } from "@/src/features/support/ui/chat";

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
    <main className="bg-white max-w-6xl mx-auto min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
      <Chat />
      <Footer />
    </main>
  );
}
