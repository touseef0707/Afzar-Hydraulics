"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useFlowStore, { RFState, CustomNode } from "@/store/FlowStore";
import { useShallow } from "zustand/react/shallow";
import AppNode from "./CustomNode";
import Modal from "./Modal";
import { useToast } from "@/components/Toast";


const selector = (state: RFState) => ({
  // Select only necessary state and actions from the Zustand store
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
  setDisplayResults: state.setDisplayResults,
  run: state.run,
  isRunning: state.isRunning,
  runResponse: state.runResponse,
  runError: state.runError,
  displayResults: state.displayResults,
  runOnce: state.runOnce
});

export default function CanvasFlow({ flowId }: { flowId: string }) {
  // Initialize toast notification handler
  const { showToast } = useToast();

  const {
    nodes,
    edges,
    editingNodeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    saveFlow,
    loadFlow,
    setEditingNodeId,
    run,
    setDisplayResults,
    displayResults,
    runOnce,
    isRunning,
    runError,
  } = useFlowStore(useShallow(selector));
  const isDirty = useFlowStore((state) => state.isDirty);

  // Handles flow execution when "Run" button is clicked
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
  }, [run, nodes, edges, flowId, runError, showToast, runOnce]);

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

  // Utilities to convert between screen and flow coordinates
  const { flowToScreenPosition, screenToFlowPosition } = useReactFlow();

  // Define custom node types for React Flow
  const nodeTypes = useMemo(() => ({ custom: AppNode }), [AppNode]);

  // Find the node currently being edited (if any)
  const editingNode = useMemo(() => {
    if (!editingNodeId) return null;
    return nodes.find((node) => node.id === editingNodeId);
  }, [editingNodeId, nodes]);

  // Extract component type from node data to determine modal content
  const componentType = useMemo(() => {
    if (!editingNode?.data?.nodeType) return undefined;
    return editingNode.data.nodeType as "feed" | "product" | "pipe" | undefined;
  }, [editingNode]);

  // Compute modal screen position based on node position
  const modalPosition = useMemo(() => {
    if (!editingNode) return null;
    return flowToScreenPosition({
      x: editingNode.position.x,
      y: editingNode.position.y,
    });
  }, [editingNode, flowToScreenPosition]);

  // Load flow data when component mounts or flowId changes
  useEffect(() => {
    if (flowId) {
      loadFlow(flowId);
    }
  }, [flowId, loadFlow]);

  // Handle drag-and-drop of new nodes into the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeInfoString = event.dataTransfer.getData("application/reactflow");
      if (!nodeInfoString) return;
      const { type, label } = JSON.parse(nodeInfoString);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: CustomNode = {
        id: `${type}_${Date.now()}`,
        type: "custom",
        position,
        data: { label, nodeType: type },
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  // Save flow state to backend or storage
  const onSave = useCallback(() => {
    if (flowId) saveFlow(flowId, showToast);
  }, [flowId, saveFlow, showToast]);

  return (
    <>
      <div className="w-full h-full rounded-xl shadow-lg overflow-hidden bg-white">

        {/* Main canvas area for rendering nodes and edges */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Controls />
          <Panel position="top-right">
            <div className="flex gap-x-2">

              {/* Toggle button to show/hide execution results (only if runOnce enabled)  */}
              {runOnce ? <button
                onClick={() => setDisplayResults(!displayResults)}
                className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:cursor-pointer
                ${displayResults ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"}
                text-white`}
              >
                {displayResults ? "Hide results" : "Show results"}
              </button> : null}

              {/* Button to trigger flow execution */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`px-4 py-2 text-white rounded-lg shadow-md transition-all duration-200 ${isRunning
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                  }`}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>

              {/* Button to save current flow state */}
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

      {/* Show modal only when a node is being edited */}
      {editingNodeId && modalPosition && componentType && (
        <Modal
          componentType={componentType}
          flowId={flowId}
          nodeId={editingNodeId}
          onClose={() => setEditingNodeId(null)}
        />
      )}
    </>
  );
}