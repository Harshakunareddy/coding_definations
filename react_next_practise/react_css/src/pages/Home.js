import { Link } from 'react-router-dom';
import './Home.css';

const pages = [
  { path: '/counter', title: 'Counter', desc: 'useReducer based counter with multiple actions', emoji: '🔢' },
  { path: '/todo', title: 'Todo App', desc: 'CRUD todo with localStorage persistence & filters', emoji: '✅' },
  { path: '/form', title: 'Contact Form', desc: 'Form validation with real-time error messages', emoji: '📝' },
  { path: '/accordion', title: 'Accordion', desc: 'FAQ accordion with expand/collapse all', emoji: '🪗' },
  { path: '/tabs', title: 'Tabs', desc: 'Tab component with active state & content switching', emoji: '📑' },
  { path: '/modal', title: 'Modal', desc: 'Reusable modal with click-outside & Escape close', emoji: '🪟' },
  { path: '/pagination', title: 'Pagination', desc: 'Paginated list with page numbers & navigation', emoji: '📄' },
  { path: '/stopwatch', title: 'Stopwatch', desc: 'useRef intervals, start/stop/reset, lap tracking', emoji: '⏱️' },
  { path: '/products', title: 'Products', desc: 'Fetch products with search & category filter', emoji: '🛍️' },
  { path: '/users', title: 'Users', desc: 'Fetch users with skeleton loading & delete', emoji: '👥' },
];

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">React + CSS Practice</h1>
        <p className="home-subtitle">
          A collection of React components and patterns built with plain CSS
        </p>
      </div>

      <div className="home-grid">
        {pages.map(({ path, title, desc, emoji }) => (
          <Link key={path} to={path} className="home-card">
            <span className="home-card-emoji">{emoji}</span>
            <h2 className="home-card-title">{title}</h2>
            <p className="home-card-desc">{desc}</p>
            <span className="home-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
