// ==========================================
// NAVBAR COMPONENT
// Shows: Next.js Link, usePathname, client component,
//        theme toggle, responsive design, useState toggle
// ==========================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/todo", label: "Todo" },
  { href: "/form", label: "Form" },
  { href: "/counter", label: "Counter" },
  { href: "/users", label: "Users" },
  { href: "/tabs", label: "Tabs" },
  { href: "/modal", label: "Modal" },
  { href: "/accordion", label: "FAQ" },
  { href: "/pagination", label: "Pagination" },
  { href: "/stopwatch", label: "Stopwatch" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-3">
      <div className="max-w-6xl mx-auto">
        {/* Top row: logo + hamburger */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            React Practice
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-1 border rounded text-sm dark:border-gray-600 dark:text-white"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl dark:text-white"
            >
              {menuOpen ? "\u00d7" : "\u2630"}
            </button>
          </div>
        </div>

        {/* Nav links - scrollable on desktop, dropdown on mobile */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-wrap gap-2 mt-3`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
