'use client'
import useFlowStore from '@/store/FlowStore'
import { useState, useEffect } from 'react'

type ProductFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

export default function ProductForm({nodeId, onClose }: ProductFormProps) {
  const [fields, setFields] = useState({ 
    pressure: '',
    temperature: '',
    level: '',
    composition: '',
    vaporFraction: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Get store methods and state
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  useEffect(() => {
    setLoading(true)
    // Find the current node in the store
    const currentNode = nodes.find(node => node.id === nodeId)
    
    if (currentNode?.data?.params) {
      setFields({
        pressure: currentNode.data.params.pressure || '',
        temperature: currentNode.data.params.temperature || '',
        level: currentNode.data.params.level || '',
        composition: currentNode.data.params.composition || '',
        vaporFraction: currentNode.data.params.vaporFraction || ''
      })
    }
    setLoading(false)
  }, [nodeId, nodes])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Update params in the store
    updateNodeParams(nodeId, fields)
    onClose()
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="feed-form-flat">
      <h2 className="form-title">Product Parameters</h2>
      
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="pressure">Operating Pressure (kPag)</label>
          <input
            id="pressure"
            name="pressure"
            type="number"
            step="0.1"
            value={fields.pressure}
            onChange={handleChange}
            placeholder="Enter pressure"
            autoFocus />
        </div>
        
        <div className="form-field">
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            value={fields.temperature}
            onChange={handleChange}
            placeholder="Enter temperature" />
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
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="level">Level (%)</label>
              <input
                id="level"
                name="level"
                type="number"
                step="1"
                value={fields.level}
                onChange={handleChange}
                placeholder="Enter level" />
            </div>
            
            <div className="form-field">
              <label htmlFor="vaporFraction">Vapor Fraction</label>
              <input
                id="vaporFraction"
                name="vaporFraction"
                type="number"
                step="0.01"
                value={fields.vaporFraction}
                onChange={handleChange}
                placeholder="Enter vapor fraction" />
            </div>
            
            <div className="form-field form-field-full">
              <label htmlFor="composition">Composition</label>
              <input
                id="composition"
                name="composition"
                type="text"
                value={fields.composition}
                onChange={handleChange}
                placeholder="e.g. Water 100%" />
            </div>
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
          gap: 18px;
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