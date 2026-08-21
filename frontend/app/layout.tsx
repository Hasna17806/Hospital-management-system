import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
// @ts-expect-error – Next.js global stylesheet typing is not provided in this project setup.
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 lg:pl-64">
            <MobileNav />
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
