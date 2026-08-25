import { useState, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTheme } from "../context/ThemeContext";

export default function Todo() {
  const { theme } = useTheme();
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  // ADD todo
  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
    inputRef.current?.focus();
  };

  // DELETE todo
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // TOGGLE complete
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // START editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // SAVE edit
  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
    setEditingId(null);
  };

  // Handle Enter key
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, addTodo)}
          placeholder="Add a new todo..."
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"
          }`}
        />
        <button
          onClick={addTodo}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span
          className={`ml-auto text-sm self-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {activeCount} item{activeCount !== 1 ? "s" : ""} left
        </span>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <p className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 cursor-pointer"
              />

              {editingId === todo.id ? (
                /* Edit Mode */
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => saveEdit(todo.id))}
                  onBlur={() => saveEdit(todo.id)}
                  autoFocus
                  className={`flex-1 px-2 py-1 border rounded ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                  }`}
                />
              ) : (
                /* Display Mode */
                <span
                  onDoubleClick={() => startEdit(todo)}
                  className={`flex-1 cursor-pointer ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : ""
                  }`}
                >
                  {todo.text}
                </span>
              )}

              {/* Action Buttons */}
              <button
                onClick={() => startEdit(todo)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Clear completed */}
      {todos.some((t) => t.completed) && (
        <button
          onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
          className="mt-4 text-sm text-red-500 hover:text-red-700"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
