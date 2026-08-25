import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const pages = [
  { path: "/counter", title: "Counter", desc: "useReducer based counter with history", emoji: "🔢" },
  { path: "/todo", title: "Todo App", desc: "CRUD with localStorage persistence", emoji: "📝" },
  { path: "/form", title: "Contact Form", desc: "Validation with real-time error messages", emoji: "📋" },
  { path: "/accordion", title: "Accordion", desc: "FAQ with expand/collapse all", emoji: "🪗" },
  { path: "/tabs", title: "Tabs", desc: "Tab component with active state", emoji: "📑" },
  { path: "/modal", title: "Modal", desc: "Reusable modal with click-outside close", emoji: "🪟" },
  { path: "/pagination", title: "Pagination", desc: "Paginated list with page numbers", emoji: "📄" },
  { path: "/stopwatch", title: "Stopwatch", desc: "useRef intervals with lap tracking", emoji: "⏱️" },
  { path: "/products", title: "Products", desc: "API fetch with search & filter", emoji: "🛍️" },
  { path: "/users", title: "Users", desc: "API fetch with skeleton loading", emoji: "👥" },
];

export default function Home() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          React + Tailwind Practice
        </h1>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          A collection of React components and patterns for interview preparation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            className={`group p-6 rounded-lg border transition-all hover:shadow-lg hover:-translate-y-1 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="text-3xl mb-3">{page.emoji}</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
              {page.title}
            </h2>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {page.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
