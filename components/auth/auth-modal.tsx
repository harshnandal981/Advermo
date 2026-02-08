"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './login-form';
import SignupForm from './signup-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultView = 'signup' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-background rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {view === 'login' ? (
            <LoginForm
              onSuccess={onClose}
              onSwitchToSignup={() => setView('signup')}
            />
          ) : (
            <SignupForm
              onSuccess={onClose}
              onSwitchToLogin={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
