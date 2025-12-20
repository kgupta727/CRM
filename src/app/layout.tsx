import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM",
  description: "Internal CRM for sales activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
          <Sidebar />
          <div className="flex-1">
            <header className="border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="px-6 py-3">
                <Nav />
              </div>
            </header>
            <main className="px-6 py-6 page">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
