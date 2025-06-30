"use client";

import { ReactFlowProvider } from '@xyflow/react';
import CanvasFlow from './CanvasFlow'; 

interface FlowProps {
  flowId: string;
}

export default function Canvas({ flowId }: FlowProps) {
  return (
    // ReactFlowProvider provides the context that the useReactFlow hook needs
    <ReactFlowProvider>
      <CanvasFlow flowId={flowId} />
    </ReactFlowProvider>
  );
}
