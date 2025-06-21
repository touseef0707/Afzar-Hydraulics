"use client";

import React from 'react';
import { Boxes, Zap, Droplets, SplitSquareHorizontal, Gauge, CircleDashed } from 'lucide-react';

interface CanvasSidebarProps {
  projectData?: {
    id: string;
    name: string;
    description?: string;
  };
}

const COMPONENTS = [
  { type: 'feed', label: 'Feed', icon: <Droplets className="w-4 h-4" /> },
  { type: 'product', label: 'Product', icon: <Boxes className="w-4 h-4" /> },
  { type: 'valve', label: 'Valve', icon: <Gauge className="w-4 h-4" /> },
  { type: 'pump', label: 'Pump', icon: <Zap className="w-4 h-4" /> },
  { type: 'splitter', label: 'Splitter', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
  { type: 'misc', label: 'Other', icon: <CircleDashed className="w-4 h-4" /> },
];

export default function CanvasSidebar({ projectData }: CanvasSidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    // Include position and dimensions in the drag data
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      label,
      width: 120,  // Default width
      height: 80,  // Default height
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">{/* Project Header */}
      
      <div className="p-4 space-y-1 border-b border-gray-100">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project</h2>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-500">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
              {projectData?.name || 'Untitled'}
            </h1>
            <p className="text-[10px] text-gray-400">#{projectData?.id || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Components Section - Scrollable if needed */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Components</h2>
        <div className="grid grid-cols-1 gap-1">
        {COMPONENTS.map((comp) => (
        <div
          key={comp.type}
          onDragStart={(e) => onDragStart(e, comp.type, comp.label)}
          draggable
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-md border border-gray-100 text-gray-700 text-sm cursor-grab transition-colors"
        >
          <span className="text-blue-500">{comp.icon}</span>
          <span className="truncate">{comp.label}</span>
        </div>
      ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 text-[10px] text-gray-400">
        Drag items to canvas
      </div>
    </aside>
  );
}