"use client";

import { create } from "zustand";
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
  MarkerType,
} from "@xyflow/react";
import { ref, set as fbSet, get as fbGet } from "firebase/database";
import { database } from "@/firebase/clientApp";

// --- Utility Function ---
const sanitizeForFirebase = (data: any): any => {
  if (Array.isArray(data)) return data.map(item => sanitizeForFirebase(item));
  if (data !== null && typeof data === "object") {
    const sanitizedObject: { [key: string]: any } = {};
    for (const key in data) {
      if (
        Object.prototype.hasOwnProperty.call(data, key) &&
        data[key] !== undefined
      ) {
        sanitizedObject[key] = sanitizeForFirebase(data[key]);
      }
    }
    return sanitizedObject;
  }
  return data;
};

type CustomNodeData = {
  label: string;
  nodeType: string;
  params?: Record<string, any>;
};

export type CustomNode = Node<CustomNodeData>;

export type RFState = {
  nodes: CustomNode[];
  edges: Edge[];
  editingNodeId: string | null;
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: CustomNode) => void;
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveFlow: (
    flowId: string,
    showToast?: (message: string, type: "success" | "error") => void
  ) => void;
  loadFlow: (flowId: string) => Promise<void>;
  deleteNode: (nodeId: string) => void;
  updateNodeParams: (nodeId: string, params: object) => void;
  setEditingNodeId: (nodeId: string | null) => void;
};

const useFlowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  editingNodeId: null,
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as CustomNode[],
      isDirty: true,
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          markerEnd: { type: MarkerType.ArrowClosed },
          animated: true,
        },
        get().edges
      ),
      isDirty: true,
    });
  },
  addNode: (node: CustomNode) =>
    set({ nodes: [...get().nodes, node], isDirty: true }),
  setNodes: (nodes: CustomNode[]) => set({ nodes, isDirty: true }),
  setEdges: (edges: Edge[]) => set({ edges, isDirty: true }),
  setEditingNodeId: (nodeId: string | null) => set({ editingNodeId: nodeId }),

  saveFlow: (flowId: string, showToast?) => {
    try {
      const { nodes, edges } = get();
      const formattedFlowId = "fid_" + flowId.replace(/^-/, "");
      const flowData = {
        nodes: Array.isArray(nodes) ? sanitizeForFirebase(nodes) : [],
        edges: Array.isArray(edges) ? sanitizeForFirebase(edges) : [],
      };
      const projectFlowRef = ref(database, `projects/${flowId}/flow`);
      fbSet(projectFlowRef, formattedFlowId);
      const flowDataRef = ref(database, `flows/${formattedFlowId}`);
      fbSet(flowDataRef, flowData);
      set({ isDirty: false });
      showToast?.("Flow saved successfully!", "success");
    } catch (error) {
      showToast?.("Failed to save flow", "error");
    }
  },

  loadFlow: async (flowId: string) => {
    const formattedFlowId = "fid_" + flowId.replace(/^-/, "");
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    try {
      const snapshot = await fbGet(flowDataRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        set({
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
          edges: Array.isArray(data.edges) ? data.edges : [],
          isDirty: false,
        });
        console.log("Flow loaded successfully");
      } else {
        set({ nodes: [], edges: [], isDirty: false });
        console.log("No flow data found for this ID.");
      }
    } catch (error) {
      set({ nodes: [], edges: [], isDirty: false });
      console.error("Failed to load flow:", error);
    }
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      isDirty: true,
    });
  },

  // In your flow store
updateNodeParams: (nodeId: string, params: object) => {
    console.log('Updating params for node:', nodeId, 'with:', params);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          console.log('Previous params:', node.data.params);
          const updatedNode = {
            ...node,
            data: { 
              ...node.data, 
              params: { ...node.data.params, ...params } 
            }
          };
          console.log('Updated node:', updatedNode);
          return updatedNode;
        }
        return node;
      }),
      isDirty: true,
    });
  },
}));

export default useFlowStore;
