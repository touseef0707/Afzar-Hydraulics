"use client";

import { FC, memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { NODES, COLOR_CLASSES } from './flow_config';
import useFlowStore from '@/store/store';


type CustomNodeData = {
  label: string;
  nodeType: string;
};
type AppNode = Node<CustomNodeData>;

// We need the `id` prop to delete the node
const CustomNode: FC<NodeProps<AppNode>> = ({ id, data }) => {
  // Get the delete function from our store
  const { deleteNode } = useFlowStore.getState();

  // Find the configuration for this specific node type
  const nodeConfig = NODES.find((node) => node.type === data.nodeType);

  if (!nodeConfig) {
    // Render a fallback or nothing if the type is unknown
    return null; 
  }

  // Get the dynamic Tailwind CSS classes for the border and text
  const borderColorClass = COLOR_CLASSES.border[nodeConfig.color];
  const textColorClass = COLOR_CLASSES.text[nodeConfig.color];

  return (
    <div className={`group relative bg-white border-2 rounded-lg shadow-md w-36 h-12 flex items-center justify-center px-4 ${borderColorClass}`}>
      
      {/* Delete Button */}
      <button 
        onClick={() => deleteNode(id)}
        className="absolute top-0 right-0 w-5 h-5 -mt-2 -mr-2 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:!text-red-500 hover:!border-red-500 transition-opacity duration-200"
        aria-label="Delete Node"
      >
        <X size={14} />
      </button>

      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-gray-500"
      />
      
      <div className="flex items-center gap-2">
        <span className={textColorClass}>{nodeConfig.icon}</span>
        <div className="text-center font-medium text-sm text-gray-800">
          {data.label}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-gray-500"
      />
    </div>
  );
};

export default memo(CustomNode);
