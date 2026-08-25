import { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

const botResponses = {
  hello: "Hello! How can I help you today?",
  hi: "Hi there! What can I do for you?",
  hey: "Hey! How's it going?",
  help: "I can answer basic questions. Try asking about: react, javascript, css, or just say hello!",
  react: "React is a JavaScript library for building user interfaces. It uses a virtual DOM for efficient updates!",
  javascript: "JavaScript is a versatile programming language used for web development, both on the client and server side.",
  js: "JavaScript is awesome! It powers most of the modern web.",
  css: "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and more!",
  thanks: "You're welcome! Let me know if you need anything else.",
  bye: "Goodbye! Have a great day! 👋",
  default: "I'm not sure how to respond to that. Try asking about react, javascript, css, or type 'help' for options.",
};

function getBotReply(message) {
  const lower = message.toLowerCase().trim();
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== 'default' && lower.includes(key)) return value;
  }
  return botResponses.default;
}

export function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm a simple chatbot. Ask me anything!", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { text: input.trim(), sender: 'user' };
    const botMsg = { text: getBotReply(input), sender: 'bot' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>🤖 Chatbot</span>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message chatbot-message--${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="chatbot-input"
            />
            <button className="chatbot-send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </>
  );
}

export function DraggableChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm a draggable chatbot. Ask me anything!", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - offsetRef.current.x,
      y: touch.clientY - offsetRef.current.y,
    });
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { text: input.trim(), sender: 'user' };
    const botMsg = { text: getBotReply(input), sender: 'bot' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {isOpen && (
        <div
          ref={dragRef}
          className="chatbot chatbot--draggable"
          style={
            position.x || position.y
              ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
              : {}
          }
        >
          <div
            className="chatbot-header chatbot-header--draggable"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <span>🤖 Chatbot (drag me!)</span>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message chatbot-message--${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="chatbot-input"
            />
            <button className="chatbot-send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </>
  );
}

export default DraggableChatbot;
