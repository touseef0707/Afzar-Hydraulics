import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface SplitterModalProps {
  data: { outputs?: number; splitRatios?: string; mixingEfficiency?: number };
  position: { x: number; y: number };
  onSave: (data: { outputs: number; splitRatios: string; mixingEfficiency: number }) => void;
  onCancel: () => void;
}

export default function SplitterModal({ data, position, onSave, onCancel }: SplitterModalProps) {
  const [outputs, setOutputs] = useState<number>(data.outputs ?? 2);
  const [splitRatios, setSplitRatios] = useState<string>(data.splitRatios ?? '0.5,0.5');
  const [mixingEfficiency, setMixingEfficiency] = useState<string>(data.mixingEfficiency?.toString() ?? '');
  const [error, setError] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalPos, setModalPos] = useState(position);

  // Auto-generate default split ratios when outputs change
  useEffect(() => {
    if (outputs > 1) {
      const ratio = (1 / outputs).toFixed(2);
      setSplitRatios(Array(outputs).fill(ratio).join(','));
    }
  }, [outputs]);

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

  const validateAndSave = () => {
    // Validate mixing efficiency
    const efficiency = Number(mixingEfficiency);
    if (mixingEfficiency && (efficiency < 0 || efficiency > 100)) {
      setError('Mixing efficiency must be between 0 and 100');
      return;
    }

    // Validate split ratios
    const ratios = splitRatios.split(',').map(Number);
    if (ratios.some(isNaN)) {
      setError('Split ratios must be numbers');
      return;
    }

    const sum = ratios.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 0.01) { // Allow small floating point differences
      setError(`Split ratios must sum to 1 (current sum: ${sum.toFixed(2)})`);
      return;
    }

    setError('');
    onSave({
      outputs,
      splitRatios,
      mixingEfficiency: mixingEfficiency ? efficiency : 0
    });
  };

  return (
    <div
      ref={modalRef}
      style={{ 
        position: 'fixed', 
        top: modalPos.y, 
        left: modalPos.x, 
        zIndex: 1000, 
        minWidth: '200px',
      }}
      className="bg-white text-gray-900 rounded-lg shadow-xl p-3 border border-gray-200"
    >
      <div className="font-semibold text-base mb-2">Splitter/Mixer Properties</div>
      
      {error && (
        <div className="text-red-500 text-xs mb-2">{error}</div>
      )}

      <div className="flex flex-col gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Number of Outputs</label>
          <input 
            type="number" 
            min={2}
            max={10}
            value={outputs}
            onChange={e => setOutputs(Math.min(10, Math.max(2, Number(e.target.value))))}
            className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Split Ratios (comma separated)</label>
          <input 
            type="text" 
            value={splitRatios} 
            onChange={e => setSplitRatios(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
          />
          <div className="text-xs text-gray-400 mt-1">
            Current ratios: {splitRatios.split(',').map(r => parseFloat(r).toFixed(2)).join(', ')}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Mixing Efficiency (%)</label>
          <input 
            type="number" 
            min={0}
            max={100}
            step={0.1}
            value={mixingEfficiency}
            onChange={e => setMixingEfficiency(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm w-full" 
          />
        </div>
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        <button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" 
          onClick={validateAndSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}