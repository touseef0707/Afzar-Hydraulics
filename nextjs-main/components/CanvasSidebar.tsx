"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Boxes, Zap, Droplets, SplitSquareHorizontal, Gauge, CircleDashed } from 'lucide-react';

interface CanvasSidebarProps {
  projectName?: string;
}

const COMPONENTS = [
  { type: 'feed', label: 'Feed', icon: <Droplets className="w-4 h-4" /> },
  { type: 'product', label: 'Product', icon: <Boxes className="w-4 h-4" /> },
  { type: 'valve', label: 'Control Valve', icon: <Gauge className="w-4 h-4" /> },
  { type: 'pump', label: 'Pump', icon: <Zap className="w-4 h-4" /> },
  { type: 'splitter', label: 'Splitter/Mixer', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
  { type: 'misc', label: 'Miscellaneous', icon: <CircleDashed className="w-4 h-4" /> },
];

export default function CanvasSidebar({ projectName }: CanvasSidebarProps) {
  const pathname = usePathname();
  const match = pathname.match(/canvas\/(\w+)/);
  const projectId = match ? match[1] : '';

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 p-6 h-full flex flex-col gap-6">
      {/* Project Header */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Active Project</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{projectName || 'Untitled Project'}</h1>
            <p className="text-xs text-gray-500">ID: {projectId || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className="flex-1 space-y-4">
        <h2 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Components</h2>
        <div className="grid grid-cols-1 gap-2">
          {COMPONENTS.map((comp) => (
            <div
              key={comp.type}
              onDragStart={(e) => onDragStart(e, comp.type)}
              draggable
              className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 text-gray-700 font-medium cursor-grab transition-all hover:shadow-sm hover:border-blue-200 active:bg-blue-100 active:cursor-grabbing"
            >
              <span className="text-blue-500">{comp.icon}</span>
              <span>{comp.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Drag components onto the canvas</p>
      </div>
    </aside>
  );
}