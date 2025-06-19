import React, { useState } from 'react';

interface PipeModalProps {
  data: { diameter?: number; length?: number; density?: number; flowrate?: number; pressureDrop?: number; source?: string; target?: string };
  position: { x: number; y: number };
  onSave: (data: { diameter: number; length: number; density: number; flowrate: number; pressureDrop: number }) => void;
  onCancel: () => void;
}

export default function PipeModal({ data, position, onSave, onCancel }: PipeModalProps) {
  const [diameter, setDiameter] = useState(data.diameter ?? '');
  const [length, setLength] = useState(data.length ?? '');
  const [density, setDensity] = useState(data.density ?? '');
  const [flowrate, setFlowrate] = useState(data.flowrate ?? '');
  const [pressureDrop, setPressureDrop] = useState(data.pressureDrop ?? '');
  return (
    <div
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 1000 }}
      className="bg-white text-gray-900 rounded-lg shadow-xl p-3 min-w-[220px] border border-gray-200"
    >
      <div className="font-semibold text-base mb-2">Pipe Properties</div>
      <div className="flex flex-col gap-2 mb-2">
        <input type="text" value={data.source || ''} readOnly className="px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs text-gray-700" title="Source Node ID" />
        <input type="text" value={data.target || ''} readOnly className="px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs text-gray-700" title="Target Node ID" />
      </div>
      <div className="flex flex-col gap-2">
        <input type="number" placeholder="Diameter" value={diameter} onChange={e => setDiameter(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
        <input type="number" placeholder="Length" value={length} onChange={e => setLength(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
        <input type="number" placeholder="Density" value={density} onChange={e => setDensity(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
        <input type="number" placeholder="Flowrate" value={flowrate} onChange={e => setFlowrate(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
        <input type="number" placeholder="Pressure Drop" value={pressureDrop} onChange={e => setPressureDrop(e.target.value)} className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm" />
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" onClick={() => onSave({ diameter: Number(diameter), length: Number(length), density: Number(density), flowrate: Number(flowrate), pressureDrop: Number(pressureDrop) })}>Save</button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
