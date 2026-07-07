import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3000";

// ---- inline styles (single file, no external css) ----
const s = {
  wrap: { minHeight: "100vh", background: "#f2f4f7", fontFamily: "Arial, sans-serif", color: "#222" },
  topbar: {
    background: "#fff",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: "10px",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  logo: {
    background: "#2563eb",
    color: "#fff",
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  brandName: { fontWeight: "bold", fontSize: "18px" },
  nav: { display: "flex", gap: "6px", flexWrap: "wrap" },
  navBtn: (active) => ({
    background: active ? "#2563eb" : "transparent",
    color: active ? "#fff" : "#444",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  }),
  main: { padding: "20px", maxWidth: "1200px", margin: "0 auto" },
  card: {
    background: "#fff",
    borderRadius: "6px",
    padding: "18px",
    border: "1px solid #e5e7eb",
  },
  h2: { marginTop: 0, marginBottom: "14px", fontSize: "18px" },
  label: { display: "block", marginTop: "10px", marginBottom: "4px", fontSize: "13px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    minHeight: "70px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  btnRow: { marginTop: "16px", display: "flex", gap: "8px" },
  btnPrimary: {
    padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    background: "#2563eb",
    color: "#fff",
  },
  btnSecondary: {
    padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    background: "#6b7280",
    color: "#fff",
  },
  err: { color: "#dc2626", fontSize: "13px", marginTop: "8px" },
  filters: { display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" },
  empty: {
    border: "1px dashed #d1d5db",
    borderRadius: "6px",
    padding: "40px 20px",
    textAlign: "center",
    color: "#6b7280",
  },
  taskList: { listStyle: "none", margin: 0, padding: 0 },
  taskItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  },
  taskTitle: { fontWeight: "bold", marginBottom: "3px" },
  taskDesc: { fontSize: "13px", color: "#555", marginBottom: "6px" },
  badge: (status) => {
    const map = {
      pending: { bg: "#fef3c7", fg: "#92400e" },
      in_progress: { bg: "#dbeafe", fg: "#1e40af" },
      completed: { bg: "#d1fae5", fg: "#065f46" },
    };
    const c = map[status] || { bg: "#eee", fg: "#333" };
    return {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "10px",
      fontSize: "12px",
      textTransform: "capitalize",
      background: c.bg,
      color: c.fg,
    };
  },
  actions: { display: "flex", gap: "6px", flexWrap: "wrap" },
  actionBtn: {
    padding: "4px 10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "13px",
  },
  danger: {
    padding: "4px 10px",
    background: "#dc2626",
    color: "#fff",
    border: "1px solid #dc2626",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
  },
  footerRow: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "#555",
    flexWrap: "wrap",
    gap: "8px",
  },
  pager: { display: "flex", alignItems: "center", gap: "8px" },
  pagerBtn: (disabled) => ({
    padding: "4px 10px",
    border: "none",
    borderRadius: "4px",
    background: disabled ? "#d1d5db" : "#6b7280",
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};

// media queries injected via <style>
const mediaCss = `
@media (max-width: 900px) {
  .grid-inline { grid-template-columns: 1fr !important; }
}
@media (max-width: 600px) {
  .grid-inline { grid-template-columns: 1fr !important; }
  .filters-inline { flex-direction: column !important; }
  .task-item-inline { flex-direction: column !important; }
}
`;

function AppInline() {
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

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setStatus("pending"); setEditingId(null); setErr("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setErr("Title is required"); return; }
    const body = { title, description, status };
    try {
      const url = editingId ? `${API}/tasks/${editingId}` : `${API}/tasks`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
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

  return (
    <div style={s.wrap}>
      <style>{mediaCss}</style>

      <header style={s.topbar}>
        <div style={s.brand}>
          <span style={s.logo}>T</span>
          <span style={s.brandName}>Task Manager</span>
        </div>
        <nav style={s.nav}>
          <button style={s.navBtn(tab === "tasks")} onClick={() => setTab("tasks")}>Tasks</button>
          <button style={s.navBtn(tab === "dashboard")} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button style={s.navBtn(tab === "about")} onClick={() => setTab("about")}>About</button>
        </nav>
      </header>

      <main style={s.main}>
        {tab === "tasks" && (
          <div
            className="grid-inline"
            style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}
          >
            <section style={s.card}>
              <h2 style={s.h2}>{editingId ? "Edit Task" : "Add New Task"}</h2>
              <form onSubmit={submit}>
                <label style={s.label}>Title <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  style={s.input}
                  type="text"
                  placeholder="required field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label style={s.label}>Description</label>
                <textarea
                  style={s.textarea}
                  placeholder="optional textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label style={s.label}>Status <span style={{ color: "#dc2626" }}>*</span></label>
                <select style={s.input} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {err && <p style={s.err}>{err}</p>}

                <div style={s.btnRow}>
                  <button type="submit" style={s.btnPrimary}>
                    {editingId ? "Update" : "Add Task"}
                  </button>
                  <button type="button" style={s.btnSecondary} onClick={resetForm}>Reset</button>
                </div>
              </form>
            </section>

            <section style={s.card}>
              <h2 style={s.h2}>All Tasks</h2>
              <div className="filters-inline" style={s.filters}>
                <input
                  style={{ ...s.input, flex: 1, minWidth: "180px" }}
                  type="text"
                  placeholder="Search by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  style={{ ...s.input, width: "auto" }}
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
                <div style={s.empty}>No tasks yet. Add one using the form on the left.</div>
              ) : (
                <ul style={s.taskList}>
                  {tasks.map((t) => (
                    <li key={t.id} className="task-item-inline" style={s.taskItem}>
                      <div style={{ flex: 1 }}>
                        <div style={s.taskTitle}>{t.title}</div>
                        {t.description && <div style={s.taskDesc}>{t.description}</div>}
                        <span style={s.badge(t.status)}>{t.status.replace("_", " ")}</span>
                      </div>
                      <div style={s.actions}>
                        <button style={s.actionBtn} onClick={() => startEdit(t)}>Edit</button>
                        <button style={s.danger} onClick={() => remove(t.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div style={s.footerRow}>
                <span>Showing {tasks.length} of {total} tasks</span>
                <div style={s.pager}>
                  <button style={s.pagerBtn(page <= 1)} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                  <span>Page {page} / {totalPages}</span>
                  <button style={s.pagerBtn(page >= totalPages)} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === "dashboard" && (
          <div style={s.card}>
            <h2 style={s.h2}>Dashboard</h2>
            <p>Tasks on this page: {tasks.length}</p>
          </div>
        )}

        {tab === "about" && (
          <div style={s.card}>
            <h2 style={s.h2}>About</h2>
            <p>Simple Task Manager. React + Express/Sequelize backend.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AppInline;
