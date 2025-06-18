import React from 'react';
import CanvasSidebar from '@/components/CanvasSidebar';
import Canvas from '@/components/Canvas';

interface CanvasPageProps {
  params: { id: string };
}

const CanvasPage = async ({ params }: CanvasPageProps) => {
  const { id } = await params;
  return (
    <div className="flex flex-col min-h-screen py-10">
      <div className="px-8 mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Project Canvas</h1>
        <p className="text-lg text-gray-700">Project ID: <span className="font-mono text-blue-600">{id}</span></p>
      </div>
      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-4">
        <CanvasSidebar />
        <Canvas />
      </div>
    </div>
  );
};

export default CanvasPage;
