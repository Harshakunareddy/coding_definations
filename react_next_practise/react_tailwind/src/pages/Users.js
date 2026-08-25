import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

// Skeleton loading component
function UserSkeleton() {
  return (
    <div className="animate-pulse p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function Users() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
    return () => controller.abort();
  }, []);

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className={`text-center py-10 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          No users found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-lg border transition-shadow hover:shadow-md ${
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      @{user.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className={`mt-3 space-y-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <p className="flex items-center gap-2">
                  <span>📧</span> {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span> {user.phone}
                </p>
                <p className="flex items-center gap-2">
                  <span>🌐</span> {user.website}
                </p>
                <p className="flex items-center gap-2">
                  <span>🏢</span> {user.company.name}
                </p>
                <p className="flex items-center gap-2">
                  <span>📍</span> {user.address.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
