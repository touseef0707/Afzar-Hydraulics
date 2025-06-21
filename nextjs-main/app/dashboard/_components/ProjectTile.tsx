import Link from 'next/link';
import Image from 'next/image';

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

export default function ProjectTile({ project }: { project: Project }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/dashboard/canvas/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gray-300 text-blue-600">
          {project.thumbnail ? (
            <Image 
              src={project.thumbnail} 
              alt={project.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-black">  {/* Changed from text-gray-400 to text-black */}
              No thumbnail
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {project.type || 'Uncategorized'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status || 'Unknown'}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 flex-1">{project.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-auto">
            <div>
              <span className="font-medium">Nodes: </span>
              {project.stats?.nodeCount || 0}
            </div>
            <div>
              <span className="font-medium">Edges: </span>
              {project.stats?.edgeCount || 0}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Modified: </span>
              {formatDate(project.lastModified)}
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length ? (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded text-black">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}