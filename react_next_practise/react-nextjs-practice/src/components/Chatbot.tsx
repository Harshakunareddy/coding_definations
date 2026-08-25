// ==========================================
// CHATBOT COMPONENT (Floating + Draggable)
// Shows: useState, useRef, useEffect, mouse events,
//        drag logic, conditional rendering, Tailwind
// ==========================================

"use client";

import { useState, useRef, useEffect } from "react";

const staticReplies: Record<string, string> = {
  hello: "Hey there! How can I help you today?",
  hi: "Hi! Welcome to React Practice. Ask me anything!",
  help: "I can help with: React, Next.js, Tailwind CSS, JavaScript, and TypeScript concepts.",
  react: "React is a JavaScript library for building user interfaces using components.",
  nextjs: "Next.js is a React framework with SSR, routing, and API routes built in.",
  tailwind: "Tailwind CSS is a utility-first CSS framework for rapid UI development.",
  hooks: "React Hooks: useState, useEffect, useRef, useReducer, useContext, useMemo, useCallback.",
  typescript: "TypeScript adds static types to JavaScript, catching errors at compile time.",
  thanks: "You're welcome! Happy coding!",
  bye: "Goodbye! Good luck with your interviews!",
};

function getReply(message: string): string {
  const lower = message.toLowerCase().trim();
  for (const key in staticReplies) {
    if (lower.includes(key)) return staticReplies[key];
  }
  return "I'm a static bot — I know about: react, nextjs, tailwind, hooks, typescript. Try one!";
}

interface Message {
  text: string;
  sender: "user" | "bot";
}

// ==========================================
// VERSION 1: DRAGGABLE CHATBOT
// ==========================================
export function DraggableChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm a practice chatbot. Type hello, react, hooks, etc.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set initial position + track window resize
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    setPosition({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasMoved.current = false;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      hasMoved.current = true;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 64, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 64, e.clientY - dragOffset.current.y)),
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    hasMoved.current = false;
    dragOffset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      hasMoved.current = true;
      const touch = e.touches[0];
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 64, touch.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 64, touch.clientY - dragOffset.current.y)),
      });
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { text: input.trim(), sender: "user" };
    const botMsg: Message = { text: getReply(input), sender: "bot" };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleIconClick = () => {
    if (!hasMoved.current) setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Draggable Icon */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleIconClick}
        className="fixed z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing select-none"
        style={{ left: position.x, top: position.y, touchAction: "none" }}
      >
        <ChatIcon isOpen={isOpen} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          chatEndRef={chatEndRef}
          style={{
            left: Math.max(10, Math.min(position.x - 260, windowSize.w - 330)),
            top: Math.max(10, position.y - 400),
          }}
        />
      )}
    </>
  );
}

// ==========================================
// VERSION 2: SIMPLE FIXED CHATBOT (No Drag)
// ==========================================
export function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm a practice chatbot. Type hello, react, hooks, etc.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { text: input.trim(), sender: "user" };
    const botMsg: Message = { text: getReply(input), sender: "bot" };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Fixed Bottom-Right Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg"
      >
        <ChatIcon isOpen={isOpen} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          chatEndRef={chatEndRef}
          className="fixed z-40 bottom-24 right-6"
        />
      )}
    </>
  );
}

// ==========================================
// SHARED COMPONENTS
// ==========================================

function ChatIcon({ isOpen }: { isOpen: boolean }) {
  return isOpen ? (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function ChatWindow({
  messages,
  input,
  setInput,
  handleSend,
  chatEndRef,
  style,
  className,
}: {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  handleSend: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col overflow-hidden ${className || "fixed z-40"}`}
      style={style}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-sm">Practice Bot</p>
          <p className="text-xs text-blue-100">Always online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-full text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Default export uses BOTH — switch here to use one or the other
// Currently using: DraggableChatbot
// To use simple: change to SimpleChatbot
export default function Chatbot() {
  return <DraggableChatbot />;
}
