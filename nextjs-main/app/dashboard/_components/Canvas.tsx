"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import useFlowStore, { RFState, CustomNode } from '@/store/store';
import { useShallow } from 'zustand/react/shallow';

// Import the CustomNode component
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
  loadFlow: state.loadFlow,
});

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, saveFlow, loadFlow } = useFlowStore(useShallow(selector));
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Register our custom node component with React Flow.
  // We use useMemo for performance, so this object isn't recreated on every render.
  const nodeTypes = useMemo(() => ({ custom: AppNode }), []);

  // Load the flow from Firebase when the component first mounts.
  useEffect(() => {
    const flowId = window.location.pathname.split('/').pop();
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

      // The 'type' here is the original type from the sidebar (e.g., 'feed', 'product')
      const { type, label } = JSON.parse(nodeInfoString);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create a new node object that matches our CustomNode type.
      // IMPORTANT: The `type` property is set to 'custom' to match the key in our `nodeTypes` object.
      // The original type is passed in the data payload as `nodeType`.
      const newNode: CustomNode = {
        id: `${type}_${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label,
          nodeType: type, 
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  // Handles the save button click.
  const onSave = useCallback(() => {
    const flowId = window.location.pathname.split('/').pop();
    if (flowId) {
        saveFlow(flowId);
    }
  }, [saveFlow]);

  return (
    <div className="w-full h-[calc(100%-0.5rem)] rounded-xl shadow-lg overflow-hidden bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // Pass our custom node types to React Flow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        fitView
        proOptions={{ hideAttribution: true }} // Hides the "React Flow" attribution text
        // Enables keyboard shortcuts for deletion (Backspace/Delete key)
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Panel position="top-right">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:cursor-pointer transition-all duration-200"
          >
            Save
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
