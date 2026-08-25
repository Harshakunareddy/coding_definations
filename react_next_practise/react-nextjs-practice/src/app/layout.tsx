// ==========================================
// ROOT LAYOUT (Server Component)
// Shows: App Router layout, metadata, font optimization, provider pattern
// ==========================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React Next.js Practice",
  description: "Interview practice - Products, Todo, Forms, Counter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-950 min-h-screen`}>
        <ThemeProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
