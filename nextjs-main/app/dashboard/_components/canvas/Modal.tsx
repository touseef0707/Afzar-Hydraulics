'use client'

import FeedForm from './FeedForm'
import ProductForm from './ProductForm'
import PipeForm from './PipeForm'

type ComponentModalProps = {
  componentType: 'feed' | 'product' | 'pipe'
  flowId: string
  nodeId: string
  onClose: () => void
}

export default function ComponentModal({
  componentType,
  flowId,
  nodeId,
  onClose,
}: ComponentModalProps) {
  function renderForm() {
    switch (componentType) {
      case 'feed':
        return <FeedForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'product':
        return <ProductForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      case 'pipe':
        return <PipeForm flowId={flowId} nodeId={nodeId} onClose={onClose} />
      default:
        return <div>Please select a valid component type.</div>
    }
  }

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
