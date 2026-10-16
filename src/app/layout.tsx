import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbit — Personal Productivity Command Center",
  description:
    "Organize your day, manage job applications, track development projects, and stay on top of deadlines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#080808] text-[#f5f5f5] flex flex-col font-sans selection:bg-neutral-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
