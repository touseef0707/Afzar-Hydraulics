// context/ProjectContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ref, onValue, off, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@/firebase/clientApp';
import { useAuth } from './AuthContext';

// Define the Project type based on the dummy data structure
export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  lastModified: string;
  createdBy: string;
  tags: string[];
  stats: {
    nodeCount: number;
    edgeCount: number;
    lastSimulationRun: string | null;
  };
  thumbnail: string;
}

type ProjectContextType = {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Reference to the projects collection in Firebase
      const projectsRef = ref(database, 'projects');
      
      // Query projects created by the current user
      const userProjectsQuery = query(projectsRef, orderByChild('createdBy'), equalTo(user.uid));
      
      // Get projects data
      const snapshot = await get(userProjectsQuery);
      
      if (snapshot.exists()) {
        const projectsData = snapshot.val();
        const projectsArray: Project[] = Object.keys(projectsData).map(key => ({
          id: key,
          ...projectsData[key]
        }));
        
        setProjects(projectsArray);
      } else {
        // If no projects exist yet, set empty array
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Set up listener for real-time updates when user is authenticated
  useEffect(() => {
    if (user) {
      const projectsRef = ref(database, 'projects');
      
      // Query projects created by the current user for real-time updates
      const userProjectsQuery = query(projectsRef, orderByChild('createdBy'), equalTo(user.uid));
      
      const listener = onValue(userProjectsQuery, (snapshot) => {
        if (snapshot.exists()) {
          const projectsData = snapshot.val();
          const projectsArray: Project[] = Object.keys(projectsData).map(key => ({
            id: key,
            ...projectsData[key]
          }));
          
          setProjects(projectsArray);
        } else {
          setProjects([]);
        }
        
        setLoading(false);
      }, (error) => {
        console.error('Error in projects listener:', error);
        setError('Failed to sync with projects data.');
        setLoading(false);
      });

      // Clean up listener on unmount
      return () => off(userProjectsQuery, 'value', listener);
    } else {
      // If user is not authenticated, clear projects
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, error, fetchProjects, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}