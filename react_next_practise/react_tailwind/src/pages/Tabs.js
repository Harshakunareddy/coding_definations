import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const tabsData = [
  {
    id: "overview",
    label: "Overview",
    content: {
      title: "React Overview",
      body: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components. React has been designed from the start for gradual adoption, and you can use as little or as much React as you need.",
    },
  },
  {
    id: "features",
    label: "Features",
    content: {
      title: "Key Features",
      items: [
        "Virtual DOM for efficient rendering",
        "Component-based architecture",
        "Unidirectional data flow",
        "JSX syntax for writing UI in JavaScript",
        "Rich ecosystem with hooks, context, and more",
        "Server-side rendering support",
        "React Native for mobile development",
      ],
    },
  },
  {
    id: "hooks",
    label: "Hooks",
    content: {
      title: "React Hooks",
      items: [
        "useState - State management in functional components",
        "useEffect - Side effects (data fetching, subscriptions)",
        "useContext - Consume context without nesting",
        "useReducer - Complex state logic (Redux-like)",
        "useRef - Mutable references and DOM access",
        "useMemo - Memoize expensive computations",
        "useCallback - Memoize callback functions",
      ],
    },
  },
  {
    id: "patterns",
    label: "Patterns",
    content: {
      title: "Common Patterns",
      items: [
        "Container/Presentational components",
        "Custom hooks for reusable logic",
        "Render props pattern",
        "Higher-Order Components (HOC)",
        "Compound components",
        "Context + Reducer for state management",
        "Error boundaries for error handling",
      ],
    },
  },
];

export default function Tabs() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(tabsData[0].id);

  const currentTab = tabsData.find((tab) => tab.id === activeTab);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tabs Component</h1>

      {/* Tab Headers */}
      <div
        className={`flex border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-blue-600"
                : theme === "dark"
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`p-6 rounded-b-lg border border-t-0 ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {currentTab && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{currentTab.content.title}</h2>
            {currentTab.content.body && (
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                {currentTab.content.body}
              </p>
            )}
            {currentTab.content.items && (
              <ul className="space-y-2">
                {currentTab.content.items.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span className="text-blue-600 mt-1">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
