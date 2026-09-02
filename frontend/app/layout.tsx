import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Meridian Hospital | Management System",
  description: "A small hospital management system for learning PostgreSQL & full-stack development",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable} font-body bg-canvas`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
