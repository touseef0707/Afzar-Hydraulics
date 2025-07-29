"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel, // Panel is imported to hold the buttons
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useFlowStore from "@/store/FlowStore";
import type { RFState, CustomNode } from "@/store/FlowStore";
import { useShallow } from "zustand/react/shallow";
import AppNode from "./CustomNode";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";
import PipeEdge from "./PipeEdge";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  editingNodeId: state.editingNodeId,
  editingEdgeId: state.editingEdgeId,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  saveFlow: state.saveFlow,
  loadFlow: state.loadFlow,
  setEditingNodeId: state.setEditingNodeId,
  setEditingEdgeId: state.setEditingEdgeId,
  run: state.run,
  isRunning: state.isRunning,
  runError: state.runError,
  displayResults: state.displayResults,
  runOnce: state.runOnce,
  setDisplayResults: state.setDisplayResults
});

export default function CanvasFlow({ flowId }: { flowId: string }) {
  const { showToast } = useToast();

  const {
    nodes,
    edges,
    editingNodeId,
    editingEdgeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    saveFlow,
    loadFlow,
    setEditingNodeId,
    setEditingEdgeId,
    run,
    isRunning,
    runError,
    displayResults,
    runOnce,
    setDisplayResults
  } = useFlowStore(useShallow(selector));
  const isDirty = useFlowStore((state) => state.isDirty);

  // Custom component types are defined using useMemo for efficiency.
  const nodeTypes = useMemo(() => ({ custom: AppNode }), []);
  const edgeTypes = useMemo(() => ({ pipe: PipeEdge }), []);

  const { screenToFlowPosition } = useReactFlow();

  // --- LOGIC FOR ACTIONS ---
  const handleRun = useCallback(async () => {
    const flowData = { nodes, edges, flowId };
    try {
      const response = await run(flowData);
      if (response.order) {
        setDisplayResults(true);
        showToast("Flow executed successfully!", "success");
      } 
      else{
        setDisplayResults(false);
        showToast(response, "error");
      }
    } catch (error) {
      console.error("Run failed:", error);
      showToast(runError || "Failed to execute flow", "error");
    }
  }, [run, nodes, edges, flowId, runError, showToast, setDisplayResults]);

   // Warn user before page reload if there are unsaved change
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const onSave = useCallback(() => {
    if (flowId) saveFlow(flowId, showToast);
  }, [flowId, saveFlow, showToast]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeInfoString = event.dataTransfer.getData("application/reactflow");
      if (!nodeInfoString) return;
      const { type, label } = JSON.parse(nodeInfoString);
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode({
        id: `${type}_${Date.now()}`,
        type: "custom",
        position,
        data: { label, nodeType: type },
      });
    },
    [screenToFlowPosition, addNode]
  );
  
  // --- LOGIC FOR MODAL ---
  const editingElement = useMemo(() => {
    if (editingNodeId) return { type: 'node', element: nodes.find(n => n.id === editingNodeId) };
    if (editingEdgeId) return { type: 'edge', element: edges.find(e => e.id === editingEdgeId) };
    return null;
  }, [editingNodeId, editingEdgeId, nodes, edges]);

  const componentType = useMemo(() => {
    if (!editingElement) return null;
    if (editingElement.type === 'edge') return 'pipe';
    return (editingElement.element as CustomNode)?.data.nodeType as any;
  }, [editingElement]);
  
  // --- LIFECYCLE HOOKS ---
  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, loadFlow]);

  return (
    <>
      <div className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls />

          {/* This Panel contains the Run and Save buttons */}
          <Panel position="top-right">
            <div className="flex gap-x-2">
              {runOnce && (
                <button
                  onClick={() => setDisplayResults(!displayResults)}
                  className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:cursor-pointer ${displayResults ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"} text-white`}
                >
                  {displayResults ? "Hide results" : "Show results"}
                </button>
              )}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`px-4 py-2 text-white rounded-lg shadow-md transition-all duration-200 ${isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'}`}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:cursor-pointer transition-all duration-200"
              >
                Save
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Renders the modal when a node or edge is being edited */}
      {componentType && editingElement && (
        <Modal
          componentType={componentType}
          flowId={flowId}
          nodeId={editingElement.type === 'node' ? editingElement.element!.id : null}
          edgeId={editingElement.type === 'edge' ? editingElement.element!.id : null}
          onClose={() => {
            setEditingNodeId(null);
            setEditingEdgeId(null);
          }}
        />
      )}
    </>
  );
}
