import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  lastModified: string;
  status?: string;
  type?: string;
  createdAt?: number | string;
}

interface ProjectsPanelProps {
  projects: Project[];
  loading: boolean;
  error: string;
}

// Format date to a more readable format
const formatDate = (dateValue: string | number | undefined): string => {
  if (!dateValue) return 'N/A';
  
  const date = typeof dateValue === 'number' 
    ? new Date(dateValue) 
    : new Date(dateValue);
  
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Determine status badge color
const getStatusColor = (status?: string) => {
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

export default function ProjectsPanel({ projects, loading, error }: ProjectsPanelProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-6 rounded-lg text-center">
        <p className="text-lg font-medium">You don't have any projects yet</p>
        <p className="mt-2 text-sm">Your projects will appear here once you create them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {project.type || 'No type specified'}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                  {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
                </span>
              </div>
              
              <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                {project.description || 'No description provided'}
              </p>
              
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>
                  Created: {formatDate(project.createdAt)}
                </span>
                <span>
                  Modified: {formatDate(project.lastModified)}
                </span>
              </div>
              
              <div className="mt-4">
                <Link href={`/dashboard/canvas/${project.id}`}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200">
                    Open Project
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}