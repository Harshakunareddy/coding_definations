import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

// Keyword-based replies
const botReplies = {
  hello: "Hi there! How can I help you today?",
  hi: "Hello! What can I do for you?",
  help: "I can answer questions about this React practice project. Try asking about 'react', 'hooks', 'tailwind', or 'routing'!",
  react: "React is a JavaScript library for building user interfaces. This project demonstrates many React patterns!",
  hooks: "React Hooks let you use state and lifecycle features in functional components. This project uses useState, useReducer, useRef, useEffect, useContext, and custom hooks!",
  tailwind: "Tailwind CSS is a utility-first CSS framework. This entire project is styled with Tailwind!",
  routing: "This project uses react-router-dom for client-side routing with BrowserRouter, Routes, Route, Link, and useParams.",
  state: "State management in this project includes useState, useReducer, Context API, and localStorage persistence.",
  thanks: "You're welcome! Feel free to ask more questions.",
  bye: "Goodbye! Happy coding!",
};

function getBotReply(message) {
  const lower = message.toLowerCase().trim();
  for (const [keyword, reply] of Object.entries(botReplies)) {
    if (lower.includes(keyword)) {
      return reply;
    }
  }
  return "I'm not sure about that. Try asking about 'react', 'hooks', 'tailwind', 'routing', or 'state'!";
}

// ==========================================
// Simple Chatbot (non-draggable)
// ==========================================
export function SimpleChatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm a React chatbot. Ask me about this project!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: getBotReply(trimmed), sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className={`mb-4 w-80 rounded-lg shadow-2xl border overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Chatbot</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 text-lg">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

// ==========================================
// Draggable Chatbot
// ==========================================
export function DraggableChatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm a draggable React chatbot. Ask me about this project!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: window.innerHeight - 500 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragOffset.current.y)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: getBotReply(trimmed), sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div
          className={`fixed w-80 rounded-lg shadow-2xl border overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
          style={{ left: position.x, top: position.y }}
        >
          {/* Draggable Header */}
          <div
            className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <span className="font-semibold">Chatbot (Drag me!)</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80 text-lg"
              onMouseDown={(e) => e.stopPropagation()}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

// Default export uses DraggableChatbot
export default DraggableChatbot;
