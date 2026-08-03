import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const API = "http://localhost:5000";

function App() {
  const [tab, setTab] = useState("tasks");

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`${API}/tasks?${params.toString()}`);
      const data = await res.json();
      setTasks(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      setErr("Failed to load tasks");
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setEditingId(null);
    setErr("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    const body = { title, description, status };
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API}/tasks/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const d = await res.json();
        setErr(d.error || "Save failed");
        return;
      }
      resetForm();
      loadTasks();
    } catch (e2) {
      setErr("Network error");
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setTitle(t.title);
    setDescription(t.description || "");
    setStatus(t.status);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  };

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="brand">
          <span className="logo">T</span>
          <span className="brand-name">Task Manager</span>
        </div>
        <nav className="nav">
          <button
            className={tab === "tasks" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={tab === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={tab === "about" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("about")}
          >
            About
          </button>
        </nav>
      </header>

      <main className="main">
        {tab === "tasks" && (
          <div className="grid">
            <section className="card form-card">
              <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>
              <form onSubmit={submit}>
                <label>Title <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="required field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label>Description</label>
                <textarea
                  placeholder="optional textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label>Status <span className="req">*</span></label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {err && <p className="err">{err}</p>}

                <div className="btn-row">
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update" : "Add Task"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Reset
                  </button>
                </div>
              </form>
            </section>

            <section className="card list-card">
              <h2>All Tasks</h2>
              <div className="filters">
                <input
                  type="text"
                  className="search"
                  placeholder="Search by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {tasks.length === 0 ? (
                <div className="empty">
                  No tasks yet. Add one using the form on the left.
                </div>
              ) : (
                <ul className="task-list">
                  {tasks.map((t) => (
                    <li key={t.id} className="task-item">
                      <div className="task-main">
                        <div className="task-title">{t.title}</div>
                        {t.description && (
                          <div className="task-desc">{t.description}</div>
                        )}
                        <span className={`badge ${t.status}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => startEdit(t)}>Edit</button>
                        <button className="danger" onClick={() => remove(t.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="footer-row">
                <span>Showing {tasks.length} of {total} tasks</span>
                <div className="pager">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Prev
                  </button>
                  <span>Page {page} / {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === "dashboard" && (
          <div className="card">
            <h2>Dashboard</h2>
            <p>Total tasks on this page: {tasks.length}</p>
            <ul>
              <li>Pending: {counts.pending}</li>
              <li>In Progress: {counts.in_progress}</li>
              <li>Completed: {counts.completed}</li>
            </ul>
          </div>
        )}

        {tab === "about" && (
          <div className="card">
            <h2>About</h2>
            <p>Simple Task Manager. React frontend + Express/Sequelize backend.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
