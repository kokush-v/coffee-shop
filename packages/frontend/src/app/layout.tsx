import "./globals.css";

// note: until antd doesn't fix compatibility for react 19 we should import this package
import "@ant-design/v5-patch-for-react-19";

import { AntdRegistry } from "@ant-design/nextjs-registry";
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
            <WebsocketMessagingProvider>
              <AntdRegistry>{children}</AntdRegistry>
            </WebsocketMessagingProvider>
          </ReduxProvider>
        </QueryProvider>
        <Toaster theme="light" />
      </body>
    </html>
  );
}
