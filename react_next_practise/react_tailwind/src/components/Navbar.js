import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/counter", label: "Counter" },
  { path: "/todo", label: "Todo" },
  { path: "/form", label: "Form" },
  { path: "/accordion", label: "Accordion" },
  { path: "/tabs", label: "Tabs" },
  { path: "/modal", label: "Modal" },
  { path: "/pagination", label: "Pagination" },
  { path: "/stopwatch", label: "Stopwatch" },
  { path: "/products", label: "Products" },
  { path: "/users", label: "Users" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`sticky top-0 z-50 shadow-md ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            React Practice
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Theme toggle + Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
