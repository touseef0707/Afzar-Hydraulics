"use client";
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Connection, 
  Edge, 
  Node, 
  ReactFlowInstance,
  Panel,
  MarkerType,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { fitView, zoomTo, setCenter } = useReactFlow();

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const customData = event.dataTransfer.getData('application/custom-data');
      
      if (!type || !reactFlowInstance || !reactFlowBounds) return;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type: 'default',
        position,
        data: { 
          label: customData || type.charAt(0).toUpperCase() + type.slice(1),
          ...(customData ? JSON.parse(customData) : {})
        },
      };
      
      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const edge = {
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        animated: true,
      };
      setEdges((edges) => addEdge(edge, edges));
    }, 
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (data: Record<string, any>) => {
      if (!selectedNode) return;
      
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
    },
    [selectedNode, setNodes]
  );

  const deleteSelected = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
    setEdges((edges) => 
      edges.filter(
        (edge) => 
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const centerSelectedNode = useCallback(() => {
    if (!selectedNode || !reactFlowInstance) return;
    
    const { position, width = 0, height = 0 } = selectedNode;
    setCenter(
      position.x + (width as number) / 2,
      position.y + (height as number) / 2,
      { zoom: 1, duration: 500 }
    );
  }, [selectedNode, reactFlowInstance, setCenter]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('react-flow-data', JSON.stringify(flow));
      alert('Flow saved to localStorage!');
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const flow = localStorage.getItem('react-flow-data');
    if (flow) {
      const { nodes: restoredNodes, edges: restoredEdges } = JSON.parse(flow);
      setNodes(restoredNodes);
      setEdges(restoredEdges);
      setTimeout(() => fitView(), 0);
    }
  }, [setNodes, setEdges, fitView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNode) {
        deleteSelected();
      }
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteSelected]);

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
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        nodesDraggable
        nodesConnectable
        elementsSelectable
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: false,
          style: { stroke: '#555' },
        }}
      >
        <Background gap={16} size={1} color="#e0e7ef" />
        <MiniMap />
        <Controls />
        
        <Panel position="top-right">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={onSave}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button 
              onClick={onRestore}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Restore
            </button>
          </div>
          {selectedNode && (
            <div className="bg-white p-4 rounded shadow-lg">
              <h3 className="font-bold mb-2">Node Properties</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={String(selectedNode.data.label ?? '')}
                  onChange={(e) => updateNodeData({ label: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button 
                onClick={centerSelectedNode}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition mr-2"
              >
                Center
              </button>
              <button 
                onClick={deleteSelected}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}