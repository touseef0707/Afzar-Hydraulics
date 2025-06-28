import React, { useState, ChangeEvent, FormEvent } from 'react';
import useFlowStore from '@/store/store';

interface ModalProps {
  nodeType: string;
  nodeId: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ nodeType, nodeId, onClose }) => {
  const [params, setParams] = useState<Record<string, string | number>>({});

  // CSS Class Variables
  const modalWidth = 'w-[200px]'; 
  const inputClass = 'border border-gray-300 rounded px-2 py-1.5 text-sm text-black w-full focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'text-xs font-medium text-gray-600 mb-1';
  const buttonClass = 'px-3 py-1.5 rounded text-sm font-medium transition-colors';
  const secondaryButtonClass = `${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-50`;
  const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ 
      ...params, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    useFlowStore.getState().updateNodeParams(nodeId, params);
    onClose();
  };

  const renderFields = () => {
    switch (nodeType) {
      case 'feed':
        return (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className={labelClass}>Pressure (bar)</label>
              <input
                type="number"
                name="pressure"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
          </div>
        );
      case 'pipe':
        return (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className={labelClass}>Diameter (mm)</label>
              <input
                type="number"
                name="diameter"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Length (m)</label>
              <input
                type="number"
                name="length"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Flow (m³/s)</label>
              <input
                type="number"
                name="flow"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Density (kg/m³)</label>
              <input
                type="number"
                name="density"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Pressure Drop (bar)</label>
              <input
                type="number"
                name="pressureDrop"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
          </div>
        );
      case 'valve':
        return (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className={labelClass}>Flow (m³/s)</label>
              <input
                type="number"
                name="flow"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Pressure Drop (bar)</label>
              <input
                type="number"
                name="pressureDrop"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className={labelClass}>Pressure Drop (bar)</label>
              <input
                type="number"
                name="pressureDrop"
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter value"
              />
            </div>
          </div>
        );
      default:
        return <div className="text-xs text-gray-500 italic">No parameters required</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-md shadow-lg p-4 ${modalWidth}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-800">
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {renderFields()}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={primaryButtonClass}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;