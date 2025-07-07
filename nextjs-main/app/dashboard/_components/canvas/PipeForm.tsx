'use client'
import { useState, useEffect } from 'react'
import useFlowStore from '@/store/FlowStore'

type PipeFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

export default function PipeForm({nodeId, onClose }: PipeFormProps) {
  const [fields, setFields] = useState({
    length: '',
    diameter: '',
    roughness: '',
    volumetricFlowrate: '',
    massFlowRate: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  
  // Get the node data from the store
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  useEffect(() => {
    // Find the current node in the store
    const currentNode = nodes.find(node => node.id === nodeId)
    
    if (currentNode?.data?.params) {
      setFields({
        length: currentNode.data.params.length || '',
        diameter: currentNode.data.params.diameter || '',
        roughness: currentNode.data.params.roughness || '',
        volumetricFlowrate: currentNode.data.params.volumetricFlowrate || '',
        massFlowRate: currentNode.data.params.massFlowRate || '',
      })
    }
    
    setLoading(false)
  }, [nodeId, nodes])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const err: { [key: string]: string } = {}
    if (!fields.length) err.length = 'Length is required'
    if (!fields.diameter) err.diameter = 'Diameter is required'
    if (!fields.roughness) err.roughness = 'Roughness is required'
    if (!fields.volumetricFlowrate) err.volumetricFlowrate = 'Volumetric flowrate is required'
    if (!fields.massFlowRate) err.massFlowRate = 'Mass flow rate is required'
    return err
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Form submitted!', fields)
    const err = validate()
    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }
    
    // Update params in the store
    updateNodeParams(nodeId, fields)
    console.log('Saving fields to store:', fields)
    onClose()
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="feed-form-flat">{

      
      <><h2 className="form-title">Pipe Parameters</h2><div className="form-grid">
        <div className="form-field">
          <label htmlFor="length">Length (m)</label>
          <input
            id="length"
            name="length"
            type="number"
            value={fields.length}
            onChange={handleChange}
            placeholder="e.g. 10"
            className={errors.length ? 'input-error' : ''}
            autoFocus />
          {errors.length && <span className="error-text">{errors.length}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="diameter">Diameter (m)</label>
          <input
            id="diameter"
            name="diameter"
            type="number"
            value={fields.diameter}
            onChange={handleChange}
            placeholder="e.g. 0.5"
            className={errors.diameter ? 'input-error' : ''} />
          {errors.diameter && <span className="error-text">{errors.diameter}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="roughness">Roughness (mm)</label>
          <input
            id="roughness"
            name="roughness"
            type="number"
            value={fields.roughness}
            onChange={handleChange}
            placeholder="e.g. 0.0001"
            className={errors.roughness ? 'input-error' : ''} />
          {errors.roughness && <span className="error-text">{errors.roughness}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="volumetricFlowrate">Volumetric Flowrate (m³/h)</label>
          <input
            id="volumetricFlowrate"
            name="volumetricFlowrate"
            type="number"
            value={fields.volumetricFlowrate}
            onChange={handleChange}
            placeholder="e.g. 100"
            className={errors.volumetricFlowrate ? 'input-error' : ''} />
          {errors.volumetricFlowrate && <span className="error-text">{errors.volumetricFlowrate}</span>}
        </div>
        <div className="form-field form-field-full">
          <label htmlFor="massFlowRate">Mass Flow Rate (kg/h)</label>
          <input
            id="massFlowRate"
            name="massFlowRate"
            type="number"
            value={fields.massFlowRate}
            onChange={handleChange}
            placeholder="e.g. 200"
            className={errors.massFlowRate ? 'input-error' : ''} />
          {errors.massFlowRate && <span className="error-text">{errors.massFlowRate}</span>}
        </div>
      </div><div className="form-actions">
          <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div><style jsx>{`
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
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .form-field-full {
            grid-column: 1 / 2;
          }
        }
      `}</style></>
        }</form>
  )
}
