// ==========================================
// TODO APP (Client Component)
// Shows: CRUD operations, useState, useRef, localStorage,
//        conditional rendering, list rendering with keys
// ==========================================

"use client";

import { useState, useRef } from "react";
import { Todo } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function TodoPage() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // ADD todo
  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: Date.now(), // Simple unique ID
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
    inputRef.current?.focus(); // useRef to focus input after adding
  };

  // DELETE todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // TOGGLE complete
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // START editing
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // SAVE edit
  const saveEdit = (id: number) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
    setEditingId(null);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
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
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Todo App</h1>

      {/* Add Todo Input */}
      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, addTodo)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 self-center">
          {activeCount} item{activeCount !== 1 ? "s" : ""} left
        </span>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
        </p>
      ) : (
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
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
                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              ) : (
                /* Display Mode */
                <span
                  onDoubleClick={() => startEdit(todo)}
                  className={`flex-1 cursor-pointer dark:text-white ${
                    todo.completed ? "line-through text-gray-400" : ""
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
