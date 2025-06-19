import React, { useState } from 'react';

interface ProductModalProps {
  data: { pressureDrop?: number };
  position: { x: number; y: number };
  onSave: (data: { pressureDrop: number }) => void;
  onCancel: () => void;
}

export default function ProductModal({ data, position, onSave, onCancel }: ProductModalProps) {
  const [pressureDrop, setPressureDrop] = useState(data.pressureDrop ?? '');
  return (
    <div
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 1000 }}
      className="bg-white text-gray-900 rounded-lg shadow-xl p-3 min-w-[180px] border border-gray-200"
    >
      <div className="font-semibold text-base mb-2">Product Properties</div>
      <input type="number" placeholder="Pressure Drop" value={pressureDrop} onChange={e => setPressureDrop(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full mb-2" />
      <div className="flex gap-2 mt-2 justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" onClick={() => onSave({ pressureDrop: Number(pressureDrop) })}>Save</button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
