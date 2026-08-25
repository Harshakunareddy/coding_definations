import { useState, useEffect, useCallback } from 'react';
import './Modal.css';

function ModalComponent({ isOpen, onClose, title, children, showFooter, onConfirm }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {showFooter && (
          <div className="modal-footer">
            <button className="modal-btn modal-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-btn modal-btn--primary" onClick={onConfirm || onClose}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Modal() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmResult, setConfirmResult] = useState('');

  const handleConfirm = () => {
    setConfirmResult('You clicked Confirm!');
    setConfirmOpen(false);
    setTimeout(() => setConfirmResult(''), 3000);
  };

  return (
    <div className="page">
      <h1 className="page-title">Modal</h1>
      <p className="page-subtitle">Reusable modal with click-outside-close, Escape key close, confirm dialog</p>

      <div className="modal-demo">
        <div className="modal-demo-cards">
          <div className="modal-demo-card">
            <h3>Basic Modal</h3>
            <p>A simple modal with a close button. Click outside or press Escape to close.</p>
            <button className="modal-btn modal-btn--primary" onClick={() => setBasicOpen(true)}>
              Open Basic Modal
            </button>
          </div>

          <div className="modal-demo-card">
            <h3>Confirm Dialog</h3>
            <p>A confirmation modal with Cancel and Confirm buttons.</p>
            <button className="modal-btn modal-btn--primary" onClick={() => setConfirmOpen(true)}>
              Open Confirm Dialog
            </button>
            {confirmResult && (
              <div className="modal-result">{confirmResult}</div>
            )}
          </div>

          <div className="modal-demo-card">
            <h3>Info Modal</h3>
            <p>A modal with detailed information content.</p>
            <button className="modal-btn modal-btn--primary" onClick={() => setInfoOpen(true)}>
              Open Info Modal
            </button>
          </div>
        </div>
      </div>

      <ModalComponent isOpen={basicOpen} onClose={() => setBasicOpen(false)} title="Basic Modal">
        <p>This is a basic modal. You can close it by:</p>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', listStyle: 'disc' }}>
          <li>Clicking the X button</li>
          <li>Clicking outside the modal</li>
          <li>Pressing the Escape key</li>
        </ul>
      </ModalComponent>

      <ModalComponent
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Action"
        showFooter
        onConfirm={handleConfirm}
      >
        <p>Are you sure you want to proceed? This action requires your confirmation.</p>
      </ModalComponent>

      <ModalComponent isOpen={infoOpen} onClose={() => setInfoOpen(false)} title="React Information">
        <p>React is a JavaScript library for building user interfaces.</p>
        <p style={{ marginTop: '0.75rem' }}>
          It was created by Jordan Walke at Facebook and has grown to become one of the most popular
          front-end libraries in the world.
        </p>
        <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Press Escape or click outside to close this modal.
        </p>
      </ModalComponent>
    </div>
  );
}
