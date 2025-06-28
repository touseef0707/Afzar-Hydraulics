// file: src/components/FlowCanvas.tsx

"use client"; // This marks the component and its children as Client Components

import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './Canvas'; 

// This component accepts the flow ID from its parent Server Component
interface FlowCanvasProps {
  flowId: string;
}

export default function FlowCanvas({ flowId }: FlowCanvasProps) {
  return (
    // ReactFlowProvider provides the context that the useReactFlow hook needs
    <ReactFlowProvider>
      <Canvas flowId={flowId} />
    </ReactFlowProvider>
  );
}
