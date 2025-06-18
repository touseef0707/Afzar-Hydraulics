// components/ProjectTile.tsx
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function ProjectTile({ project }: { project: Project }) {
  return (
    <Link href={`/dashboard/canvas/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>
    </Link>
  );
}