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

import { ref, set as fbSet, get as fbGet} from 'firebase/database';
import { database } from '@/firebase/clientApp';

// Define the state and actions for your store
export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveFlow: (flowId: string) => void; // Assuming save logic will be here
  loadFlow: (flowId: string) => void; // Assuming load logic will be here
};

const useFlowStore = create<RFState>((set, get) => ({
  nodes: [], // Initial state for nodes
  edges: [], // Initial state for edges

  // Handles node changes (like dragging, selecting)
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Handles edge changes
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Handles connecting nodes
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({
        ...connection,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true
      }, get().edges),
    });
  },

  // Action to add a new node (for the onDrop event)
  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
  },

  // Actions to set nodes/edges, useful for loading a flow
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  // Save flow data to Firebase
  saveFlow: (flowId: string) => {
    const { nodes, edges } = get();
    const projectId = flowId;
    // Remove leading '-' if present, and add 'fid_' prefix
    const formattedFlowId = "fid_" + flowId.replace(/^-/, '');

    // 1. Save the flow ID to the project's flows list
    const projectFlowRef = ref(database, `projects/${projectId}/flow`);
    fbSet(projectFlowRef, formattedFlowId);

    // 2. Save the flow data to its own place
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    fbSet(flowDataRef, { nodes, edges });

    console.log(`Flow ${formattedFlowId} saved to project ${projectId} and flows collection.`);
  },

  loadFlow: async (flowId: string) => {
    const formattedFlowId = "fid_" + flowId.replace(/^-/, '');
    const flowDataRef = ref(database, `flows/${formattedFlowId}`);
    const snapshot = await fbGet(flowDataRef);
    if (snapshot.exists()) {
      const { nodes, edges } = snapshot.val();
      set({ nodes, edges });
    }
  },

}));

export default useFlowStore;