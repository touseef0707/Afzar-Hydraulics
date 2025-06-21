// components/CustomNode.tsx
"use client";

import React, { useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

type CustomNodeData = {
    label: React.ReactNode;
    icon: React.ReactNode;
  };

const CustomNode = ({
  id,
  data,
  selected,
}: NodeProps) => {
  const { setNodes } = useReactFlow();

  const onDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  return (
    <div className={`p-3 rounded-lg border-2 bg-white shadow-sm ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
        style={{ width: '20px', height: '20px' }}
      >
        <X className="w-3 h-3" />
      </button>

      {/* Node content */}
      <div className="text-center font-medium text-sm mb-1">{(data as CustomNodeData).label}</div>
      <div className="w-16 h-12 mx-auto bg-blue-50 rounded flex items-center justify-center">
      {(data as CustomNodeData).icon}
      </div>

      {/* Connectors on all sides */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};

export default CustomNode;