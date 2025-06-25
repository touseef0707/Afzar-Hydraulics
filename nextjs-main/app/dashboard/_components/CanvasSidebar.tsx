// app/dashboard/_components/CanvasSidebar.tsx
"use client";

import React from 'react';
import {
  Cable,          // Represents 'Pipe'
  CircuitBoard,   // Represents 'Pump' and 'Splitter/Mixer'
  Fuel,           // Represents 'Feed'
  Package,        // Represents 'Product'
  ToyBrick,       // Represents 'Control Valve'
  GripVertical,   // The grab handle icon
} from 'lucide-react';

// The list of components that can be dragged onto the canvas.
// The `icon` property is a React element used for display only.
const COMPONENTS = [
  { type: 'valve', label: 'Control Valve', icon: <ToyBrick size={20} className="text-indigo-500" /> },
  { type: 'pump', label: 'Pump', icon: <CircuitBoard size={20} className="text-teal-500" /> },
  { type: 'pipe', label: 'Pipe', icon: <Cable size={20} className="text-orange-500" /> },
  { type: 'splitter', label: 'Splitter/Mixer', icon: <CircuitBoard size={20} className="text-purple-500" /> },
  { type: 'product', label: 'Product', icon: <Package size={20} className="text-green-500" /> },
  { type: 'feed', label: 'Feed', icon: <Fuel size={20} className="text-red-500" /> },
];

export default function CanvasSidebar() {
  /**
   * Handles the start of a drag event.
   * This function serializes only the necessary node information (`type` and `label`)
   * to avoid the "circular structure to JSON" error caused by trying to stringify React elements.
   */
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    // Create a simple, serializable object containing only the data needed by the onDrop handler.
    const nodeInfo = { type: nodeType, label: nodeLabel };
    
    // Set the data transfer payload. This is what the canvas will receive on drop.
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Components</h2>
      <div className="flex flex-col gap-3">
        {COMPONENTS.map((comp) => (
          <div
            key={comp.type}
            // Pass only the serializable strings 'type' and 'label' to the handler.
            onDragStart={(e) => onDragStart(e, comp.type, comp.label)}
            draggable
            className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {comp.icon}
              <span className="font-medium text-gray-700">{comp.label}</span>
            </div>
            <GripVertical className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        ))}
      </div>
    </aside>
  );
}
