import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Todo.css';

export default function Todo() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)));
    setEditId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <h1 className="page-title">Todo App</h1>
      <p className="page-subtitle">CRUD todo with localStorage persistence & filters</p>

      <div className="todo-container">
        <div className="todo-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button className="todo-add-btn" onClick={addTodo}>
            Add
          </button>
        </div>

        <div className="todo-filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`todo-filter-btn ${filter === f ? 'todo-filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="todo-count">{activeCount} items left</span>
        </div>

        <div className="todo-list">
          {filteredTodos.length === 0 && (
            <div className="todo-empty">
              {filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`}
            </div>
          )}
          {filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}>
              {editId === todo.id ? (
                <div className="todo-edit-row">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    className="todo-edit-input"
                    autoFocus
                  />
                  <button className="todo-action-btn todo-action-btn--save" onClick={() => saveEdit(todo.id)}>
                    Save
                  </button>
                  <button className="todo-action-btn todo-action-btn--cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className="todo-text">{todo.text}</span>
                  </label>
                  <div className="todo-actions">
                    <button className="todo-action-btn todo-action-btn--edit" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button className="todo-action-btn todo-action-btn--delete" onClick={() => deleteTodo(todo.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
