import { useState } from 'react';
import './Tabs.css';

const tabsData = [
  {
    label: 'Overview',
    content: `React is a free and open-source front-end JavaScript library for building user interfaces based on components. It was created by Jordan Walke, a software engineer at Facebook, and was first deployed on Facebook's News Feed in 2011. React allows developers to create large web applications that can change data, without reloading the page.`,
  },
  {
    label: 'Features',
    content: `Key features of React include:

• Virtual DOM for efficient updates
• Component-based architecture
• Unidirectional data flow
• JSX syntax for writing UI components
• Rich ecosystem with hooks, context, and more
• Server-side rendering support
• React Native for mobile development`,
  },
  {
    label: 'Getting Started',
    content: `To get started with React, you can use Create React App:

1. Run: npx create-react-app my-app
2. Navigate to the project: cd my-app
3. Start the development server: npm start

This sets up a new React project with all the tooling you need, including webpack, Babel, and ESLint configured out of the box.`,
  },
  {
    label: 'Hooks',
    content: `React Hooks let you use state and other React features without writing a class:

• useState - Add state to functional components
• useEffect - Perform side effects
• useContext - Subscribe to React context
• useReducer - Manage complex state logic
• useRef - Access DOM elements directly
• useMemo - Memoize expensive computations
• useCallback - Memoize callback functions`,
  },
];

export default function Tabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="page">
      <h1 className="page-title">Tabs</h1>
      <p className="page-subtitle">Tab component with active state & content switching</p>

      <div className="tabs-container">
        <div className="tabs-header">
          {tabsData.map((tab, index) => (
            <button
              key={index}
              className={`tabs-btn ${activeIndex === index ? 'tabs-btn--active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tabs-content">
          <h3 className="tabs-content-title">{tabsData[activeIndex].label}</h3>
          <p className="tabs-content-text">{tabsData[activeIndex].content}</p>
        </div>
      </div>
    </div>
  );
}
