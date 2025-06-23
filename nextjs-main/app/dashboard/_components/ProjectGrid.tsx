// components/ProjectGrid.tsx
'use client';

import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/context/ProjectContext';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ 
  projects, 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
                <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-8 bg-gray-300 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
        <p className="font-medium">Error loading projects</p>
        <p className="text-sm">{error}</p>
        <button className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded transition-colors duration-200">
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
        <p className="mb-4">You don't have any projects yet. Create your first project to get started.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
          Create New Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;