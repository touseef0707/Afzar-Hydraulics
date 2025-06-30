'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, useProjects } from '@/context/ProjectContext';
import { ref, remove } from 'firebase/database';
import { database } from '@/firebase/clientApp';
import { Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

// Format date to a more readable format
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchProjects } = useProjects();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDelete = async () => {
    if (!project.id) return;
    
    setIsDeleting(true);
    try {
      const projectRef = ref(database, `projects/${project.id}`);
      await remove(projectRef);

      const flowId = project.id.replace(/^-/, '')
      const flowRef = ref(database, `flows/fid_${flowId}`);
      await remove(flowRef);

      // Remove the project reference from the user's projects list
      if (user) {
        const userProjectRef = ref(database, `users/${user.uid}/projects/${project.id}`);
        await remove(userProjectRef);
      }

      showToast("Project deleted successfully", "success");
      fetchProjects();

    } catch (error) {
      console.log(error);
      showToast("Error deleting project. Please try again", "error");

    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project Thumbnail */}
      <div className="relative h-40 bg-gray-200">
        <img 
          src={project.thumbnail || '/images/default-project.jpg'} 
          alt={`${project.name} thumbnail`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = '/images/default-project.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Project Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{project.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        
        {/* Project Metadata */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Project Stats */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>Nodes: {project.stats.nodeCount}</span>
          <span>Edges: {project.stats.edgeCount}</span>
          <span>Modified: {formatDate(project.lastModified)}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/dashboard/canvas/${project.id}`} className="flex-grow">
            <button className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white py-2 rounded-md transition-colors duration-200">
              Open Project
            </button>
          </Link>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white p-2 rounded-md transition-colors duration-200"
            aria-label="Delete project"
          >
            <Trash />
          </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Project</h3>
              <p className="text-gray-700 mb-6">Are you sure you want to delete <span className="font-semibold">{project.name}</span>? This action cannot be undone.</p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium hover:cursor-pointer"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium flex items-center gap-2 hover:cursor-pointer"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;