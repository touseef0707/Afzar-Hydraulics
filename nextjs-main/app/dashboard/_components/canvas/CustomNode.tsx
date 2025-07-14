"use client";

import { FC, memo } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import useFlowStore from '@/store/FlowStore';
import { NODE_CONFIG, COLOR_CLASSES } from './flow_config';
import NodeResult from './NodeResult';
import { useShallow } from 'zustand/shallow';

type CustomNodeData = {
  label: string;
  nodeType: string;
  params?: Record<string, any>;
};

type AppNode = Node<CustomNodeData>;

const CustomNode: FC<NodeProps<AppNode>> = ({ id, data }) => {
  const {
    deleteNode,
    setEditingNodeId,
    runResponse,
    displayResults        // <- the new flag you added
  } = useFlowStore(
    useShallow(state => ({
      deleteNode: state.deleteNode,
      setEditingNodeId: state.setEditingNodeId,
      runResponse: state.runResponse,
      displayResults: state.displayResults
    }))
  );

  const nodeConfig = NODE_CONFIG[data.nodeType];

  if (!nodeConfig) {
    console.warn(`No configuration found for node type: ${data.nodeType}`);
    return null;
  }

  const IconComponent = nodeConfig.icon;
  const color = nodeConfig.color;

  const borderColorClass = COLOR_CLASSES.border[color];
  const textColorClass = COLOR_CLASSES.text[color];
  const bgHoverClass = COLOR_CLASSES.bgHover[color];

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingNodeId(id);
  };

  // Determine which handles to show based on node type
  const showSourceHandle = data.nodeType !== 'product';
  const showTargetHandle = data.nodeType !== 'feed';

  const nodeResult = runResponse?.results?.[id];

  return (
    <div
      onContextMenu={handleRightClick}
      className={`group relative bg-white border-2 rounded-lg shadow-md w-36 h-12 px-4 transition-colors duration-200 ${borderColorClass} ${bgHoverClass}`}
    >
      {/* Target handle on the left */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}

      {/* Source handle on the right */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2 !h-2 !bg-gray-500"
        />
      )}

      <button onClick={() => deleteNode(id)} className="absolute top-0 right-0 w-5 h-5 -mt-2 -mr-2 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-400 opacity-0 hover:cursor-pointer group-hover:opacity-100 hover:!text-red-500 hover:!border-red-500 transition-opacity duration-200">
        <X size={14} />
      </button>

      <div className="w-full h-full flex items-center justify-center gap-2">
        <IconComponent size={20} className={textColorClass} />
        <div className="text-center font-medium text-sm text-gray-800">
          {data.label}
        </div>
      </div>

      {displayResults && nodeResult && (
        <div className="absolute top-full left-1/2 mt-1 -translate-x-1/2">
          <NodeResult result={nodeResult} nodeType={data.nodeType} />
        </div>
      )}

    </div>
  );
};

export default memo(CustomNode);
