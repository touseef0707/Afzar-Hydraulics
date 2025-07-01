'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ref, onValue, off, get } from 'firebase/database';
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
      // Reference to the user's projects list
      const userProjectsRef = ref(database, `users/${user.uid}/projects`);

      // Get the user's project IDs
      const userProjectsSnapshot = await get(userProjectsRef);

      if (userProjectsSnapshot.exists()) {
        const userProjectIds = Object.keys(userProjectsSnapshot.val());

        if (userProjectIds.length === 0) {
          setProjects([]);
          return;
        }

        // Fetch each project's details
        const projectPromises = userProjectIds.map(async (projectId) => {
          const projectRef = ref(database, `projects/${projectId}`);
          const projectSnapshot = await get(projectRef);

          if (projectSnapshot.exists()) {
            return {
              id: projectId,
              ...projectSnapshot.val()
            };
          }
          return null;
        });

        const projectsData = await Promise.all(projectPromises);
        const validProjects = projectsData.filter(project => project !== null) as Project[];

        setProjects(validProjects);
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
    
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    // Reference to the user's projects list for real-time updates
    const userProjectsRef = ref(database, `users/${user.uid}/projects`);

    let isMounted = true;

    const listener = onValue(userProjectsRef, async (snapshot) => {

      if (!user) {
        off(userProjectsRef, 'value', listener);
        return;
      }

      if (!isMounted || !user) return; // Double check user exists

      if (snapshot.exists()) {
        const userProjectIds = Object.keys(snapshot.val());

        if (userProjectIds.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        try {
          // Fetch each project's details
          const projectPromises = userProjectIds.map(async (projectId) => {
            const projectRef = ref(database, `projects/${projectId}`);
            const projectSnapshot = await get(projectRef);

            if (projectSnapshot.exists()) {
              return {
                id: projectId,
                ...projectSnapshot.val()
              };
            }
            return null;
          });

          const projectsData = await Promise.all(projectPromises);
          const validProjects = projectsData.filter(project => project !== null) as Project[];

          setProjects(validProjects);
        } catch (error) {
          console.error('Error fetching project details:', error);
          setError('Failed to fetch project details.');
        }
      } else {
        setProjects([]);
      }

      setLoading(false);
    }, (error) => {
      if (!isMounted) return;
      console.error('Error in projects listener:', error);
      setError('Failed to sync with projects data.');
      setLoading(false);
    });

    return () => {
      isMounted = false;
      off(userProjectsRef, 'value', listener);
    };
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