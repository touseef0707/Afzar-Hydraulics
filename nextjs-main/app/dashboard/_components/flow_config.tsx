import {
  Cable, CircuitBoard, Fuel, Package, ToyBrick, File,
} from 'lucide-react';

// Define allowed color types
const COLORS = ['green', 'red', 'orange', 'teal', 'indigo', 'purple', 'gray'] as const;
export type Color = typeof COLORS[number];

// Type-safe node definition
export type NodeTypeInfo = {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: Color;
};

export const NODES: NodeTypeInfo[] = [
  { type: 'feed', label: 'Feed', icon: <Fuel size={20} />, color: 'red' },
  { type: 'product', label: 'Product', icon: <Package size={20} />, color: 'green' },
  { type: 'pipe', label: 'Pipe', icon: <Cable size={20} />, color: 'orange' },
  { type: 'pump', label: 'Pump', icon: <CircuitBoard size={20} />, color: 'teal' },
  { type: 'valve', label: 'Valve', icon: <ToyBrick size={20} />, color: 'indigo' },
  { type: 'splitter', label: 'Splitter/Mixer', icon: <CircuitBoard size={20} />, color: 'purple' },
  { type: 'misc', label: 'Misc', icon: <File size={20} />, color: 'gray' },
];

export const COLOR_CLASSES = {
  border: {
    green: 'border-green-400',
    red: 'border-red-400',
    orange: 'border-orange-400',
    teal: 'border-teal-400',
    indigo: 'border-indigo-400',
    purple: 'border-purple-400',
    gray: 'border-gray-400',
  },
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
