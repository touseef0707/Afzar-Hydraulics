"use client";

import React from "react";

interface CancelWarningProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelWarning({ onCancel, onConfirm }: CancelWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-white/95 overflow-hidden">
        <h3 className="text-lg font-semibold mb-2">Are you sure you want to close?</h3>
        <p className="text-gray-600 mb-4">Your changes remain unsaved.</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            Keep Editing
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={onConfirm}
          >
            Close Anyway
          </button>
        </div>
      </div>
    </div>
  );
}