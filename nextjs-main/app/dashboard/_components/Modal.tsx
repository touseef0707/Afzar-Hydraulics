// file: src/components/Modal.tsx

"use client";

import React, { FormEvent, ChangeEvent, useRef, useState, JSX } from 'react';
import useFlowStore, { RFState } from '@/store/store';
import { useShallow } from 'zustand/react/shallow';
import { useClickOutside } from './useClickOutside';

interface ModalProps {
  nodeId: string;
  onClose: () => void;
  position: { x: number; y: number };
}

const selector = (state: RFState) => ({
  node: state.nodes.find((n) => n.id === state.editingNodeId),
  updateNodeParams: state.updateNodeParams,
});

const Modal: React.FC<ModalProps> = ({ nodeId, onClose, position }) => {
  const { node, updateNodeParams } = useFlowStore(useShallow(selector));
  const [params, setParams] = useState<Record<string, any>>(node?.data.params || {});
  
  const modalContentRef = useRef<HTMLDivElement>(null); 
  useClickOutside(modalContentRef, onClose);

  if (!node) return null;
  const { nodeType } = node.data;

  const inputClass = 'border border-gray-300 rounded px-2 py-1.5 text-sm text-black w-full focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'text-xs font-medium text-gray-600 mb-1';
  const buttonClass = 'px-3 py-1.5 rounded text-sm font-medium transition-colors';
  const secondaryButtonClass = `${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-50`;
  const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateNodeParams(nodeId, params);
    onClose();
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };
  
  // --- THIS IS THE FIX ---
  // We explicitly state that this function returns a JSX.Element.
  const renderFields = (): JSX.Element => {
    switch (nodeType) {
      case 'feed':
        return (
          <div>
            <label className={labelClass}>Pressure (bar)</label>
            <input type="number" name="pressure" value={params.pressure || ''} onChange={handleChange} className={inputClass} placeholder="Enter value" />
          </div>
        );
      case 'pipe':
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Diameter (mm)</label><input type="number" name="diameter" value={params.diameter || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
            <div><label className={labelClass}>Length (m)</label><input type="number" name="length" value={params.length || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
            <div><label className={labelClass}>Flow (m³/s)</label><input type="number" name="flow" value={params.flow || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
            <div><label className={labelClass}>Density (kg/m³)</label><input type="number" name="density" value={params.density || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
            <div><label className={labelClass}>Pressure Drop (bar)</label><input type="number" name="pressureDrop" value={params.pressureDrop || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
          </div>
        );
      case 'valve':
        return (
          <div className="space-y-3">
            <div><label className={labelClass}>Flow (m³/s)</label><input type="number" name="flow" value={params.flow || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
            <div><label className={labelClass}>Pressure Drop (bar)</label><input type="number" name="pressureDrop" value={params.pressureDrop || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/></div>
          </div>
        );
      case 'product':
        return (
          <div>
            <label className={labelClass}>Pressure Drop (bar)</label>
            <input type="number" name="pressureDrop" value={params.pressureDrop || ''} onChange={handleChange} className={inputClass} placeholder="Enter value"/>
          </div>
        );
      default:
        return <div className="text-xs text-gray-500 italic">No parameters required</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm">
      <div
        ref={modalContentRef}
        className="absolute bg-white rounded-md shadow-lg p-4 w-[250px]"
        style={{ top: `${position.y + 20}px`, left: `${position.x}px` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-800">{nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* This call is now type-safe because renderFields() returns JSX.Element */}
          <div>{renderFields()}</div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button>
            <button type="submit" className={primaryButtonClass}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
