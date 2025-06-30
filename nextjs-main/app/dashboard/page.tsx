'use client';

import React, { useState, useMemo } from 'react';
import { useProjects } from '@/context/ProjectContext';
import ProjectGrid from './_components/projects/ProjectGrid';
import ProjectFilter, { FilterState } from './_components/projects/ProjectFilter';
import CreateProjectButton from './_components/projects//CreateProjectButton';

const DashboardPage = () => {
  const { projects, loading, error } = useProjects();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all',
    sortBy: 'lastModified',
    sortOrder: 'desc',
  });

  // Extract unique project types for filter dropdown
  const projectTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach(project => types.add(project.type));
    return Array.from(types);
  }, [projects]);

  // Apply filters and sorting to projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        // Apply search filter
        if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        // Apply status filter
        if (filters.status !== 'all' && project.status !== filters.status) {
          return false;
        }
        
        // Apply type filter
        if (filters.type !== 'all' && project.type !== filters.type) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        const { sortBy, sortOrder } = filters;
        const direction = sortOrder === 'asc' ? 1 : -1;
        
        switch (sortBy) {
          case 'name':
            return direction * a.name.localeCompare(b.name);
          case 'status':
            return direction * a.status.localeCompare(b.status);
          case 'lastModified':
            return direction * (new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
          default:
            return 0;
        }
      });
  }, [projects, filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <CreateProjectButton />
        </div>
      </div>
      
      <ProjectFilter 
        onFilterChange={handleFilterChange} 
        projectTypes={projectTypes} 
      />
      
      <ProjectGrid 
        projects={filteredProjects} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default DashboardPage;
