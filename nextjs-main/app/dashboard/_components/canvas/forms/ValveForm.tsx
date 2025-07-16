'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import useFlowStore from '@/store/FlowStore'
import { useClickOutside } from '@/hooks/useClickOutside'

type ValveFormProps = {
  flowId: string
  nodeId: string
  onClose: () => void
}

export default function ValveForm({ nodeId, onClose }: ValveFormProps) {
  const [fields, setFields] = useState({
    // Placeholder for future fields
    status: 'under_development'
  })
  const [initialValues, setInitialValues] = useState({
    status: 'under_development'
  })
  const [loading, setLoading] = useState(false)
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const nodes = useFlowStore(state => state.nodes)
  const updateNodeParams = useFlowStore(state => state.updateNodeParams)

  const hasUnsavedChanges = useMemo(() => {
    // Always false since this is under development
    return false
  }, [])

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
      setInitialValues({
        status: currentNode.data.params.status || 'under_development'
      })
    }
  }, [nodeId, nodes])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="feed-form-flat">
        <h2 className="form-title">Control Valve Parameters</h2>
        
        <div className="under-development-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3>Under Development</h3>
          <p>Control Valve configuration will be available in a future update.</p>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => hasUnsavedChanges ? setShowCloseWarning(true) : onClose()} 
            className="btn-cancel"
          >
            Close
          </button>
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
        .under-development-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 0;
          gap: 12px;
          color: #64748b;
        }
        .under-development-message svg {
          color: #f59e0b;
        }
        .under-development-message h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .under-development-message p {
          margin: 0;
          max-width: 300px;
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
        .btn-cancel:hover {
          background: #e5e7eb;
          color: #1e293b;
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
      `}</style>
    </>
  )
}