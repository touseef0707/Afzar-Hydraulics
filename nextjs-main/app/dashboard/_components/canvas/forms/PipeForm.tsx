'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import useFlowStore from '@/store/FlowStore'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useShallow } from 'zustand/react/shallow'
import CancelWarning from '../CancelWarning'

// --- TYPE DEFINITIONS ---
// Defines the shape of the data for a pipe, used to resolve TypeScript errors.
type PipeFormData = {
  length?: string | number;
  diameter?: string | number;
  roughness?: string | number;
  massFlowRate?: string | number;
  viscosity?: string | number;
  density?: string | number;
  label?: string;
  fluidType?: 'water' | 'oil' | 'custom';
};

// Defines the props for the component, accepting either a nodeId or an edgeId.
type PipeFormProps = {
  flowId: string;
  nodeId?: string | null;
  edgeId?: string | null;
  onClose: () => void;
  fluidType?: 'water' | 'oil' | 'custom';
}

// --- CONSTANTS ---
const MIN_DIAMETER = 0.001;
const MAX_DIAMETER = 3.0;
const MIN_ROUGHNESS = 0.001;
const MAX_ROUGHNESS = 10;
const MIN_LENGTH = 0.1;
const MAX_LENGTH = 10000;
const MIN_FLOW_RATE = 0.001;
const MAX_FLOW_RATE = 10000;
const MIN_DENSITY = 500;
const MAX_DENSITY = 2000;
const MIN_VISCOSITY = 0.1;
const MAX_VISCOSITY = 10000;

const FLUID_PRESETS = {
  water: { viscosity: 1.0, density: 998 },
  oil: { viscosity: 50, density: 850 }
}

