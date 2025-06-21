"use client";

import React from 'react';

const COMPONENTS = [
  { type: 'valve', label: 'Control Valve' },
  { type: 'pump', label: 'Pump' },
  { type: 'pipe', label: 'Pipe' },
  { type: 'splitter', label: 'Splitter/Mixer' },
  { type: 'product', label: 'Product' },
  { type: 'feed', label: 'Feed' },
];

export default function CanvasSidebar() {
  // Drag start handler for React Flow
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4 h-full flex flex-col gap-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 text-blue-700">Components</h2>
      {COMPONENTS.map((comp) => (
        <div
          key={comp.type}
          onDragStart={(e) => onDragStart(e, comp.type)}
          draggable
          className="cursor-grab px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-800 font-medium shadow-sm transition"
        >
          {comp.label}
        </div>
      ))}
    </aside>
  );
}