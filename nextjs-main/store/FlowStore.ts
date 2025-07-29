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
  editingEdgeId: string | null; // ID of the edge being edited
  isDirty: boolean;
  runResponse: any | null;
  runError: string | null;
  isRunning: boolean;
  displayResults: boolean;
  runOnce: boolean;

  // Flow management actions
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
  ) => Promise<void>;
  loadFlow: (flowId: string) => Promise<void>;
  deleteNode: (nodeId: string) => void;
  updateNodeParams: (nodeId: string, params: object) => void;
  updateEdgeData: (edgeId: string, data: object) => void; // Action to update edge data
  setEditingNodeId: (nodeId: string | null) => void;
  setEditingEdgeId: (edgeId: string | null) => void; // Action to set the editing edge

  // Run functionality
  run: (flowdata: any) => Promise<any>;
  clearRunResults: () => void;
  clearNodesAndEdges: () => void;
  setDisplayResults: (show: boolean) => void;

  // Private/internal methods
  _filterFlowData: (flowdata: any) => any;
};

const useFlowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  editingNodeId: null,
  editingEdgeId: null,
  isDirty: false,
  runResponse: null,
  runError: null,
  isRunning: false,
  displayResults: true,
  runOnce: false,

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

  // --- MODIFIED onConnect ---
  // Ensures new connections have the correct type and defaults.
  onConnect: (connection: Connection) => {
    const newEdge = {
      ...connection,
      type: "pipe",
      data: {
        label: "", // Start with no label
        diameter: 20, // Start with a thick, clickable diameter
        color: "#64748b",
      },
    };
    set({
      edges: addEdge(newEdge, get().edges),
      isDirty: true,
    });
  },

  addNode: (node: CustomNode) => set({ nodes: [...get().nodes, node], isDirty: true }),
  setNodes: (nodes: CustomNode[]) => set({ nodes, isDirty: true }),
  setEdges: (edges: Edge[]) => set({ edges, isDirty: true }),
  setEditingNodeId: (nodeId: string | null) => set({ editingNodeId: nodeId }),
  setEditingEdgeId: (edgeId: string | null) => set({ editingEdgeId: edgeId }),

  updateNodeParams: (nodeId: string, params: object) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, params: { ...node.data.params, ...params } } };
        }
        return node;
      }),
      isDirty: true,
    });
  },
  
  updateEdgeData: (edgeId: string, newData: object) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, ...newData } };
        }
        return edge;
      }),
      isDirty: true,
    });
  },

  // --- MODIFIED saveFlow ---
  // This ensures every edge is explicitly typed before being sent to the database.
  saveFlow: async (flowId: string, showToast?) => {
    try {
      const { nodes, edges } = get();
      const formattedFlowId = "fid_" + flowId.replace(/^-/, "");
      
      // Ensure every edge has the 'pipe' type before saving.
      const edgesToSave = edges.map(edge => ({
        ...edge,
        type: 'pipe',
      }));

      const flowData = {
        nodes: sanitizeForFirebase(nodes),
        edges: sanitizeForFirebase(edgesToSave),
      };

      const projectFlowRef = ref(database, `projects/${flowId}/flow`);
      fbSet(projectFlowRef, formattedFlowId);
      const flowDataRef = ref(database, `flows/${formattedFlowId}`);
      await fbSet(flowDataRef, flowData);
      set({ isDirty: false });
      showToast?.("Flow saved successfully!", "success");
    } catch (error) {
      showToast?.("Failed to save flow", "error");
    }
  },

  // --- MODIFIED loadFlow ---
  // This "upgrades" any old data from the database to ensure it has the correct type.
  loadFlow: async (flowId: string) => {
    const formattedFlowId = "fid_" + flowId.replace(/^-/, "");
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    try {
      const snapshot = await fbGet(flowDataRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Ensure every loaded edge is given the 'pipe' type.
        const loadedEdges = (Array.isArray(data.edges) ? data.edges : []).map((edge: Edge) => ({
          ...edge,
          type: 'pipe',
        }));

        set({
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
          edges: loadedEdges,
          isDirty: false,
        });
      } else {
        set({ nodes: [], edges: [], isDirty: false });
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
  
  run: async (flowdata: any) => {
    set({ isRunning: true, runError: null });
    try {
      const filteredData = get()._filterFlowData(flowdata);
      const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL;
      if (!apiUrl) {
        throw new Error("FLASK_API_URL is not defined in environment variables");
      }
      const response = await fetch(`${apiUrl}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredData),
        mode: 'cors',
        credentials: 'include'
      });
      const result = await response.json();

      if (result.error) {
        set({ runError: result.error || "Unknown error" })
        set({ runResponse: null });
        set({ runOnce: false });
        return result.error;
      }

      if (response.ok) {
        set({ runResponse: result, runOnce: true });
      } else {
        set({ runError: result.error || "Unknown error", runResponse: null, runOnce: false });
        return result.error;
      }
      
      return result;
    } catch (err: any) {
      set({ runError: err.message || "Unknown error" });
      throw err;
    } finally {
      set({ isRunning: false });
    }
  },

  clearRunResults: () => set({ runResponse: null, runError: null, runOnce: false }),
  clearNodesAndEdges: () => set({ nodes: [], edges: [], isDirty: false }),
  setDisplayResults: (show) => set({ displayResults: show }),
  
  _filterFlowData: (flowdata: any): any => {
    if (!flowdata) return flowdata;
    const filteredNodes = flowdata.nodes?.map((node: any) => {
      const { measured, position, type, selected, dragging, ...filteredNode } = node;
      return filteredNode;
    }) || [];
    const filteredEdges = flowdata.edges?.map((edge: any) => {
      const { animated, ...filteredEdge } = edge;
      return filteredEdge;
    }) || [];
    return { ...flowdata, nodes: filteredNodes, edges: filteredEdges };
  }
}));

export default useFlowStore;
