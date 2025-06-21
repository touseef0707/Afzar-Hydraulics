"use client"

import React from 'react';
import CanvasSidebar from '@/components/CanvasSidebar';
import Canvas from '@/components/Canvas';
import { useProjects } from '@/context/ProjectsContext';
import { usePathname } from 'next/navigation';

const CanvasPage = () => {
  const pathname = usePathname();
  const { projects } = useProjects();

  // Extract project ID from URL
  const match = pathname.match(/canvas\/(\w+)/);
  const projectId = match ? match[1] : '';

  // Find the project with matching ID
  const projectData = projects.find(project => project.id === projectId);

  return (
    <div className="flex flex-col max-h-screen py-5">
      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-4">
        <CanvasSidebar projectData={projectData} />
        <Canvas />
      </div>
    </div>
  );
};

export default CanvasPage;