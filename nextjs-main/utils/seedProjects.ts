// utils/seedProjects.ts
// This utility function helps seed the Firebase database with dummy project data for testing

import { ref, set, get } from 'firebase/database';
import { database } from '@/firebase/clientApp';

// Import dummy project data
import projectsData from '@/dummy-projects/projects-metadata.json';

/**
 * Seeds the Firebase database with dummy project data
 * This function should only be used during development
 */
export const seedProjects = async (userId: string) => {
  try {
    // Create a reference to the projects collection
    const projectsRef = ref(database, 'projects');
    
    // Create an object to store projects with their IDs as keys
    const projectsObject: Record<string, any> = {};
    
    // Process each project and add it to the object
    projectsData.forEach((project) => {
      // Assign the current user as the creator
      const modifiedProject = {
        ...project,
        createdBy: userId,
      };
      
      // Use the project ID as the key
      projectsObject[project.id] = modifiedProject;
    });
    
    // Set the projects in Firebase
    await set(projectsRef, projectsObject);
    
    console.log('Projects seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding projects:', error);
    return false;
  }
};

/**
 * Checks if projects already exist in the database
 * Returns true if projects exist, false otherwise
 */
export const checkProjectsExist = async () => {
  try {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    return snapshot.exists() && Object.keys(snapshot.val()).length > 0;
  } catch (error) {
    console.error('Error checking projects:', error);
    return false;
  }
};