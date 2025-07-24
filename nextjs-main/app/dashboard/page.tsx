'use client'; // Enables Client Component behavior in Next.js

import React, { useState, useMemo } from 'react';
import { useProjects } from '@/context/ProjectContext'; // Custom hook to access project data
import ProjectGrid from './_components/projects/ProjectGrid'; // Component to display projects in grid
import ProjectFilter, { FilterState } from './_components/projects/ProjectFilter'; // Filtering UI + types
import CreateProjectButton from './_components/projects//CreateProjectButton'; // Button to create a new project
import { useAuth } from '@/context/AuthContext';
 
const DashboardPage = () => {
  // Destructure data, loading, and error states from the context
  const { projects, loading, error } = useProjects();

  // Local state to manage filter options
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all',
    sortBy: 'lastModified',
    sortOrder: 'desc',
  });

  // Memoized list of unique project types for dropdown filter
  const projectTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach(project => types.add(project.type)); // Collect all unique types
    return Array.from(types); // Convert Set to Array
  }, [projects]); // Only recompute when projects change

  // Memoized filtering and sorting logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        // Filter by search term (case-insensitive)
        if (filters.search && !project.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }

        // Filter by status if it's not set to "all"
        if (filters.status !== 'all' && project.status !== filters.status) {
          return false;
        }

        // Filter by project type if it's not "all"
        if (filters.type !== 'all' && project.type !== filters.type) {
          return false;
        }

        return true; // Keep project if it passes all filters
      })
      .sort((a, b) => {
        // Sort based on selected sortBy and sortOrder
        const { sortBy, sortOrder } = filters;
        const direction = sortOrder === 'asc' ? 1 : -1; // Ascending or descending

        switch (sortBy) {
          case 'name':
            return direction * a.name.localeCompare(b.name); // Alphabetical sort
          case 'status':
            return direction * a.status.localeCompare(b.status); // Alphabetical by status
          case 'lastModified':
            return direction * (
              new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
            ); // Sort by date
          default:
            return 0; // No sorting
        }
      });
  }, [projects, filters]); // Recalculate when projects or filters change

  // Handler to update filters from child component
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const { user } = useAuth();
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <p className="text-gray-600 mt-1">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </p>
        </div>
        {/* New Project Button */}
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <CreateProjectButton />
        </div>
      </div>

      {/* Filter Bar */}
      <ProjectFilter 
        onFilterChange={handleFilterChange} 
        projectTypes={projectTypes} 
      />

      {/* Filtered Project Grid */}
      <ProjectGrid 
        projects={filteredProjects} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default DashboardPage; 
