// app/dashboard/canvas/[id]/Canvas.tsx
"use client";
import { useCallback, useRef , useEffect, useState } from 'react';
import { ReactFlowInstance } from '@xyflow/react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  Connection, 
  Edge, 
  Node, 
  ReactFlowProvider,
  Panel,
  MarkerType,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowContext } from '@/context/FlowContext';

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes: contextNodes, edges: contextEdges, setNodes: setContextNodes, setEdges: setContextEdges, saveFlow } = useFlowContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(contextNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(contextEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Sync local state with context
  useEffect(() => {
    setNodes(contextNodes);
    setEdges(contextEdges);
  }, [contextNodes, contextEdges, setNodes, setEdges]);

  // Sync context with local state

  useEffect(() => {
    setContextNodes(nodes);
    setContextEdges(edges);
  }, [nodes, edges, setContextNodes, setContextEdges]);

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
      
      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true
      }, eds));
    }, 
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flowId = window.location.pathname.split('/').pop() || 'default';
      saveFlow(flowId);
    }
  }, [reactFlowInstance, saveFlow]);

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