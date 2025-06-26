"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Cable, CircuitBoard, Fuel, Package, ToyBrick, GripVertical, File,
} from 'lucide-react';

// Define allowed color types
const COLORS = ['green', 'red', 'orange', 'teal', 'indigo', 'purple', 'gray'] as const;
type Color = typeof COLORS[number];

// Type-safe node definition
type NodeType = {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: Color;
};

const NODES: NodeType[] = [
  { type: 'feed', label: 'Feed', icon: <Fuel size={20} />, color: 'red' },
  { type: 'product', label: 'Product', icon: <Package size={20} />, color: 'green' },
  { type: 'pipe', label: 'Pipe', icon: <Cable size={20} />, color: 'orange' },
  { type: 'pump', label: 'Pump', icon: <CircuitBoard size={20} />, color: 'teal' },
  { type: 'valve', label: 'Control Valve', icon: <ToyBrick size={20} />, color: 'indigo' },
  { type: 'splitter', label: 'Splitter/Mixer', icon: <CircuitBoard size={20} />, color: 'purple' },
  { type: 'misc', label: 'Misc', icon: <File size={20} />, color: 'gray' },
];

// Type-safe color classes
const COLOR_CLASSES = {
  bgHover: {
    green: 'hover:bg-green-50',
    red: 'hover:bg-red-50',
    orange: 'hover:bg-orange-50',
    teal: 'hover:bg-teal-50',
    indigo: 'hover:bg-indigo-50',
    purple: 'hover:bg-purple-50',
    gray: 'hover:bg-gray-50',
  },
  borderHover: {
    green: 'hover:border-green-400',
    red: 'hover:border-red-400',
    orange: 'hover:border-orange-400',
    teal: 'hover:border-teal-400',
    indigo: 'hover:border-indigo-400',
    purple: 'hover:border-purple-400',
    gray: 'hover:border-gray-400',
  },
  text: {
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
    teal: 'text-teal-500',
    indigo: 'text-indigo-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500',
  },
  gripHover: {
    green: 'group-hover:text-green-500',
    red: 'group-hover:text-red-500',
    orange: 'group-hover:text-orange-500',
    teal: 'group-hover:text-teal-500',
    indigo: 'group-hover:text-indigo-500',
    purple: 'group-hover:text-purple-500',
    gray: 'group-hover:text-gray-500',
  }
} as const;

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
