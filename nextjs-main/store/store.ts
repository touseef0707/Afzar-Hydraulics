
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

  // Placeholder for your save logic
  saveFlow: (flowId: string) => {
    const { nodes, edges } = get();
    // Here you would implement your logic to save the flow to Firebase
    console.log(`Saving flow ${flowId} to Firebase...`, { nodes, edges });
    // Example: firebase.save(flowId, { nodes, edges });
  },
}));

export default useFlowStore;