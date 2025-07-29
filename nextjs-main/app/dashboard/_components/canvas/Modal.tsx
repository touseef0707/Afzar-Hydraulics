'use client'

import FeedForm from './forms/FeedForm'
import ProductForm from './forms/ProductForm'
import PipeForm from './forms/PipeForm'
import ValveForm from './forms/ValveForm'
import SplitterForm from './forms/SplitterForm'
import PumpForm from './forms/PumpForm'

// The props definition remains the same
type ComponentModalProps = {
  componentType: 'feed' | 'product' | 'pipe' | 'valve' | 'splitter' | 'pump'
  flowId: string
  nodeId?: string | null
  edgeId?: string | null
  onClose: () => void
}

export default function ComponentModal({
  componentType,
  flowId,
  nodeId,
  edgeId,
  onClose,
}: ComponentModalProps) {

  // The renderForm function remains exactly the same
  function renderForm() {
    switch (componentType) {
      case 'feed':
        return <FeedForm flowId={flowId} nodeId={nodeId!} onClose={onClose} />
      case 'product':
        return <ProductForm flowId={flowId} nodeId={nodeId!} onClose={onClose} />
      case 'valve':
        return <ValveForm flowId={flowId} nodeId={nodeId!} onClose={onClose} />
      case 'splitter':
        return <SplitterForm flowId={flowId} nodeId={nodeId!} onClose={onClose} />
      case 'pump':
        return <PumpForm flowId={flowId} nodeId={nodeId!} onClose={onClose} />
      
      case 'pipe':
        if (edgeId) {
          return <PipeForm flowId={flowId} edgeId={edgeId} onClose={onClose} />
        }
        if (nodeId) {
          return <PipeForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
        }
        return <div>Error: No ID provided for Pipe form.</div>

      default:
        return <div>Please select a valid component type.</div>
    }
  }
  
  // The JSX structure remains the same, only the <style> tag is updated
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="modal-close-button"
        >
          ×
        </button>
        {renderForm()}
      </div>
      
      {/* --- UPDATED STYLES --- */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          /* Use a more transparent background to see the blur effect */
          background: rgba(10, 20, 30, 0.4);
          /* The key property for the blur effect */
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px); /* For Safari browser support */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 12px; /* A softer, more modern corner radius */
          width: 90%;
          max-width: 500px;
          position: relative;
          /* A refined shadow to give the panel depth and a "pop" effect */
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          /* A pop-in animation for a smoother appearance */
          animation: pop-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .modal-close-button {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%; /* Make the button circular */
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: background-color 0.2s, transform 0.2s;
        }
        .modal-close-button:hover {
          background: #e2e8f0;
          color: #1e293b;
          transform: rotate(90deg);
        }

        /* Keyframes define the steps of the pop-in animation */
        @keyframes pop-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
