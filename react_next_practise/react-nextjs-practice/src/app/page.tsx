// ==========================================
// HOME PAGE (Server Component)
// Shows: Next.js Link navigation, clean landing page
// ==========================================

import Link from "next/link";

const features = [
  {
    title: "1. Products (API + Search + Dynamic Routes)",
    href: "/products",
    description: "Fetch from API, search/filter, category filter, dynamic product pages",
  },
  {
    title: "2. Todo App (CRUD + LocalStorage)",
    href: "/todo",
    description: "Add, edit, delete, toggle todos with localStorage persistence",
  },
  {
    title: "3. Contact Form (Validation)",
    href: "/form",
    description: "Form with real-time validation, error messages, submit handling",
  },
  {
    title: "4. Counter (useReducer)",
    href: "/counter",
    description: "Counter using useReducer - shows state management without Redux",
  },
  {
    title: "5. Users (Fetch + Skeleton Loading)",
    href: "/users",
    description: "Fetch users from API, loading skeleton UI, optimistic delete",
  },
  {
    title: "6. Tabs Component",
    href: "/tabs",
    description: "Tab switching, active state, conditional content rendering",
  },
  {
    title: "7. Modal / Dialog",
    href: "/modal",
    description: "Reusable modal, click outside close, Escape key, confirm dialog",
  },
  {
    title: "8. Accordion / FAQ",
    href: "/accordion",
    description: "Toggle open/close, multiple open items, expand/collapse all",
  },
  {
    title: "9. Pagination",
    href: "/pagination",
    description: "Page numbers, prev/next, array slicing, page calculation logic",
  },
  {
    title: "10. Stopwatch",
    href: "/stopwatch",
    description: "useRef for intervals, useEffect cleanup, lap tracking, time formatting",
  },
  {
    title: "11. Chatbot (Floating + Draggable)",
    href: "#",
    description: "Static chatbot with floating icon, drag support, keyword-based replies",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        React & Next.js Interview Practice
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Each page demonstrates key concepts commonly asked in interviews.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700 h-full">
              <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
                {feature.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Concepts covered section */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Concepts Covered</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            "useState & useEffect",
            "useReducer",
            "useCallback & useMemo",
            "useRef",
            "Custom Hooks",
            "Context API",
            "API Fetching",
            "Dynamic Routes",
            "Server vs Client Components",
            "next/image & next/link",
            "Form Validation",
            "localStorage",
            "Debouncing",
            "Search & Filter",
            "CRUD Operations",
            "TypeScript",
            "Tailwind CSS",
            "Responsive Design",
          ].map((concept) => (
            <span
              key={concept}
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-gray-700 dark:text-gray-300"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
