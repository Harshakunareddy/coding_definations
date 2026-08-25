// ==========================================
// USERS PAGE - Fetch + Loading Skeleton + Delete
// Shows: async/await fetch, loading skeleton UI,
//        optimistic UI update, conditional rendering
// ==========================================

"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
}

// Loading Skeleton Component (shows while data loads)
function UserSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user (optimistic UI - remove immediately, no API wait)
  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Users List</h1>

      <div className="space-y-3">
        {loading
          ? /* Show 5 skeletons while loading */
            Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
          : users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                {/* Avatar with initial */}
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.company.name}</p>
                </div>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            ))}
      </div>

      {!loading && users.length === 0 && (
        <p className="text-center py-10 text-gray-500">No users found.</p>
      )}
    </div>
  );
}
