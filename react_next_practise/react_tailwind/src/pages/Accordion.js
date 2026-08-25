import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const faqData = [
  {
    id: 1,
    question: "What is React?",
    answer:
      "React is a JavaScript library for building user interfaces. It lets you create reusable UI components and efficiently update the DOM using a virtual DOM.",
  },
  {
    id: 2,
    question: "What are React Hooks?",
    answer:
      "Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, useReducer, useRef, useMemo, and useCallback.",
  },
  {
    id: 3,
    question: "What is the Virtual DOM?",
    answer:
      "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to determine what changes need to be made to the real DOM, making updates more efficient through a process called reconciliation.",
  },
  {
    id: 4,
    question: "What is JSX?",
    answer:
      "JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write UI elements directly in JavaScript code. JSX is compiled to React.createElement() calls.",
  },
  {
    id: 5,
    question: "What is the difference between props and state?",
    answer:
      "Props are read-only data passed from parent to child components. State is mutable data managed within a component. Props flow down, state is local. Both trigger re-renders when changed.",
  },
  {
    id: 6,
    question: "What is useEffect used for?",
    answer:
      "useEffect is used for side effects in functional components - things like data fetching, subscriptions, DOM manipulation, and timers. It runs after render and can optionally clean up.",
  },
];

export default function Accordion() {
  const { theme } = useTheme();
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenItems(new Set(faqData.map((item) => item.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">FAQ Accordion</h1>

      {/* Expand/Collapse All */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className={`px-4 py-2 rounded-lg transition-colors text-sm border ${
            theme === "dark"
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Collapse All
        </button>
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        {faqData.map((item) => {
          const isOpen = openItems.has(item.id);
          return (
            <div
              key={item.id}
              className={`rounded-lg border overflow-hidden ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <span className="font-semibold pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  } ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div
                  className={`px-6 pb-4 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
