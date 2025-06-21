"use client";

import React, { useState } from 'react';
import ProjectTile from './ProjectTile';
import NewProjectForm from './NewProjectForm';
import Popup from './Popup';
import { PlusCircle } from 'lucide-react';
import ProtectedRoute from './ProtectedRoute';
import { useProjects } from '@/context/ProjectsContext';

interface NewProjectData {
  name: string;
  description: string;
  type?: string;
  tags?: string[];
}

const Dashboard: React.FC = () => {
  const { projects, addProject, loading } = useProjects();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveProject = (newProjectData: NewProjectData) => {
    addProject(newProjectData);
    setIsPopupOpen(false);
  };

  if (loading) {  // Changed from isLoading to loading to match context
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-400 p-8 relative">
        {/* Header and Filters */}
        <div className="mb-8 flex justify-between">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">My Projects</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-gray-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredProjects.map(project => (
              <ProjectTile key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found matching your criteria</p>
          </div>
        )}

        {/* Add Project FAB */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105"
          aria-label="Add new project"
        >
          <PlusCircle className="w-8 h-8 text-white" />
        </button>

        {/* New Project Popup */}
        {isPopupOpen && (
          <Popup onClose={() => setIsPopupOpen(false)}>
            <NewProjectForm onSave={handleSaveProject} />
          </Popup>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;