// ==========================================
// MODAL / DIALOG PAGE
// Shows: Portal-like pattern, overlay, open/close state,
//        keyboard handling (Escape), click outside to close
// Very common: "Build a reusable modal component"
// ==========================================

"use client";

import { useState, useEffect, useRef } from "react";

// Reusable Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Close on click outside modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      {/* Modal Box */}
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="dark:text-gray-300">{children}</div>
      </div>
    </div>
  );
}

// Confirm Dialog (built on top of Modal)
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Action">
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default function ModalPage() {
  const [showBasic, setShowBasic] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Modal / Dialog</h1>

      <div className="space-y-4">
        {/* Button 1: Basic Modal */}
        <button
          onClick={() => setShowBasic(true)}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-left"
        >
          Open Basic Modal
        </button>

        {/* Button 2: Form Modal */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-left"
        >
          Open Form Modal
        </button>

        {/* Button 3: Confirm Delete */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-left"
        >
          Open Confirm Dialog
        </button>
      </div>

      {/* Items List */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2 dark:text-white">Items ({items.length})</h3>
        {items.map((item, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-400">{item}</p>
        ))}
      </div>

      {/* Basic Modal */}
      <Modal isOpen={showBasic} onClose={() => setShowBasic(false)} title="Basic Modal">
        <p>This is a basic modal. You can close it by:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Clicking the X button</li>
          <li>Pressing Escape key</li>
          <li>Clicking outside the modal</li>
        </ul>
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Item">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              setItems((prev) => [...prev, name.trim()]);
              setName("");
              setShowForm(false);
            }
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            autoFocus
            className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Item
          </button>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => setItems([])}
        message="Are you sure you want to delete all items? This cannot be undone."
      />
    </div>
  );
}
