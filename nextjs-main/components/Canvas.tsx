"use client";
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, Connection, Edge, Node, ReactFlowInstance, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FeedModal from './popupModals/FeedModal';
import ProductModal from './popupModals/ProductModal';
import ValveModal from './popupModals/ValveModal';
import PipeModal from './popupModals/PipeModal';
import PumpModal from './popupModals/PumpModal';
import SplitterModal from './popupModals/SplitterModal';
import MiscModal from './popupModals/MiscModal';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Add types for context menu state
interface ContextMenuState {
  open: boolean;
  type: string;
  element: Node | Edge | null;
  position: { x: number; y: number };
  source?: string;
  target?: string;
}

// Helper to generate unique IDs
function generateId(type: string) {
  return `${type}_${Math.random().toString(36).substr(2, 9)}`;
}

// Custom edge for pointer events
const CustomEdge = (props: any) => {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  return (
    <g>
      <path
        id={id}
        style={{ ...style, pointerEvents: 'stroke' }}
        className="react-flow__edge-path"
        d={`M${sourceX},${sourceY}L${targetX},${targetY}`}
        stroke="#0074D9"
        strokeWidth={2}
        fill="none"
      />
    </g>
  );
};
const edgeTypes = { custom: CustomEdge };

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ open: false, type: '', element: null, position: { x: 0, y: 0 } });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [modalClickCatcher, setModalClickCatcher] = useState(false);

  // Modified onDrop to assign unique id
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
        id: generateId(type),
        type: 'default',
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1), id: generateId(type) },
        style: { color: '#111', background: '#fff', border: '1px solid #bbb', fontWeight: 500 },
      };
      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((edges) => addEdge(params, edges)), [setEdges]);

  // Right-click node
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    let type = '';
    if (typeof node.data?.label === 'string') {
      type = node.data.label.toLowerCase();
    }
    setContextMenu({
      open: true,
      type,
      element: node,
      position: { x: event.clientX, y: event.clientY },
    });
  }, []);

  // Edge context menu handler with source/target node ids
  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setContextMenu({
      open: true,
      type: 'pipe',
      element: edge,
      position: { x: event.clientX, y: event.clientY },
      source: edge.source,
      target: edge.target,
    });
    setModalClickCatcher(true);
  }, []);

  // Save handler for modal
  const handleSave = (updatedData: Record<string, any>) => {
    if (!contextMenu.element) return;
    if (contextMenu.type === 'pipe') {
      setEdges((eds) => eds.map(e => e.id === contextMenu.element?.id ? { ...e, data: { ...e.data, ...updatedData } } : e));
    } else {
      setNodes((nds) => nds.map(n => n.id === contextMenu.element?.id ? { ...n, data: { ...n.data, ...updatedData } } : n));
    }
    setContextMenu({ ...contextMenu, open: false });
  };

  // Cancel handler
  const handleCancel = () => setContextMenu({ ...contextMenu, open: false });

  // Node delete handler
  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
  };

  // Custom node/edge connection positions
  const connectionLineStyle = { stroke: '#0074D9', strokeWidth: 2 };
  const nodeOptions = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };

  // Node label renderer with delete icon and handles
  const CustomNode = (props: any) => {
    const { id, data } = props;
    return (
      <div
        onMouseEnter={() => setHoveredNodeId(id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        style={{ color: '#111', background: '#fff', fontWeight: 500, padding: 6, borderRadius: 6, position: 'relative', minWidth: 60 }}
      >
        {/* Target handle (left) */}
        <Handle type="target" position={Position.Left} style={{ background: '#0074D9', width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff', left: -8, top: '50%', transform: 'translateY(-50%)' }} />
        <span>{data.label}</span>
        {hoveredNodeId === id && (
          <button
            onClick={() => handleDeleteNode(id)}
            style={{ position: 'absolute', top: 2, right: 2, background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 16 }}
            title="Delete"
          >
            ×
          </button>
        )}
        {/* Source handle (right) */}
        <Handle type="source" position={Position.Right} style={{ background: '#0074D9', width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff', right: -8, top: '50%', transform: 'translateY(-50%)' }} />
      </div>
    );
  };
  const nodeTypes = { default: CustomNode };

  // Close modal on outside click
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleClick = (e: MouseEvent) => {
      setContextMenu((ctx) => ({ ...ctx, open: false }));
      setModalClickCatcher(false);
    };
    if (modalClickCatcher) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [contextMenu.open, modalClickCatcher]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-[80vh] bg-gray-100 rounded-lg shadow-lg">
      <ReactFlow
        nodes={nodes.map(n => ({ ...n, ...nodeOptions }))}
        edges={edges.map(e => ({ ...e, type: 'custom' }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineStyle={connectionLineStyle}
      >
        <Background gap={16} size={1} color="#e0e7ef" />
        <MiniMap />
        <Controls />
      </ReactFlow>
      {contextMenu.open && contextMenu.type === 'feed' && contextMenu.element && 'data' in contextMenu.element && (
        <FeedModal
          data={contextMenu.element.data as { pressure?: number }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && contextMenu.type === 'product' && contextMenu.element && 'data' in contextMenu.element && (
        <ProductModal
          data={contextMenu.element.data as { pressureDrop?: number }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && contextMenu.type === 'valve' && contextMenu.element && 'data' in contextMenu.element && (
        <ValveModal
          data={contextMenu.element.data as { flowrate?: number; pressureDrop?: number }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && contextMenu.type === 'pump' && contextMenu.element && 'data' in contextMenu.element && (
        <PumpModal
          data={contextMenu.element.data as { flowrate?: number; pressure?: number; power?: number; efficiency?: number }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && (contextMenu.type === 'splitter' || contextMenu.type === 'splitter/mixer') && contextMenu.element && 'data' in contextMenu.element && (
        <SplitterModal
          data={contextMenu.element.data as { outputs?: number; splitRatios?: string; mixingEfficiency?: number }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && contextMenu.type === 'misc' && contextMenu.element && 'data' in contextMenu.element && (
        <MiscModal
          data={contextMenu.element.data as { label?: string; description?: string; value?: string }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {contextMenu.open && contextMenu.type === 'pipe' && contextMenu.element && 'data' in contextMenu.element && (
        <PipeModal
          data={{
            ...contextMenu.element.data,
            ...(contextMenu.element && 'source' in contextMenu.element ? { source: (contextMenu.element as Edge).source } : {}),
            ...(contextMenu.element && 'target' in contextMenu.element ? { target: (contextMenu.element as Edge).target } : {}),
          }}
          position={contextMenu.position}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
