"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { NODES, COLOR_CLASSES } from './flow_config';

export default function CanvasSidebar() {
  const router = useRouter();

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    const nodeInfo = { type: nodeType, label: nodeLabel };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 h-[calc(100%-0.5rem)] bg-white border-r border-gray-200 p-4 flex flex-col shadow-lg rounded-r-2xl">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer"
          title="Back to Dashboard"
        >
          <ArrowLeft size={20} className="text-gray-600 hover:text-indigo-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Components</h2>
        <div className="w-8" />
      </div>

      <div className="flex flex-col gap-3">
        {NODES.map((node) => (
          <div
            key={node.type}
            onDragStart={(e) => onDragStart(e, node.type, node.label)}
            draggable
            className={`group flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 cursor-grab transition-all duration-200 hover:shadow-md
              ${COLOR_CLASSES.bgHover[node.color]} 
              ${COLOR_CLASSES.borderHover[node.color]}`}
          >
            <div className="flex items-center gap-3">
              <span className={COLOR_CLASSES.text[node.color]}>
                {node.icon}
              </span>
              <span className="font text-gray-700">{node.label}</span>
            </div>
            <GripVertical 
              className={`text-gray-400 transition-colors ${COLOR_CLASSES.gripHover[node.color]}`} 
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
