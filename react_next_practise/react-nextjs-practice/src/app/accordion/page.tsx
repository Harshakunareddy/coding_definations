// ==========================================
// ACCORDION / FAQ PAGE
// Shows: Toggle state, map with conditional rendering,
//        single vs multiple open, animation with CSS
// Common interview: "Build an accordion component"
// ==========================================

"use client";

import { useState } from "react";

const faqData = [
  {
    question: "What is React?",
    answer:
      "React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM for efficient updates.",
  },
  {
    question: "What is the difference between useState and useReducer?",
    answer:
      "useState is for simple state (single values, toggles). useReducer is better for complex state logic with multiple sub-values or when the next state depends on the previous one. useReducer also makes state transitions more predictable and testable.",
  },
  {
    question: "What are Server Components in Next.js?",
    answer:
      "Server Components render on the server and send HTML to the client. They can directly access databases, read files, and fetch data without useEffect. They reduce the JavaScript bundle size since their code never reaches the browser. Use 'use client' directive only when you need interactivity (useState, useEffect, event handlers).",
  },
  {
    question: "What is the difference between SSR, SSG, and CSR?",
    answer:
      "SSR (Server-Side Rendering): Page is rendered on every request on the server. Good for dynamic content. SSG (Static Site Generation): Page is pre-built at build time. Best for content that rarely changes. CSR (Client-Side Rendering): Page renders entirely in the browser using JavaScript. Good for dashboards and authenticated pages.",
  },
  {
    question: "Why use TypeScript with React?",
    answer:
      "TypeScript adds static type checking which catches errors at compile time instead of runtime. It provides better IDE support (autocomplete, refactoring), makes code self-documenting through type annotations, and makes large codebases easier to maintain.",
  },
];

export default function AccordionPage() {
  // Set<number> allows multiple items to be open at once
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Expand all / Collapse all
  const expandAll = () => {
    setOpenItems(new Set(faqData.map((_, i) => i)));
  };
  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 dark:text-white">Accordion / FAQ</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={expandAll}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Expand All
        </button>
        <span className="text-gray-400">|</span>
        <button
          onClick={collapseAll}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Collapse All
        </button>
      </div>

      <div className="space-y-2">
        {faqData.map((item, index) => {
          const isOpen = openItems.has(index);
          return (
            <div
              key={index}
              className="border rounded-lg overflow-hidden dark:border-gray-700"
            >
              {/* Question (always visible) */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="font-medium dark:text-white">{item.question}</span>
                <span
                  className={`text-xl transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              {/* Answer (shown when open) */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="p-4 pt-0 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
