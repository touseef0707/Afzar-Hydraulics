// app/dashboard/_components/CustomNode.tsx
"use client";

import { FC, memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';

// Define the specific shape of the 'data' object for our custom nodes.
type CustomNodeData = {
  label: string;
};
type AppNode = Node<CustomNodeData>;

// The CustomNode component is a standard React component.
// It receives props like `data` which contains the node's label.
const CustomNode: FC<NodeProps<AppNode>> = ({ data }) => {
  return (
    // This is the main container for the custom node.
    // We use Tailwind CSS for styling to match your screenshot.
    <div className="bg-white border-2 border-black rounded-lg shadow-md w-48 h-16 flex items-center justify-center">
      
      {/* Handle for incoming connections (target) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-500"
      />
      
      {/* Display the node's label from the data prop */}
      <div className="text-center font-medium text-gray-800">
        {data.label}
      </div>

      {/* Handle for outgoing connections (source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-gray-500"
      />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders for performance.
export default memo(CustomNode);
