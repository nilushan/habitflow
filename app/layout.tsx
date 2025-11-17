import type { Metadata } from "next";
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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