export default function PipeForm({ nodeId, edgeId, onClose, fluidType = 'custom' }: PipeFormProps) {
  const [fields, setFields] = useState({
    length: '',
    diameter: '',
    roughness: '',
    massFlowRate: '',
    viscosity: '',
    density: '',
    label: '',
  })
  const [initialValues, setInitialValues] = useState({ ...fields })
  const [loading, setLoading] = useState(true)
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  const [currentFluidType, setCurrentFluidType] = useState(fluidType)
  
  const formRef = useRef<HTMLFormElement>(null)

  const { nodes, edges, updateNodeParams, updateEdgeData } = useFlowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      updateNodeParams: state.updateNodeParams,
      updateEdgeData: state.updateEdgeData,
    }))
  )

  const hasUnsavedChanges = useMemo(() => {
    return Object.keys(fields).some(
      (key) => fields[key as keyof typeof fields] !== initialValues[key as keyof typeof initialValues]
    );
  }, [fields, initialValues])

  useClickOutside(formRef, () => {
    if (hasUnsavedChanges) {
      setShowCloseWarning(true)
    } else {
      onClose()
    }
  }, hasUnsavedChanges)

  // Load data from either the node or the edge
  useEffect(() => {
    const element = nodeId
      ? nodes.find((n) => n.id === nodeId)
      : edges.find((e) => e.id === edgeId)

    // Cast the generic data object to our specific PipeFormData type to inform TypeScript
    const sourceData = (nodeId ? element?.data?.params : element?.data) as PipeFormData | undefined;

    if (sourceData) {
      const initial = {
        length: sourceData.length?.toString() || '',
        diameter: sourceData.diameter?.toString() || '',
        roughness: sourceData.roughness?.toString() || '',
        massFlowRate: sourceData.massFlowRate?.toString() || '',
        viscosity: sourceData.viscosity?.toString() || '',
        density: sourceData.density?.toString() || '',
        label: sourceData.label?.toString() || '',
      }
      setFields(initial)
      setInitialValues(initial)
      setCurrentFluidType(sourceData.fluidType || 'custom');
    }
    
    setLoading(false)
  }, [nodeId, edgeId, nodes, edges])

  function applyPreset(type: 'water' | 'oil') {
    const preset = FLUID_PRESETS[type];
    setFields(prev => ({
      ...prev,
      viscosity: preset.viscosity.toString(),
      density: preset.density.toString()
    }))
    setCurrentFluidType(type)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))

    if (name === 'viscosity' || name === 'density') {
      setCurrentFluidType('custom');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const density = parseFloat(fields.density) || 1
    const massFlowRate_kg_h = parseFloat(fields.massFlowRate)
    const volumetricFlowRate_m3_h = isNaN(massFlowRate_kg_h) ? 0 : massFlowRate_kg_h / density

    const numericFields = {
      ...fields,
      length: parseFloat(fields.length),
      diameter: parseFloat(fields.diameter),
      roughness: parseFloat(fields.roughness),
      massFlowRate: massFlowRate_kg_h,
      volumetricFlowRate: volumetricFlowRate_m3_h,
      viscosity: parseFloat(fields.viscosity),
      density: density,
      fluidType: currentFluidType,
      label: fields.label || (fields.length ? `${fields.length}m Pipe` : 'Pipe'),
    }
    
    // Call the correct update function based on which ID was passed
    if (nodeId) {
      updateNodeParams(nodeId, numericFields)
    } else if (edgeId) {
      updateEdgeData(edgeId, numericFields)
    }
    
    onClose()
  }

  const handleConfirmClose = () => {
    setShowCloseWarning(false)
    onClose()
  }

  const handleCancelClose = () => {
    setShowCloseWarning(false)
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="feed-form-flat">
        <h2 className="form-title">Pipe Parameters</h2>
        <div className="fluid-preset-selector">
          <label>Fluid Type:</label>
          <div className="preset-buttons">
            <button type="button" className={`preset-btn text-black ${currentFluidType === 'water' ? 'active' : ''}`} onClick={() => applyPreset('water')}>Water</button>
            <button type="button" className={`preset-btn text-black ${currentFluidType === 'oil' ? 'active' : ''}`} onClick={() => applyPreset('oil')}>Oil</button>
            <button type="button" className={`preset-btn text-black ${currentFluidType === 'custom' ? 'active' : ''}`} onClick={() => setCurrentFluidType('custom')}>Custom</button>
          </div>
        </div>
        
        <div className="form-field full-width">
            <label htmlFor="label">Label</label>
            <input id="label" name="label" type="text" value={fields.label} onChange={handleChange} placeholder="e.g., Main Supply Line" />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="length">Length (m)</label>
            <input id="length" name="length" type="number" step="0.1" value={fields.length} onChange={handleChange} placeholder={`${MIN_LENGTH} - ${MAX_LENGTH}`} autoFocus />
          </div>
          
          <div className="form-field">
            <label htmlFor="diameter">Diameter (m)</label>
            <input id="diameter" name="diameter" type="number" step="0.001" value={fields.diameter} onChange={handleChange} placeholder={`${MIN_DIAMETER} - ${MAX_DIAMETER}`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="roughness">Roughness (mm)</label>
            <input id="roughness" name="roughness" type="number" step="0.001" value={fields.roughness} onChange={handleChange} placeholder={`${MIN_ROUGHNESS} - ${MAX_ROUGHNESS}`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="massFlowRate">Mass Flow (kg/h)</label>
            <input id="massFlowRate" name="massFlowRate" type="number" step="0.1" value={fields.massFlowRate} onChange={handleChange} placeholder={`${MIN_FLOW_RATE} - ${MAX_FLOW_RATE}`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="viscosity">Dyn. Viscosity (cP)</label>
            <input id="viscosity" name="viscosity" type="number" step="0.01" value={fields.viscosity} onChange={handleChange} placeholder={`${MIN_VISCOSITY} - ${MAX_VISCOSITY}`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="density">Density (kg/m³)</label>
            <input id="density" name="density" type="number" step="0.1" value={fields.density} onChange={handleChange} placeholder={`${MIN_DENSITY} - ${MAX_DENSITY}`} />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => hasUnsavedChanges ? setShowCloseWarning(true) : onClose()} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>

      {showCloseWarning && (
        <CancelWarning
          onCancel={handleCancelClose}
          onConfirm={handleConfirmClose}
        />
      )}

      <style jsx>{`
        .feed-form-flat { padding: 0; margin: 0; background: none; border-radius: 0; box-shadow: none; min-width: 0; max-width: 100%; display: flex; flex-direction: column; gap: 18px; }
        .form-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 14px; color: #1e293b; letter-spacing: -0.5px; }
        .fluid-preset-selector { margin-bottom: 10px; }
        .fluid-preset-selector label { display: block; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .preset-buttons { display: flex; gap: 8px; }
        .preset-btn { padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
        .preset-btn:hover { background: #e2e8f0; }
        .preset-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 18px; width: 100%; }
        .form-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .form-field.full-width { grid-column: 1 / -1; }
        label { font-weight: 600; color: #334155; font-size: 1rem; margin-bottom: 2px; }
        input { padding: 11px 13px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 1rem; background: #f8fafc; transition: border-color 0.2s, background 0.2s; outline: none; min-width: 0; width: 100%; box-sizing: border-box; color: #1e293b; }
        input:focus { border-color: #2563eb; background: #f0f7ff; }
        .form-actions { display: flex; justify-content: flex-end; gap: 14px; margin-top: 8px; }
        .btn-cancel, .btn-save, .btn-confirm { border: none; padding: 10px 24px; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .btn-cancel { background: #f3f4f6; color: #334155; }
        .btn-cancel:hover { background: #e5e7eb; color: #1e293b; }
        .btn-save { background: linear-gradient(90deg,#2563eb 60%,#1e40af 100%); color: #fff; box-shadow: 0 1.5px 6px rgba(37,99,235,0.13); }
        .btn-save:hover { background: linear-gradient(90deg,#1d4ed8 60%,#1e40af 100%); }
        .warning-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1001; }
        .warning-modal { background: white; padding: 24px; border-radius: 8px; max-width: 400px; width: 90%; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .warning-modal h3 { margin-top: 0; color: #1e293b; font-size: 1.2rem; }
        .warning-modal p { margin-bottom: 24px; color: #64748b; }
        .warning-modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
        .btn-confirm { background: #dc2626; color: white; padding: 8px 16px; }
        .btn-confirm:hover { background: #b91c1c; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; gap: 12px; } }
      `}</style>
    </>
  )
}
