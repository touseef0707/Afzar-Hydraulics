import React from 'react';

// Define the shape of a single project object
interface Project {
  id: number;
  name: string;
  description: string;
}

// Define the props for this component
interface Props {
  project: Project;
}

const ProjectTile: React.FC<Props> = ({ project }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-2 w-72 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
      <p className="text-gray-600">{project.description}</p>
    </div>
  );
};

export default ProjectTile;