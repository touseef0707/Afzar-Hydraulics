// app/dashboard/_components/Canvas.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowInstance,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import everything from your Zustand store
import useFlowStore, { RFState, CustomNode} from '@/store/store';
import { useShallow } from 'zustand/react/shallow';

// Import the CustomNode component we just created
import AppNode from './CustomNode';

// This selector optimizes performance by only re-rendering when the selected state changes.
const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  saveFlow: state.saveFlow,
  loadFlow: state.loadFlow
});

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, saveFlow, loadFlow } = useFlowStore(useShallow(selector));
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Register our custom node component with React Flow [2, 4].
  // We use useMemo for performance, so this object isn't recreated on every render.
  const nodeTypes = useMemo(() => ({ custom: AppNode }), []);

  // Load the flow from Firebase when the component first mounts.
  useEffect(() => {
    const flowId = window.location.pathname.split('/').pop() || 'default';
    if (flowId) {
      loadFlow(flowId);
    }
  }, [loadFlow]);

  // Handles dropping items from the sidebar onto the canvas.
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeInfoString = event.dataTransfer.getData('application/reactflow');
      if (!nodeInfoString || !reactFlowInstance) return;
      
      const { type, label } = JSON.parse(nodeInfoString);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create a new node object that matches our CustomNode type.
      // IMPORTANT: The `type` property is set to 'custom' to match the key in our `nodeTypes` object.
      const newNode: CustomNode = {
        id: `${type}_${Date.now()}`,
        type: 'custom',
        position,
        data: { label },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  // Handles the save button click.
  const onSave = useCallback(() => {
    const flowId = window.location.pathname.split('/').pop() || 'default';
    saveFlow(flowId);
  }, [saveFlow]);

  return (
    // This container gives the canvas its shadow, rounded corners, and white background.
    <div className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // Pass our custom node types to React Flow [5]
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        fitView
        proOptions={{ hideAttribution: true }} // Hides the "React Flow" attribution text
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Save to Firebase
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
