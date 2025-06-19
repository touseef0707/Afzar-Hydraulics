import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface PumpModalProps {
  data: { flowrate?: number; pressure?: number; power?: number; efficiency?: number };
  position: { x: number; y: number };
  onSave: (data: { flowrate: number; pressure: number; power: number; efficiency: number }) => void;
  onCancel: () => void;
}

export default function PumpModal({ data, position, onSave, onCancel }: PumpModalProps) {
  const [flowrate, setFlowrate] = useState(data.flowrate ?? '');
  const [pressure, setPressure] = useState(data.pressure ?? '');
  const [power, setPower] = useState(data.power ?? '');
  const [efficiency, setEfficiency] = useState(data.efficiency ?? '');
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
      style={{ 
        position: 'fixed', 
        top: modalPos.y, 
        left: modalPos.x, 
        zIndex: 1000, 
        minWidth: '100px',
      }}
      className="bg-white text-gray-900 rounded-lg shadow-xl p-3 border border-gray-200"
    >
      <div className="font-semibold text-base mb-2">Pump Properties</div>
      <div className="flex flex-col gap-2"> {/* Vertical stack container */}
        <input 
          type="number" 
          placeholder="Flowrate (L/min)" 
          value={flowrate} 
          onChange={(e) => setFlowrate(e.target.value)} 
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
        />
        <input 
          type="number" 
          placeholder="Pressure (bar)" 
          value={pressure} 
          onChange={(e) => setPressure(e.target.value)} 
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
        />
        <input 
          type="number" 
          placeholder="Power (kW)" 
          value={power} 
          onChange={(e) => setPower(e.target.value)} 
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
        />
        <input 
          type="number" 
          placeholder="Efficiency (%)" 
          value={efficiency} 
          onChange={(e) => setEfficiency(e.target.value)} 
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
        />
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" 
          onClick={() => onSave({ 
            flowrate: Number(flowrate), 
            pressure: Number(pressure), 
            power: Number(power), 
            efficiency: Number(efficiency) 
          })}
        >
          Save
        </button>
        <button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}