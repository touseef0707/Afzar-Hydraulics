'use client'
import { useState, useEffect } from 'react'
import { saveNodeParams, loadNodeParams } from '@/firebase/clientApp'

type ProductFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

export default function ProductForm({ flowId, nodeId, onClose }: ProductFormProps) {
  const [fields, setFields] = useState({ pressure: '', composition: '', temperature: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadNodeParams(flowId, nodeId).then(data => {
      if (data) setFields({
        pressure: data.pressure || '',
        composition: data.composition || '',
        temperature: data.temperature || '',
      })
      setLoading(false)
    })
  }, [flowId, nodeId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields({ ...fields, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const err: { [key: string]: string } = {}
    if (!fields.pressure) err.pressure = 'Pressure is required'
    if (!fields.composition) err.composition = 'Composition is required'
    if (!fields.temperature) err.temperature = 'Temperature is required'
    return err
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length > 0) {
      setErrors(err)
      return
    }
    await saveNodeParams(flowId, nodeId, fields)
    onClose()
  }

  if (loading) return <div className="form-loading">Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="feed-form-flat">
      {
      <><h2 className="form-title">Product Parameters</h2><div className="form-grid">
          <div className="form-field">
            <label htmlFor="pressure">Operating Pressure (kPag)</label>
            <input
              id="pressure"
              name="pressure"
              type="number"
              value={fields.pressure}
              onChange={handleChange}
              placeholder="e.g. 100"
              className={errors.pressure ? 'input-error' : ''}
              autoFocus />
            {errors.pressure && <span className="error-text">{errors.pressure}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="composition">Outlet Composition</label>
            <input
              id="composition"
              name="composition"
              type="text"
              value={fields.composition}
              onChange={handleChange}
              placeholder="e.g. H2O"
              className={errors.composition ? 'input-error' : ''} />
            {errors.composition && <span className="error-text">{errors.composition}</span>}
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="temperature">Temperature (°C)</label>
            <input
              id="temperature"
              name="temperature"
              type="number"
              value={fields.temperature}
              onChange={handleChange}
              placeholder="e.g. 25"
              className={errors.temperature ? 'input-error' : ''} />
            {errors.temperature && <span className="error-text">{errors.temperature}</span>}
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
