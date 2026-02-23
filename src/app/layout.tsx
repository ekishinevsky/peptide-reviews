import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import MobileSidebarWrapper from "@/components/layout/MobileSidebarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "peptabase",
  description: "Browse and review peptides. Community-driven ratings and discussions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <TopNav />
          <div className="flex">
            <Suspense>
              <LeftSidebar />
              <MobileSidebarWrapper />
            </Suspense>
            <main className="flex-1 min-w-0 px-4 py-6">
              <div className="max-w-[800px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
