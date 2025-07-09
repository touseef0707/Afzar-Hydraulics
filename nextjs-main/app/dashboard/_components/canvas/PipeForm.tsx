'use client'
import { useState, useEffect } from 'react'
import useFlowStore from '@/store/FlowStore'

type PipeFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

// Physical constants and limits
const MIN_DIAMETER = 0.001; // 1mm (practical minimum pipe diameter)
const MAX_DIAMETER = 3.0;   // 3m (very large pipe)
const MIN_ROUGHNESS = 0.001; // 0.001mm (smooth pipes like glass)
const MAX_ROUGHNESS = 10;    // 10mm (very rough pipes)
const MIN_LENGTH = 0.1;      // 0.1m
const MAX_LENGTH = 10000;    // 10km
const MIN_FLOW_RATE = 0.001; // 0.001 m³/h
const MAX_FLOW_RATE = 10000; // 10,000 m³/h

// Typical fluid density range (kg/m³)
const MIN_DENSITY = 500;    // Light hydrocarbons
const MAX_DENSITY = 2000;   // Very dense liquids

export default function PipeForm({nodeId, onClose }: PipeFormProps) {
  const [fields, setFields] = useState({
    length: '',
    diameter: '',
    roughness: '',
    volumetricFlowrate: '',
    massFlowRate: '',
    fluidDensity: '1000' // Default to water density (1000 kg/m³)
  })
  
  // const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  useEffect(() => {
    const currentNode = nodes.find(node => node.id === nodeId)
    
    if (currentNode?.data?.params) {
      setFields({
        length: currentNode.data.params.length || '',
        diameter: currentNode.data.params.diameter || '',
        roughness: currentNode.data.params.roughness || '',
        volumetricFlowrate: currentNode.data.params.volumetricFlowrate || '',
        massFlowRate: currentNode.data.params.massFlowRate || '',
        fluidDensity: currentNode.data.params.fluidDensity || '1000'
      })
    }
    
    setLoading(false)
  }, [nodeId, nodes])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    // if (errors[name]) {
      // setErrors(prev => {
      //   const newErrors = { ...prev }
      //   delete newErrors[name]
      //   return newErrors
      // })
    // }
    
    // Auto-calculate related fields
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
    // const err: { [key: string]: string } = {}
    // const values = {
    //   length: parseFloat(fields.length),
    //   diameter: parseFloat(fields.diameter),
    //   roughness: parseFloat(fields.roughness),
    //   volumetricFlowrate: parseFloat(fields.volumetricFlowrate),
    //   massFlowRate: parseFloat(fields.massFlowRate),
    //   fluidDensity: parseFloat(fields.fluidDensity)
    // }

    // // Basic presence checks
    // if (!fields.length) err.length = 'Length is required'
    // if (!fields.diameter) err.diameter = 'Diameter is required'
    // if (!fields.roughness) err.roughness = 'Roughness is required'
    // if (!fields.volumetricFlowrate && !fields.massFlowRate) {
    //   err.volumetricFlowrate = 'Either volumetric or mass flow rate is required'
    // }

    // // Physical limits validation
    // if (values.length && (values.length < MIN_LENGTH || values.length > MAX_LENGTH)) {
    //   err.length = `Length must be between ${MIN_LENGTH}m and ${MAX_LENGTH}m`
    // }
    
    // if (values.diameter && (values.diameter < MIN_DIAMETER || values.diameter > MAX_DIAMETER)) {
    //   err.diameter = `Diameter must be between ${MIN_DIAMETER}m and ${MAX_DIAMETER}m`
    // }
    
    // if (values.roughness && (values.roughness < MIN_ROUGHNESS || values.roughness > MAX_ROUGHNESS)) {
    //   err.roughness = `Roughness must be between ${MIN_ROUGHNESS}mm and ${MAX_ROUGHNESS}mm`
    // }
    
    // if (values.volumetricFlowrate && 
    //     (values.volumetricFlowrate < MIN_FLOW_RATE || values.volumetricFlowrate > MAX_FLOW_RATE)) {
    //   err.volumetricFlowrate = `Flow rate must be between ${MIN_FLOW_RATE} and ${MAX_FLOW_RATE} m³/h`
    // }
    
    // if (values.fluidDensity && (values.fluidDensity < MIN_DENSITY || values.fluidDensity > MAX_DENSITY)) {
    //   err.fluidDensity = `Density must be between ${MIN_DENSITY} and ${MAX_DENSITY} kg/m³`
    // }

    // // Hydraulic consistency checks
    // if (values.diameter && values.volumetricFlowrate) {
    //   const velocity = values.volumetricFlowrate / (3600 * Math.PI * Math.pow(values.diameter/2, 2))
      
    //   // Check for unrealistic velocities
    //   if (velocity > 10) { // 10 m/s is very high for most liquid applications
    //     err.volumetricFlowrate = 'Velocity too high (>10 m/s) for this diameter'
    //     err.diameter = 'Diameter too small for this flow rate'
    //   } else if (velocity < 0.1) { // 0.1 m/s is very low
    //     err.volumetricFlowrate = 'Velocity very low (<0.1 m/s) for this diameter'
    //   }
    // }

    // // Check roughness ratio (ε/D)
    // if (values.diameter && values.roughness) {
    //   const roughnessRatio = values.roughness / (values.diameter * 1000) // convert diameter to mm
    //   if (roughnessRatio > 0.05) { // ε/D > 0.05 is extremely rough
    //     err.roughness = 'Roughness is extremely high for this pipe diameter'
    //   }
    // }

    // // Check mass flow consistency if both are provided
    // if (fields.volumetricFlowrate && fields.massFlowRate && fields.fluidDensity) {
    //   const expectedMass = values.volumetricFlowrate * values.fluidDensity
    //   const diff = Math.abs(expectedMass - values.massFlowRate) / expectedMass
      
    //   if (diff > 0.01) { // 1% tolerance
    //     err.massFlowRate = 'Mass flow rate inconsistent with volumetric flow and density'
    //   }
    // }

    // return err
    return {}
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    
    if (Object.keys(err).length > 0) {
      // setErrors(err)
      return
    }
    
    // Update params in the store
    updateNodeParams(nodeId, fields)
    onClose()
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="feed-form-flat">
      <h2 className="form-title">Pipe Parameters</h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="length">Length (m)</label>
          <input
            id="length"
            name="length"
            type="number"
            // min={MIN_LENGTH}
            // max={MAX_LENGTH}
            step="0.1"
            value={fields.length}
            onChange={handleChange}
            placeholder={`${MIN_LENGTH}-${MAX_LENGTH}m`}
            // className={errors.length ? 'input-error' : ''}
            autoFocus />
          {/* errors.length && <span className="error-text">{errors.length}</span> */}
        </div>
        
        <div className="form-field">
          <label htmlFor="diameter">Diameter (m)</label>
          <input
            id="diameter"
            name="diameter"
            type="number"
            // min={MIN_DIAMETER}
            // max={MAX_DIAMETER}
            step="0.001"
            value={fields.diameter}
            onChange={handleChange}
            placeholder={`${MIN_DIAMETER}-${MAX_DIAMETER}m`}
            // className={errors.diameter ? 'input-error' : ''} 
          />
          {/* // errors.diameter && <span className="error-text">{errors.diameter}</span> */}
        </div>
        
        <div className="form-field">
          <label htmlFor="roughness">Roughness (mm)</label>
          <input
            id="roughness"
            name="roughness"
            type="number"
            // min={MIN_ROUGHNESS}
            // max={MAX_ROUGHNESS}
            step="0.001"
            value={fields.roughness}
            onChange={handleChange}
            placeholder={`${MIN_ROUGHNESS}-${MAX_ROUGHNESS}mm`}
            // className={errors.roughness ? 'input-error' : ''} 
            />
          {/* {errors.roughness && <span className="error-text">{errors.roughness}</span>} */}
        </div>
        
        <div className="form-field">
          <label htmlFor="volumetricFlowrate">Volumetric Flow (m³/h)</label>
          <input
            id="volumetricFlowrate"
            name="volumetricFlowrate"
            type="number"
            // min={MIN_FLOW_RATE}
            // max={MAX_FLOW_RATE}
            step="0.1"
            value={fields.volumetricFlowrate}
            onChange={handleChange}
            placeholder={`${MIN_FLOW_RATE}-${MAX_FLOW_RATE}m³/h`}
            // className={errors.volumetricFlowrate ? 'input-error' : ''} 
            />
          {/* {errors.volumetricFlowrate && <span className="error-text">{errors.volumetricFlowrate}</span>} */}
        </div>
        
        <div className="form-field">
          <label htmlFor="massFlowRate">Mass Flow (kg/h)</label>
          <input
            id="massFlowRate"
            name="massFlowRate"
            type="number"
            value={fields.massFlowRate}
            onChange={handleChange}
            placeholder="Calculated automatically"
            // className={errors.massFlowRate ? 'input-error' : ''} 
            />
          {/* {errors.massFlowRate && <span className="error-text">{errors.massFlowRate}</span>} */}
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
              // min={MIN_DENSITY}
              // max={MAX_DENSITY}
              step="1"
              value={fields.fluidDensity}
              onChange={handleChange}
              placeholder={`${MIN_DENSITY}-${MAX_DENSITY}kg/m³`}
              // className={errors.fluidDensity ? 'input-error' : ''} 
              />
            {/* {errors.fluidDensity && <span className="error-text">{errors.fluidDensity}</span>} */}
          </div>
        </div>
      )}
      
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
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .form-field-full {
            grid-column: 1 / 2;
          }
        }
      `}</style>
    </form>
  )
}