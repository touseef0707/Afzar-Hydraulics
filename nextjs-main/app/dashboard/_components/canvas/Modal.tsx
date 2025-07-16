'use client'

import FeedForm from './forms/FeedForm'
import ProductForm from './forms/ProductForm'
import PipeForm from './forms/PipeForm'
import ValveForm from './forms/ValveForm'
import SplitterForm from './forms/SplitterForm'
import PumpForm from './forms/PumpForm'

// Defines the props for the ComponentModal
// componentType: Determines which form to render (feed, product, or pipe)
// flowId: Identifier for the current flow
// nodeId: Identifier for the node being edited
// onClose: Callback to close the modal
type ComponentModalProps = {
  componentType: 'feed' | 'product' | 'pipe' | 'valve' | 'splitter' | 'pump'
  flowId: string
  nodeId: string
  onClose: () => void
}

// A modal component that renders different forms based on componentType
// Acts as a container for various node configuration forms
export default function ComponentModal({
  componentType,
  flowId,
  nodeId,
  onClose,
}: ComponentModalProps) {

  // Determines which form component to render based on componentType
  // Returns the appropriate form with required props
  // Shows fallback message for invalid component types
  function renderForm() {
    switch (componentType) {
      case 'feed':
        return <FeedForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'product':
        return <ProductForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'pipe':
        return <PipeForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'valve':
        return <ValveForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'splitter':
        return <SplitterForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'pump':
        return <PumpForm flowId={flowId} nodeId={nodeId} onClose={onClose} />

      default:
        return <div>Please select a valid component type.</div>
    }
  }
  
  // Renders a modal overlay with:
  // - Semi-transparent background
  // - Centered content container
  // - Close button in top-right corner
  // - Dynamic form content based on componentType
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
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
        }
        .modal-close-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
