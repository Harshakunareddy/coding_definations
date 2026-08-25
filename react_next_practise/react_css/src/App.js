import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Counter from './pages/Counter';
import Todo from './pages/Todo';
import Form from './pages/Form';
import Accordion from './pages/Accordion';
import Tabs from './pages/Tabs';
import Modal from './pages/Modal';
import Pagination from './pages/Pagination';
import Stopwatch from './pages/Stopwatch';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Users from './pages/Users';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app">
          <Navbar />
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
          <Chatbot />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
