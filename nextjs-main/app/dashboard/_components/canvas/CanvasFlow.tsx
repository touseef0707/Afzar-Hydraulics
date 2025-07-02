"use client";

import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useFlowStore, { RFState, CustomNode } from '@/store/FlowStore'; 
import { useShallow } from 'zustand/react/shallow';
import AppNode from './CustomNode';
import Modal from './Modal'; 
import { useToast } from '@/components/Toast';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  editingNodeId: state.editingNodeId,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  saveFlow: state.saveFlow,
  loadFlow: state.loadFlow,
  setEditingNodeId: state.setEditingNodeId,
});

export default function CanvasFlow({ flowId }: { flowId: string }) {
  const { showToast } = useToast();
  const { 
    nodes, edges, editingNodeId,
    onNodesChange, onEdgesChange, onConnect, 
    addNode, saveFlow, loadFlow, setEditingNodeId 
  } = useFlowStore(useShallow(selector));
  const isDirty = useFlowStore((state) => state.isDirty);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);
  
  const { flowToScreenPosition, screenToFlowPosition } = useReactFlow();
  
  const nodeTypes = useMemo(() => ({ custom: AppNode }), [AppNode]);

  const editingNode = useMemo(() => {
    if (!editingNodeId) return null;
    return nodes.find(node => node.id === editingNodeId);
  }, [editingNodeId, nodes]);

  const modalPosition = useMemo(() => {
    if (!editingNode) return null;
    return flowToScreenPosition({ x: editingNode.position.x, y: editingNode.position.y });
  }, [editingNode, flowToScreenPosition]);

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, loadFlow]);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const nodeInfoString = event.dataTransfer.getData('application/reactflow');
    if (!nodeInfoString) return;
    const { type, label } = JSON.parse(nodeInfoString);
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode: CustomNode = {
      id: `${type}_${Date.now()}`, type: 'custom', position,
      data: { label, nodeType: type },
    };
    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  const onSave = useCallback(() => {
    if (flowId) saveFlow(flowId, showToast);
  }, [flowId, saveFlow]);

  return (
    <>
      <div className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-white">
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
          onDrop={onDrop} onDragOver={(e) => e.preventDefault()}
          fitView proOptions={{ hideAttribution: true }} deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls />
          <Panel position="top-right">
            <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:cursor-pointer transition-all duration-200">
              Save
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {editingNodeId && modalPosition && (
        <Modal nodeId={editingNodeId} onClose={() => setEditingNodeId(null)}/>
      )}
    </>
  );
}
