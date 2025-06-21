"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import projectsMetadata from '@/dummy-projects/projects-metadata.json';

interface Project {
  id: string;
  name: string;
  description: string;
  type?: string;
  status?: string;
  lastModified?: string;
  thumbnail?: string;
  tags?: string[];
  stats?: {
    nodeCount?: number;
    edgeCount?: number;
    lastSimulationRun?: string | null;
  };
}

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: NewProjectData) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  loading: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data loading
    const loadProjects = async () => {
      try {
        // In a real app, you might fetch from an API here
        setProjects(projectsMetadata);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  const addProject = (newProjectData: NewProjectData) => {
    const newProject: Project = {
      id: `proj_${(projects.length + 1).toString().padStart(3, '0')}`,
      ...newProjectData,
      status: 'draft',
      lastModified: new Date().toISOString(),
      thumbnail: 'https://picsum.photos/200/300',
      stats: { nodeCount: 0, edgeCount: 0, lastSimulationRun: null },
      tags: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <ProjectsContext.Provider 
      value={{ projects, addProject, updateProject, deleteProject, loading }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

// Define NewProjectData if not already defined elsewhere
interface NewProjectData {
  name: string;
  description: string;
  type?: string;
  tags?: string[];
}