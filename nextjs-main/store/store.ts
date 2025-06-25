// store/store.ts
"use client";

import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from '@xyflow/react';
import { ref, set as fbSet, get as fbGet } from 'firebase/database';
import { database } from '@/firebase/clientApp';

// --- Utility Function ---
const sanitizeForFirebase = (data: any): any => {
  if (Array.isArray(data)) return data.map(item => sanitizeForFirebase(item));
  if (data !== null && typeof data === 'object') {
    const sanitizedObject: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
        sanitizedObject[key] = sanitizeForFirebase(data[key]);
      }
    }
    return sanitizedObject;
  }
  return data;
};

// --- Types ---
type CustomNodeData = {
  label: string;
};

// --- THIS IS THE CRITICAL LINE ---
// The 'export' keyword makes this type available to be imported by other files like Canvas.tsx.
// Without 'export', the error in your screenshot will occur.
export type CustomNode = Node<CustomNodeData>;

export type RFState = {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: CustomNode) => void;
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveFlow: (flowId: string) => void;
  loadFlow: (flowId: string) => void;
};

// --- Store Definition ---
const useFlowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => set({ nodes: applyNodeChanges(changes, get().nodes) as CustomNode[] }),
  onEdgesChange: (changes: EdgeChange[]) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection: Connection) => set({ edges: addEdge({ ...connection, markerEnd: { type: MarkerType.ArrowClosed }, animated: true }, get().edges) }),
  addNode: (node: CustomNode) => set({ nodes: [...get().nodes, node] }),
  setNodes: (nodes: CustomNode[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),

  saveFlow: (flowId: string) => {
    const { nodes, edges } = get();
    const formattedFlowId = "fid_" + flowId.replace(/^-/, '');
    const flowData = { nodes: sanitizeForFirebase(nodes), edges: sanitizeForFirebase(edges) };
    const projectFlowRef = ref(database, `projects/${flowId}/flow`);
    fbSet(projectFlowRef, formattedFlowId);
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    fbSet(flowDataRef, flowData);
    console.log(`Flow ${formattedFlowId} saved to project ${flowId}.`);
  },

  loadFlow: async (flowId: string) => {
    const formattedFlowId = "fid_" + flowId.replace(/^-/, '');
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    try {
      const snapshot = await fbGet(flowDataRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        set({ nodes: data.nodes || [], edges: data.edges || [] });
        console.log("Flow loaded successfully");
      } else {
        console.log("No flow data found for this ID.");
        set({ nodes: [], edges: [] });
      }
    } catch (error) {
      console.error("Failed to load flow:", error);
    }
  },
}));

export default useFlowStore;
