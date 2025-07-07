'use client'
import { useState, useEffect } from 'react'
import useFlowStore from '@/store/FlowStore'

type FeedFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
  fluidType?: 'water' | 'oil' | 'custom' // Optional prop for preset values

}

// Enhanced hydraulic parameter limits with typical values
const HYDRAULIC_LIMITS = {
  pressure: { min: 0, max: 10000, typical: { water: 100, oil: 500, custom: Number.NaN } },
  viscosity: { min: 0.1, max: 10000, typical: { water: 1.0, oil: 50, custom: Number.NaN } },
  density: { min: 500, max: 2000, typical: { water: 998, oil: 850, custom: Number.NaN } }
}

// Fluid type presets
const FLUID_PRESETS = {
  water: {
    pressure: 100,
    viscosity: 1.0,
    density: 998
  },
  oil: {
    pressure: 500,
    viscosity: 50,
    density: 850
  }
}

export default function FeedForm({ nodeId, onClose, fluidType = 'custom' }: FeedFormProps) {
  const [fields, setFields] = useState({ 
    pressure: '', 
    viscosity: '', 
    density: '' 
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [currentFluidType, setCurrentFluidType] = useState(fluidType)
  
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  useEffect(() => {
    const currentNode = nodes.find(node => node.id === nodeId)
    
    if (currentNode?.data?.params) {
      setFields({
        pressure: currentNode.data.params.pressure || '',
        viscosity: currentNode.data.params.viscosity || '',
        density: currentNode.data.params.density || '',
      })
    } else if (fluidType !== 'custom') {
      // Apply presets for new nodes if fluidType is specified
      applyPreset(fluidType)
    }
    
    setLoading(false)
  }, [nodeId, nodes, fluidType])

  function applyPreset(type: 'water' | 'oil' | 'custom') {
    if (type !== 'custom') {
      setFields({
        pressure: FLUID_PRESETS[type].pressure.toString(),
        viscosity: FLUID_PRESETS[type].viscosity.toString(),
        density: FLUID_PRESETS[type].density.toString()
      })
      setCurrentFluidType(type)
      setErrors({})
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFields = { ...fields, [e.target.name]: e.target.value }
    setFields(newFields)
    setErrors({ ...errors, [e.target.name]: '' })
    
    // Auto-detect if values match a preset
    if (currentFluidType !== 'custom') {
      const currentValues = {
        pressure: parseFloat(newFields.pressure) || 0,
        viscosity: parseFloat(newFields.viscosity) || 0,
        density: parseFloat(newFields.density) || 0
      }
      
      const isWaterPreset = 
        Math.abs(currentValues.pressure - FLUID_PRESETS.water.pressure) < 5 &&
        Math.abs(currentValues.viscosity - FLUID_PRESETS.water.viscosity) < 0.5 &&
        Math.abs(currentValues.density - FLUID_PRESETS.water.density) < 5
        
      const isOilPreset = 
        Math.abs(currentValues.pressure - FLUID_PRESETS.oil.pressure) < 50 &&
        Math.abs(currentValues.viscosity - FLUID_PRESETS.oil.viscosity) < 5 &&
        Math.abs(currentValues.density - FLUID_PRESETS.oil.density) < 10
        
      if (isWaterPreset) setCurrentFluidType('water')
      else if (isOilPreset) setCurrentFluidType('oil')
      else setCurrentFluidType('custom')
    }
  }

  function validate() {
    const err: { [key: string]: string } = {}
    const values = {
      pressure: parseFloat(fields.pressure),
      viscosity: parseFloat(fields.viscosity),
      density: parseFloat(fields.density)
    }
    
    // Validate pressure
    if (!fields.pressure.trim()) {
      err.pressure = 'Pressure is required'
    } else if (isNaN(values.pressure)) {
      err.pressure = 'Must be a valid number'
    } else if (values.pressure < HYDRAULIC_LIMITS.pressure.min) {
      err.pressure = `Pressure must be ≥ ${HYDRAULIC_LIMITS.pressure.min} kPa`
    } else if (values.pressure > HYDRAULIC_LIMITS.pressure.max) {
      err.pressure = `Pressure must be ≤ ${HYDRAULIC_LIMITS.pressure.max} kPa`
    }
    
    // Validate viscosity
    if (!fields.viscosity.trim()) {
      err.viscosity = 'Viscosity is required'
    } else if (isNaN(values.viscosity)) {
      err.viscosity = 'Must be a valid number'
    } else if (values.viscosity < HYDRAULIC_LIMITS.viscosity.min) {
      err.viscosity = `Viscosity must be ≥ ${HYDRAULIC_LIMITS.viscosity.min} cP`
    } else if (values.viscosity > HYDRAULIC_LIMITS.viscosity.max) {
      err.viscosity = `Viscosity must be ≤ ${HYDRAULIC_LIMITS.viscosity.max} cP`
    }
    
    // Validate density
    if (!fields.density.trim()) {
      err.density = 'Density is required'
    } else if (isNaN(values.density)) {
      err.density = 'Must be a valid number'
    } else if (values.density < HYDRAULIC_LIMITS.density.min) {
      err.density = `Density must be ≥ ${HYDRAULIC_LIMITS.density.min} kg/m³`
    } else if (values.density > HYDRAULIC_LIMITS.density.max) {
      err.density = `Density must be ≤ ${HYDRAULIC_LIMITS.density.max} kg/m³`
    }
    
    // Cross-validate physical relationships
    if (!err.viscosity && !err.density) {
      const kinematicViscosity = values.viscosity / values.density
      if (kinematicViscosity < 0.01) {
        err.viscosity = 'Viscosity too low for this density (check units)'
      } else if (kinematicViscosity > 100) {
        err.viscosity = 'Viscosity unusually high for this density'
      }
    }
    
    return err
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }
    
    const numericFields = {
      pressure: parseFloat(fields.pressure),
      viscosity: parseFloat(fields.viscosity),
      density: parseFloat(fields.density),
      fluidType: currentFluidType // Save the detected fluid type
    }
    
    updateNodeParams(nodeId, numericFields)
    onClose()
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="feed-form-flat">
      <h2 className="form-title">Feed Parameters</h2>
      
      {/* Fluid type selector */}
      <div className="fluid-preset-selector">
        <label>Fluid Type:</label>
        <div className="preset-buttons">
          <button 
            type="button"
            className={`preset-btn ${currentFluidType === 'water' ? 'active' : ''}`}
            onClick={() => applyPreset('water')}
          >
            Water
          </button>
          <button 
            type="button"
            className={`preset-btn ${currentFluidType === 'oil' ? 'active' : ''}`}
            onClick={() => applyPreset('oil')}
          >
            Oil
          </button>
          <button 
            type="button"
            className={`preset-btn ${currentFluidType === 'custom' ? 'active' : ''}`}
            onClick={() => setCurrentFluidType('custom')}
          >
            Custom
          </button>
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="pressure">
            Pressure (kPag)
            <span className="hint">Typical: {HYDRAULIC_LIMITS.pressure.typical[currentFluidType] || 'varies'} kPa</span>
          </label>
          <input
            id="pressure"
            name="pressure"
            type="number"
            value={fields.pressure}
            onChange={handleChange}
            placeholder={`Enter pressure (${HYDRAULIC_LIMITS.pressure.min}-${HYDRAULIC_LIMITS.pressure.max} kPa)`}
            className={errors.pressure ? 'input-error' : ''}
            autoFocus 
            step="0.1"
            min={HYDRAULIC_LIMITS.pressure.min}
            max={HYDRAULIC_LIMITS.pressure.max}
          />
          {errors.pressure && <span className="error-text">{errors.pressure}</span>}
        </div>
        
        <div className="form-field">
          <label htmlFor="viscosity">
            Dynamic Viscosity (cP)
            <span className="hint">Typical: {HYDRAULIC_LIMITS.viscosity.typical[currentFluidType] || 'varies'} cP</span>
          </label>
          <input
            id="viscosity"
            name="viscosity"
            type="number"
            value={fields.viscosity}
            onChange={handleChange}
            placeholder={`Enter viscosity (${HYDRAULIC_LIMITS.viscosity.min}-${HYDRAULIC_LIMITS.viscosity.max} cP)`}
            className={errors.viscosity ? 'input-error' : ''}
            step="0.01"
            min={HYDRAULIC_LIMITS.viscosity.min}
            max={HYDRAULIC_LIMITS.viscosity.max}
          />
          {errors.viscosity && <span className="error-text">{errors.viscosity}</span>}
        </div>
        
        <div className="form-field form-field-full">
          <label htmlFor="density">
            Density (kg/m³)
            <span className="hint">Typical: {HYDRAULIC_LIMITS.density.typical[currentFluidType] || 'varies'} kg/m³</span>
          </label>
          <input
            id="density"
            name="density"
            type="number"
            value={fields.density}
            onChange={handleChange}
            placeholder={`Enter density (${HYDRAULIC_LIMITS.density.min}-${HYDRAULIC_LIMITS.density.max} kg/m³)`}
            className={errors.density ? 'input-error' : ''}
            step="0.1"
            min={HYDRAULIC_LIMITS.density.min}
            max={HYDRAULIC_LIMITS.density.max}
          />
          {errors.density && <span className="error-text">{errors.density}</span>}
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
        <button type="submit" className="btn-save">Save</button>
      </div>
      
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
        .fluid-preset-selector {
          margin-bottom: 10px;
        }
        .fluid-preset-selector label {
          display: block;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }
        .preset-buttons {
          display: flex;
          gap: 8px;
        }
        .preset-btn {
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          background: #f8fafc;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .preset-btn:hover {
          background: #e2e8f0;
        }
        .preset-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
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
        .form-field-full {
          grid-column: 1 / 3;
        }
        label {
          font-weight: 600;
          color: #334155;
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .hint {
          font-weight: normal;
          color: #64748b;
          font-size: 0.85rem;
          margin-left: 8px;
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
        .input-error {
          border-color: #dc2626;
          background: #fef2f2;
        }
        .error-text {
          color: #dc2626;
          font-size: 0.95em;
          margin-top: 1px;
          font-weight: 500;
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
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .form-field-full {
            grid-column: 1 / 2;
          }
          .preset-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </form>
  )
}