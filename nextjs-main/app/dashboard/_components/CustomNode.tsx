"use client";

import { useState } from 'react';
import Modal from './Modal';
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

const CustomNode: FC<NodeProps<AppNode>> = ({ id, data }) => {
  const { deleteNode } = useFlowStore.getState();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  const nodeConfig = NODES.find((node) => node.type === data.nodeType);
  if (!nodeConfig) return null;

  const borderColorClass = COLOR_CLASSES.border[nodeConfig.color];
  const textColorClass = COLOR_CLASSES.text[nodeConfig.color];

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalType(data.nodeType);
    setShowModal(true);
  };

  return (
    <div
      onContextMenu={handleRightClick}
      className={`group relative bg-white border-2 rounded-lg shadow-md w-36 h-12 flex items-center justify-center px-4 ${borderColorClass}`}
    >
      
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

      {showModal && (
        <Modal
          nodeType={modalType!}
          nodeId={id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default memo(CustomNode);
