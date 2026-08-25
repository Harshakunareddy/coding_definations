import { useState } from 'react';
import './Form.css';

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!values.message.trim()) {
    errors.message = 'Message is required';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  return errors;
};

export default function Form() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const newErrors = validate(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setValues({ name: '', email: '', message: '' });
      setTouched({});
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Contact Form</h1>
      <p className="page-subtitle">Form validation with real-time error messages</p>

      <div className="form-card">
        {submitted && (
          <div className="form-success">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.name && errors.name ? 'form-input--error' : ''}`}
              placeholder="Your name"
            />
            {touched.name && errors.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.email && errors.email ? 'form-input--error' : ''}`}
              placeholder="your@email.com"
            />
            {touched.email && errors.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input form-textarea ${touched.message && errors.message ? 'form-input--error' : ''}`}
              placeholder="Your message (at least 10 characters)"
              rows={5}
            />
            {touched.message && errors.message && (
              <span className="form-error">{errors.message}</span>
            )}
          </div>

          <button type="submit" className="form-submit">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
