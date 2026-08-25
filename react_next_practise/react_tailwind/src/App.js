import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import Counter from "./pages/Counter";
import Todo from "./pages/Todo";
import Form from "./pages/Form";
import Accordion from "./pages/Accordion";
import Tabs from "./pages/Tabs";
import Modal from "./pages/Modal";
import Pagination from "./pages/Pagination";
import Stopwatch from "./pages/Stopwatch";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Users from "./pages/Users";
import "./App.css";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/form" element={<Form />} />
          <Route path="/accordion" element={<Accordion />} />
          <Route path="/tabs" element={<Tabs />} />
          <Route path="/modal" element={<Modal />} />
          <Route path="/pagination" element={<Pagination />} />
          <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
}

export default App;
