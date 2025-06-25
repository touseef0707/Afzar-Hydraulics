// app/dashboard/canvas/[id]/Canvas.tsx
"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Node,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useFlowStore, { RFState } from '@/store/store'; // Adjust path to your store
import { useShallow } from 'zustand/react/shallow';

// Selector to get specific state and actions from the store
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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Get state and actions from the Zustand store
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, saveFlow, loadFlow } = useFlowStore(useShallow(selector));

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const flowId = window.location.pathname.split('/').pop() || 'default';
    loadFlow(flowId);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type || !reactFlowInstance || !reactFlowBounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type: 'default',
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      };

      addNode(newNode); // Call the action from the store
    },
    [reactFlowInstance, addNode]
  );


  const onSave = useCallback(() => {
    const flowId = window.location.pathname.split('/').pop() || 'default';
    saveFlow(flowId); // Call the save action from the store
  }, [saveFlow]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-[80vh] bg-gray-100 rounded-lg shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onNodeClick={(_, node) => setSelectedNode(node)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
      >
        <Background gap={16} size={1} color="#e0e7ef" />
        <MiniMap />
        <Controls />

        <Panel position="top-right">
          <button
            onClick={onSave}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save to Firebase
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
