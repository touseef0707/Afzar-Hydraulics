// src/components/PipeEdge.tsx
"use client";

import { getBezierPath, Position, EdgeLabelRenderer, EdgeProps } from "@xyflow/react";
import useFlowStore from "@/store/FlowStore";
import styles from './PipeEdge.module.css'; // Using the same CSS module
import { useShallow } from "zustand/shallow";
import NodeResult from "./NodeResult";

interface PipeEdgeProps extends EdgeProps {
  data?: {
    diameter?: number;
    label?: string;
    color?: string;
  };
}



export default function PipeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
  selected,
}: PipeEdgeProps) {
  const setEditingEdgeId = useFlowStore((state) => state.setEditingEdgeId);

  const {
    diameter = 16,
    label = "",
    color = "#888",
  } = data;

  const {
    runResponse,
    displayResults
  } = useFlowStore(
    useShallow(state => ({
      runResponse: state.runResponse,
      displayResults: state.displayResults
    }))
  );

  const nodeResult = runResponse?.results?.[id];

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingEdgeId(id);
  };

  const borderThickness = 3;
  const innerDiameter = Math.max(1, 20 - (borderThickness * 2));

  return (
    <g
      className={`${styles.edgeGroup} ${selected ? styles.selected : ''}`}
      onContextMenu={handleRightClick}
    >
      {/* --- SVG DEFINITIONS --- */}
      {/* This <defs> block is NOT visible but defines the gradient for the CSS to use. */}
      <defs>
        <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#c7d2fe', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* --- EDGE PATHS (Unchanged) --- */}
      <path
        className={styles.edgeHitbox}
        d={edgePath}
        fill="none"
        strokeWidth={diameter + 10}
      />
      <path
        id={`${id}_pipe_border`}
        className={styles.edgeCasing}
        d={edgePath}
        fill="none"
        stroke={color}
      />
      <path
        className={styles.edgeInterior}
        d={edgePath}
        fill="none"
        strokeWidth={innerDiameter}
      />
      <path
        d={edgePath}
        className={styles.edgeFlow}
        fill="none"
        strokeWidth={innerDiameter / 2.5} // Make flow slightly thinner to look better with gradient
      />

      {/* --- EDGE LABEL (Unchanged) --- */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "auto",
            }}
            className={`${styles.edgeLabel} nodrag nopan`}
            onContextMenu={(e) => {
              e.stopPropagation();
              handleRightClick(e);
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}

      {displayResults && nodeResult && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + 76}px)`,
              pointerEvents: "auto",
              zIndex: 10
            }}
            className="nodrag nopan"
          >
            <NodeResult result={nodeResult} nodeType="pipe" />
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}
