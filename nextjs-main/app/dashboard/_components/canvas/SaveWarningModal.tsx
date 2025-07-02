import React from 'react';

interface SaveWarningModalProps {
  onSave: () => void;
  onCancel: () => void;
}

const SaveWarningModal: React.FC<SaveWarningModalProps> = ({ onSave, onCancel }) => (
  <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-red-600">Unsaved Changes</h2>
      <p className="mb-6 text-gray-700">
        You have unsaved changes on your canvas. Are you sure you want to leave without saving?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save & Leave
        </button>
      </div>
    </div>
  </div>
);

export default SaveWarningModal;
