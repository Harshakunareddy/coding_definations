import { useState, useEffect } from 'react';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Loading users...</p>
        <div className="users-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="user-skeleton">
              <div className="user-skeleton-avatar"></div>
              <div className="skeleton-line skeleton-line--title"></div>
              <div className="skeleton-line skeleton-line--text"></div>
              <div className="skeleton-line skeleton-line--short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Fetch users with skeleton loading & delete ({users.length} users)</p>

      {users.length === 0 ? (
        <div className="users-empty">No users found.</div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <h3 className="user-name">{user.name}</h3>
              <p className="user-username">@{user.username}</p>
              <div className="user-details">
                <div className="user-detail">
                  <span className="user-detail-label">Email</span>
                  <span className="user-detail-value">{user.email.toLowerCase()}</span>
                </div>
                <div className="user-detail">
                  <span className="user-detail-label">Phone</span>
                  <span className="user-detail-value">{user.phone}</span>
                </div>
                <div className="user-detail">
                  <span className="user-detail-label">Company</span>
                  <span className="user-detail-value">{user.company.name}</span>
                </div>
                <div className="user-detail">
                  <span className="user-detail-label">City</span>
                  <span className="user-detail-value">{user.address.city}</span>
                </div>
              </div>
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-website"
              >
                {user.website}
              </a>
              <button className="user-delete" onClick={() => deleteUser(user.id)}>
                Delete User
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
