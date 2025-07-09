"use client";

import { useState } from "react";

export function useRun() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function filterFlowData(flowdata: any): any {
    if (!flowdata) return flowdata;
      
    // Filter nodes
    const filteredNodes = flowdata.nodes?.map((node: any) => {
      const { measured, position, type, selected, dragging, ...filteredNode } = node;
      return filteredNode;
    }) || [];
    
    // Filter edges
    const filteredEdges = flowdata.edges?.map((edge: any) => {
      const { animated, ...filteredEdge } = edge;
      return filteredEdge;
    }) || [];
    
    return {
      ...flowdata,
      nodes: filteredNodes,
      edges: filteredEdges
    };
  }

  async function run(flowdata: any): Promise<any> {
    setLoading(true);
    setError(null);
    try {
      const filteredData = filterFlowData(flowdata);
      
      const response = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredData),
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, error };
}