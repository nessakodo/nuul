import type { Metadata } from "next";
import "./globals.css";
import ClientRuntime from "@/components/ClientRuntime";

export const metadata: Metadata = {
  title: "NUUL — Safe Export Studio",
  description: "Local-first privacy scan and safe export studio for screenshots and photos."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientRuntime />
        {children}
      </body>
    </html>
  );
}
