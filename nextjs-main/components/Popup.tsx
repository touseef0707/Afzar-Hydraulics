"use client";

import React from 'react';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Popup: React.FC<Props> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl relative max-w-lg w-full">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
