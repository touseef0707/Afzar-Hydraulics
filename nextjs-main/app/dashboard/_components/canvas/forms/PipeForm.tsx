'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import useFlowStore from '@/store/FlowStore'
import { useClickOutside } from '@/hooks/useClickOutside'

type PipeFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

const MIN_DIAMETER = 0.001
const MAX_DIAMETER = 3.0
const MIN_ROUGHNESS = 0.001
const MAX_ROUGHNESS = 10
const MIN_LENGTH = 0.1
const MAX_LENGTH = 10000
const MIN_FLOW_RATE = 0.001
const MAX_FLOW_RATE = 10000
const MIN_DENSITY = 500
const MAX_DENSITY = 2000

export default function PipeForm({ nodeId, onClose }: PipeFormProps) {
  const [fields, setFields] = useState({
    length: '',
    diameter: '',
    roughness: '',
    volumetricFlowrate: '',
    massFlowRate: '',
    fluidDensity: '1000'
  })
  const [initialValues, setInitialValues] = useState({
    length: '',
    diameter: '',
    roughness: '',
    volumetricFlowrate: '',
    massFlowRate: '',
    fluidDensity: '1000'
  })
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  const hasUnsavedChanges = useMemo(() => {
    return (
      fields.length !== initialValues.length ||
      fields.diameter !== initialValues.diameter ||
      fields.roughness !== initialValues.roughness ||
      fields.volumetricFlowrate !== initialValues.volumetricFlowrate ||
      fields.massFlowRate !== initialValues.massFlowRate ||
      fields.fluidDensity !== initialValues.fluidDensity
    )
  }, [fields, initialValues])

  useClickOutside(formRef, () => {
    if (hasUnsavedChanges) {
      setShowCloseWarning(true)
    } else {
      onClose()
    }
  }, hasUnsavedChanges)

  useEffect(() => {
    const currentNode = nodes.find(node => node.id === nodeId)
    
    if (currentNode?.data?.params) {
      const initial = {
        length: currentNode.data.params.length?.toString() || '',
        diameter: currentNode.data.params.diameter?.toString() || '',
        roughness: currentNode.data.params.roughness?.toString() || '',
        volumetricFlowrate: currentNode.data.params.volumetricFlowrate?.toString() || '',
        massFlowRate: currentNode.data.params.massFlowRate?.toString() || '',
        fluidDensity: currentNode.data.params.fluidDensity?.toString() || '1000'
      }
      setFields(initial)
      setInitialValues(initial)
    } else {
      setInitialValues({
        length: '',
        diameter: '',
        roughness: '',
        volumetricFlowrate: '',
        massFlowRate: '',
        fluidDensity: '1000'
      })
    }
    
    setLoading(false)
  }, [nodeId, nodes])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    
    if (name === 'volumetricFlowrate' || name === 'massFlowRate' || name === 'fluidDensity') {
      calculateRelatedFields(name, value)
    }
  }

  function calculateRelatedFields(changedField: string, value: string) {
    const numValue = parseFloat(value) || 0
    const density = parseFloat(fields.fluidDensity) || 1000
    
    try {
      if (changedField === 'volumetricFlowrate' && numValue > 0) {
        const massFlow = numValue * density
        setFields(prev => ({ ...prev, massFlowRate: massFlow.toFixed(4) }))
      } else if (changedField === 'massFlowRate' && numValue > 0) {
        const volFlow = numValue / density
        setFields(prev => ({ ...prev, volumetricFlowrate: volFlow.toFixed(4) }))
      } else if (changedField === 'fluidDensity' && numValue > 0) {
        if (fields.volumetricFlowrate) {
          const massFlow = parseFloat(fields.volumetricFlowrate) * numValue
          setFields(prev => ({ ...prev, massFlowRate: massFlow.toFixed(4) }))
        } else if (fields.massFlowRate) {
          const volFlow = parseFloat(fields.massFlowRate) / numValue
          setFields(prev => ({ ...prev, volumetricFlowrate: volFlow.toFixed(4) }))
        }
      }
    } catch (e) {
      console.error("Calculation error:", e)
    }
  }

  function validate() {
    return {}
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    
    if (Object.keys(err).length > 0) {
      return
    }
    
    updateNodeParams(nodeId, fields)
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
        
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="length">Length (m)</label>
            <input
              id="length"
              name="length"
              type="number"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              step="0.1"
              value={fields.length}
              onChange={handleChange}
              placeholder={`${MIN_LENGTH}-${MAX_LENGTH}m`}
              autoFocus />
          </div>
          
          <div className="form-field">
            <label htmlFor="diameter">Diameter (m)</label>
            <input
              id="diameter"
              name="diameter"
              type="number"
              min={MIN_DIAMETER}
              max={MAX_DIAMETER}
              step="0.001"
              value={fields.diameter}
              onChange={handleChange}
              placeholder={`${MIN_DIAMETER}-${MAX_DIAMETER}m`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="roughness">Roughness (mm)</label>
            <input
              id="roughness"
              name="roughness"
              type="number"
              min={MIN_ROUGHNESS}
              max={MAX_ROUGHNESS}
              step="0.001"
              value={fields.roughness}
              onChange={handleChange}
              placeholder={`${MIN_ROUGHNESS}-${MAX_ROUGHNESS}mm`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="volumetricFlowrate">Volumetric Flow (m³/h)</label>
            <input
              id="volumetricFlowrate"
              name="volumetricFlowrate"
              type="number"
              min={MIN_FLOW_RATE}
              max={MAX_FLOW_RATE}
              step="0.1"
              value={fields.volumetricFlowrate}
              onChange={handleChange}
              placeholder={`${MIN_FLOW_RATE}-${MAX_FLOW_RATE}m³/h`} />
          </div>
          
          <div className="form-field">
            <label htmlFor="massFlowRate">Mass Flow (kg/h)</label>
            <input
              id="massFlowRate"
              name="massFlowRate"
              type="number"
              value={fields.massFlowRate}
              onChange={handleChange}
              placeholder="Calculated automatically" />
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-toggle-advanced"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>
        
        {showAdvanced && (
          <div className="advanced-fields">
            <div className="form-field">
              <label htmlFor="fluidDensity">Fluid Density (kg/m³)</label>
              <input
                id="fluidDensity"
                name="fluidDensity"
                type="number"
                min={MIN_DENSITY}
                max={MAX_DENSITY}
                step="1"
                value={fields.fluidDensity}
                onChange={handleChange}
                placeholder={`${MIN_DENSITY}-${MAX_DENSITY}kg/m³`} />
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => hasUnsavedChanges ? setShowCloseWarning(true) : onClose()} 
            className="btn-cancel"
          >
            Cancel
          </button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>

      {showCloseWarning && (
        <div className="warning-modal-overlay">
          <div className="warning-modal">
            <h3>Are you sure you want to close?</h3>
            <p>Your changes remain unsaved.</p>
            <div className="warning-modal-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancelClose}
              >
                No, keep editing
              </button>
              <button 
                type="button" 
                className="btn-confirm"
                onClick={handleConfirmClose}
              >
                Yes, close without saving
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .feed-form-flat {
          padding: 0;
          margin: 0;
          background: none;
          border-radius: 0;
          box-shadow: none;
          min-width: 0;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 14px;
          color: #1e293b;
          letter-spacing: -0.5px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 18px;
          margin-bottom: 10px;
          width: 100%;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }
        label {
          font-weight: 600;
          color: #334155;
          font-size: 1rem;
          margin-bottom: 2px;
        }
        input {
          padding: 11px 13px;
          border: 1.5px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          background: #f8fafc;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
          color: #1e293b;
        }
        input:focus {
          border-color: #2563eb;
          background: #f0f7ff;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 8px;
        }
        .btn-cancel {
          background: #f3f4f6;
          color: #334155;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-save {
          background: linear-gradient(90deg,#2563eb 60%,#1e40af 100%);
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 1.5px 6px rgba(37,99,235,0.13);
          transition: background 0.2s;
        }
        .btn-save:hover {
          background: linear-gradient(90deg,#1d4ed8 60%,#1e40af 100%);
        }
        .btn-cancel:hover {
          background: #e5e7eb;
          color: #1e293b;
        }
        .btn-toggle-advanced {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          padding: 5px 0;
          margin: 5px 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .btn-toggle-advanced:hover {
          text-decoration: underline;
        }
        .advanced-fields {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }
        .warning-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .warning-modal {
          background: white;
          padding: 24px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .warning-modal h3 {
          margin-top: 0;
          color: #1e293b;
          font-size: 1.2rem;
        }
        .warning-modal p {
          margin-bottom: 24px;
          color: #64748b;
        }
        .warning-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-confirm {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-confirm:hover {
          background: #b91c1c;
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </>
  )
}