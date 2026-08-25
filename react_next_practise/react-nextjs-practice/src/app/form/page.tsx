// ==========================================
// CONTACT FORM PAGE (Client Component)
// Shows: Form handling, controlled inputs, validation,
//        error messages, submit handling, TypeScript
// ==========================================

"use client";

import { useState } from "react";
import { FormData, FormErrors } from "@/types";

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validation function
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  // Handle input change (single handler for all fields)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    const validationErrors = validate();
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setSubmitted(true);
    setSubmitting(false);
    setFormData(initialFormData);
  };

  // Success message after submit
  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Thank You!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your message has been sent successfully.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Contact Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white resize-none ${
              errors.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }`}
            placeholder="Your message here..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
