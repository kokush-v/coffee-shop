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
    <main className="bg-white max-w-6xl mx-auto min-h-screen flex flex-col">
      <section className="flex-1">{children}</section>
    </main>
  );
}
