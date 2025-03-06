import "./globals.css";

import { Inter } from "next/font/google";

import type { Metadata } from "next";

import { ReduxProvider } from "@/src/providers/redux-provider";
import { QueryProvider } from "@/src/providers/query-client-provider";

import { cn } from "@/src/lib/utils";

import { Toaster } from "@/src/components/ui/sonner";

import { WebsocketMessagingProvider } from "@/src/providers/websocket-messaging-provider";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Coffee Shop",
  description: "Best coffee beans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased coffee-beans-bg", interSans.className)}>
        <QueryProvider>
          <ReduxProvider>
            <WebsocketMessagingProvider>{children}</WebsocketMessagingProvider>
          </ReduxProvider>
        </QueryProvider>
        <Toaster
          theme="light"
          toastOptions={{ style: { pointerEvents: "auto", userSelect: "none" } }}
        />
      </body>
    </html>
  );
}
