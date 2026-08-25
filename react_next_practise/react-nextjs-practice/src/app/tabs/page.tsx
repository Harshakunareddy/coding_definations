// ==========================================
// TABS COMPONENT PAGE
// Shows: Tab switching pattern, conditional rendering,
//        active state styling, component composition
// Very common interview question: "Build a tabs component"
// ==========================================

"use client";

import { useState } from "react";

const tabsData = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Project Overview</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          This is a React & Next.js practice project built for interview preparation.
          It covers all the essential concepts you need to know.
        </p>
        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
          <li>Built with Next.js App Router</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
        </ul>
      </div>
    ),
  },
  {
    id: "features",
    label: "Features",
    content: (
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Key Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {["Search & Filter", "CRUD Operations", "Form Validation", "Dark Mode", "API Integration", "Responsive Design"].map((f) => (
            <div key={f} className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm dark:text-gray-300">
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "tech",
    label: "Tech Stack",
    content: (
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Technology Stack</h3>
        <div className="space-y-3">
          {[
            { name: "React 19", desc: "UI library with hooks" },
            { name: "Next.js 16", desc: "Full-stack React framework" },
            { name: "TypeScript", desc: "Static type checking" },
            { name: "Tailwind CSS v4", desc: "Utility-first CSS" },
          ].map((tech) => (
            <div key={tech.name} className="flex items-center gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400 w-32">{tech.name}</span>
              <span className="text-gray-600 dark:text-gray-400">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);

  const activeContent = tabsData.find((tab) => tab.id === activeTab);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Tabs Component</h1>

      {/* Tab Headers */}
      <div className="flex border-b dark:border-gray-700">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
            {/* Active indicator line */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-b-lg border border-t-0 dark:border-gray-700">
        {activeContent?.content}
      </div>
    </div>
  );
}
