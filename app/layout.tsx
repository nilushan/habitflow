import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { fraunces, dmSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitFlow - AI-Powered Habit Tracking",
  description: "Minimalist, privacy-first habit tracker with AI insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
