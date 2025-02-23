import { X } from 'lucide-react';
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Continue",
  cancelText = "Back"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-DarkGreen">{title}</h3>
          <button
            onClick={onClose}
            className="text-tertiary-text hover:text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-secondary-text mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-neutral-100 text-secondary-text"
            style={{
                borderColor: 'var(--color-gray-300)',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-primary-green text-white hover:bg-primary-hover"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}