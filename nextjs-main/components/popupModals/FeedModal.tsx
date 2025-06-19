import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface FeedModalProps {
  data: { pressure?: number };
  position: { x: number; y: number };
  onSave: (data: { pressure: number }) => void;
  onCancel: () => void;
}

export default function FeedModal({ data, position, onSave, onCancel }: FeedModalProps) {
  const [pressure, setPressure] = useState(data.pressure ?? 1.0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalPos, setModalPos] = useState(position);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  useLayoutEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const padding = 8;
      let x = position.x;
      let y = position.y;
      if (x + rect.width > window.innerWidth - padding) {
        x = window.innerWidth - rect.width - padding;
      }
      if (y + rect.height > window.innerHeight - padding) {
        y = window.innerHeight - rect.height - padding;
      }
      setModalPos({ x: Math.max(x, padding), y: Math.max(y, padding) });
    }
  }, [position]);

  return (
    <div
      ref={modalRef}
      style={{ position: 'fixed', top: modalPos.y, left: modalPos.x, zIndex: 1000, minWidth: 180 }}
      className="bg-white text-gray-900 rounded-lg shadow-xl p-3 border border-gray-200"
    >
      <div className="font-semibold text-base mb-2">Feed Properties</div>
      <input
        type="number"
        placeholder="Pressure (bar)"
        value={pressure}
        onChange={e => setPressure(Number(e.target.value))}
        className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full mb-2"
      />
      <div className="text-xs text-gray-500 mb-2">Pressure Drop: <span className="italic">Not calculated</span></div>
      <div className="flex gap-2 mt-2 justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" onClick={() => onSave({ pressure })}>Save</button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
