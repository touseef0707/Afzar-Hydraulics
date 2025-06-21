// context/FlowContext.tsx
"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { ref, set, onValue, off } from 'firebase/database';
import { database } from '@/firebase/clientApp';

type FlowContextType = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveFlow: (flowId: string) => Promise<void>;
  loadFlow: (flowId: string) => void;
};

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children, flowId }: { children: ReactNode, flowId: string }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const flowRef = ref(database, `flows/${flowId}`);
    
    const listener = onValue(flowRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      }
    });

    return () => off(flowRef, 'value', listener);
  }, [flowId]);

  const saveFlow = async (flowId: string) => {
    const flowRef = ref(database, `flows/${flowId}`);
    await set(flowRef, { nodes, edges });
  };

  const loadFlow = (flowId: string) => {
    const flowRef = ref(database, `flows/${flowId}`);
    onValue(flowRef, (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        }
      }
    });
  };

  return (
    <FlowContext.Provider value={{ nodes, edges, setNodes, setEdges, saveFlow, loadFlow }}>
      {children}
    </FlowContext.Provider>
  );
}

export function useFlowContext() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider');
  }
  return context;
}