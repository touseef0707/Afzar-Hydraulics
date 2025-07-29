"use client";

import React from "react";

interface CancelWarningProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelWarning({ onCancel, onConfirm }: CancelWarningProps) {
  return (
    <div className="warning-modal-overlay">
      <div className="warning-modal">
        <h3>Are you sure you want to close?</h3>
        <p>Your changes remain unsaved.</p>
        <div className="warning-modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            Keep Editing
          </button>
          <button
            type="button"
            className="btn-confirm"
            onClick={onConfirm}
          >
            Close Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
