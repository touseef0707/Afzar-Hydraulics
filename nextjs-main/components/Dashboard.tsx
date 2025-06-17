"use client";

import React, { useState } from 'react';
import ProjectTile from './ProjectTile';
import NewProjectForm, { NewProjectData } from './NewProjectForm';
import Popup from './Popup';
import { PlusCircle } from 'lucide-react'; // Using Lucide React icons

interface Project {
  id: number;
  name: string;
  description: string;
  otherDetails?: string;
}

const initialProjects: Project[] = [
  { id: 1, name: 'Project Alpha', description: 'This is the first project.' },
  { id: 2, name: 'Project Beta', description: 'This is the second project.' },
  { id: 3, name: 'Project Gamma', description: 'This is the third project.' },
  { id: 4, name: 'Project Delta', description: 'This is the fourth project.' },
  { id: 5, name: 'Project Epsilon', description: 'This is the fifth project.' },
  { id: 6, name: 'Project Zeta', description: 'This is the sixth project.' },
  { id: 7, name: 'Project Eta', description: 'This is the seventh project.' },
  { id: 8, name: 'Project Theta', description: 'This is the eighth project.' },
  { id: 9, name: 'Project Iota', description: 'This is the ninth project.' },
  { id: 10, name: 'Project Kappa', description: 'This is the tenth project.' },
];

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleSaveProject = (newProjectData: NewProjectData) => {
    const newProject: Project = {
      id: projects.length + 1,
      ...newProjectData,
    };
    setProjects([...projects, newProject]);
    handleClosePopup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 relative">
      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleOpenPopup}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Add new project"
      >
        <PlusCircle className="w-8 h-8 text-white" />
      </button>

      {/* Projects grid with padding to avoid overlap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {projects.map(project => (
          <ProjectTile key={project.id} project={project} />
        ))}
      </div>

      {isPopupOpen && (
        <Popup onClose={handleClosePopup}>
          <NewProjectForm onSave={handleSaveProject} />
        </Popup>
      )}
    </div>
  );
};

export default Dashboard;