import { useState } from 'react';
import './Accordion.css';

const faqData = [
  {
    question: 'What is React?',
    answer: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.',
  },
  {
    question: 'What is JSX?',
    answer: 'JSX is a syntax extension for JavaScript that looks similar to HTML. It is used with React to describe what the UI should look like. JSX produces React elements.',
  },
  {
    question: 'What are hooks in React?',
    answer: 'Hooks are functions that let you use state and other React features in functional components. Common hooks include useState, useEffect, useContext, and useReducer.',
  },
  {
    question: 'What is the virtual DOM?',
    answer: 'The virtual DOM is a lightweight copy of the actual DOM. React uses it to determine what changes need to be made to the real DOM, making updates more efficient.',
  },
  {
    question: 'What is the difference between props and state?',
    answer: 'Props are read-only data passed from parent to child components. State is mutable data managed within a component that can change over time and trigger re-renders.',
  },
  {
    question: 'What is useEffect used for?',
    answer: 'useEffect is used for side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after the component renders.',
  },
];

export default function Accordion() {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = (index) => {
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

  const expandAll = () => {
    setOpenItems(new Set(faqData.map((_, i) => i)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="page">
      <h1 className="page-title">Accordion</h1>
      <p className="page-subtitle">FAQ accordion with expand/collapse all</p>

      <div className="accordion-container">
        <div className="accordion-controls">
          <button className="accordion-control-btn" onClick={expandAll}>
            Expand All
          </button>
          <button className="accordion-control-btn" onClick={collapseAll}>
            Collapse All
          </button>
        </div>

        <div className="accordion-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`accordion-item ${openItems.has(index) ? 'accordion-item--open' : ''}`}
            >
              <button className="accordion-header" onClick={() => toggle(index)}>
                <span className="accordion-question">{item.question}</span>
                <span className="accordion-icon">
                  {openItems.has(index) ? '−' : '+'}
                </span>
              </button>
              <div className="accordion-body">
                <div className="accordion-answer">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
