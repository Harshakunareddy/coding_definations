import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

// Reusable Modal Component
function ModalDialog({ isOpen, onClose, title, children, footer }) {
  const { theme } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 rounded-lg shadow-xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={`px-6 py-4 border-t flex justify-end gap-3 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Modal() {
  const { theme } = useTheme();
  const [showBasic, setShowBasic] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  const handleConfirm = useCallback(() => {
    setConfirmResult("confirmed");
    setShowConfirm(false);
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmResult("cancelled");
    setShowConfirm(false);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modal Component</h1>

      {/* Trigger Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setShowBasic(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Basic Modal
        </button>
        <button
          onClick={() => {
            setConfirmResult(null);
            setShowConfirm(true);
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Confirm Dialog
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Form Modal
        </button>
      </div>

      {/* Confirm Result */}
      {confirmResult && (
        <div
          className={`p-4 rounded-lg mb-6 text-center ${
            confirmResult === "confirmed"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          You {confirmResult === "confirmed" ? "confirmed" : "cancelled"} the action!
        </div>
      )}

      {/* Basic Modal */}
      <ModalDialog
        isOpen={showBasic}
        onClose={() => setShowBasic(false)}
        title="Basic Modal"
        footer={
          <button
            onClick={() => setShowBasic(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Got it!
          </button>
        }
      >
        <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
          This is a basic modal dialog. You can close it by:
        </p>
        <ul className={`list-disc pl-5 mt-3 space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <li>Clicking the X button</li>
          <li>Clicking outside the modal</li>
          <li>Pressing the Escape key</li>
          <li>Clicking the "Got it!" button</li>
        </ul>
      </ModalDialog>

      {/* Confirm Dialog */}
      <ModalDialog
        isOpen={showConfirm}
        onClose={handleCancel}
        title="Confirm Action"
        footer={
          <>
            <button
              onClick={handleCancel}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </ModalDialog>

      {/* Form Modal */}
      <ModalDialog
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Subscribe"
        footer={
          <>
            <button
              onClick={() => setShowForm(false)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert("Subscribed!");
                setShowForm(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Subscribe
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : ""}`}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
              }`}
            />
          </div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            We'll send you updates about new features and tutorials.
          </p>
        </div>
      </ModalDialog>

      {/* Info Section */}
      <div
        className={`mt-8 p-4 rounded-lg text-sm ${
          theme === "dark" ? "bg-blue-900/20" : "bg-blue-50"
        }`}
      >
        <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-blue-300" : "text-blue-800"}`}>
          Modal Features
        </h3>
        <ul className={`list-disc pl-5 space-y-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          <li>Click outside to close (backdrop click)</li>
          <li>Press Escape to close</li>
          <li>Prevents body scroll when open</li>
          <li>Reusable component with customizable header, body, and footer</li>
          <li>Supports confirm dialogs and form modals</li>
        </ul>
      </div>
    </div>
  );
}
