'use client';

import React, { useState } from 'react';

interface ProjectFilterProps {
  onFilterChange: (filters: FilterState) => void;
  projectTypes: string[];
}

export interface FilterState {
  search: string;
  status: string;
  type: string;
  sortBy: 'name' | 'lastModified' | 'status';
  sortOrder: 'asc' | 'desc';
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ onFilterChange, projectTypes }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    type: 'all',
    sortBy: 'lastModified',
    sortOrder: 'desc',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const [sortBy, sortOrder] = value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
    
    const newFilters = { ...filters, sortBy, sortOrder };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        {/* Search Input */}
        <div className="flex-grow min-w-[200px] max-w-xs">
          {/* <label htmlFor="search" className="block text-xs font-medium text-black mb-1">Search</label> */}
          <input
            type="text"
            id="search"
            placeholder="Search projects..."
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-black text-sm"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="flex items-end gap-2">

        {/* Status Filter */}
        <div className="w-auto">
          {/* <label htmlFor="status" className="block text-xs font-medium text-black mb-1">Status</label> */}
          <select
            id="status"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-black text-sm hover:cursor-pointer"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option className='hover:cursor-pointer' value="all">All Statuses</option>
            <option className='hover:cursor-pointer' value="active">Active</option>
            <option className='hover:cursor-pointer' value="draft">Draft</option>
            <option className='hover:cursor-pointer' value="archived">Archived</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="w-auto">
          {/* <label htmlFor="type" className="block text-xs font-medium text-black mb-1">Type</label> */}
          <select
            id="type"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-black text-sm hover:cursor-pointer"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>{type.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="w-auto">
          {/* <label htmlFor="sort" className="block text-xs font-medium text-black mb-1">Sort By</label> */}
          <select
            id="sort"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-black text-sm hover:cursor-pointer"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
          >
            <option className='hover:cursor-pointer' value="name-asc">Name (A-Z)</option>
            <option className='hover:cursor-pointer' value="name-desc">Name (Z-A)</option>
            <option className='hover:cursor-pointer' value="lastModified-desc">Newest</option>
            <option className='hover:cursor-pointer' value="lastModified-asc">Oldest</option>
            <option className='hover:cursor-pointer' value="status-asc">Status (A-Z)</option>
            <option className='hover:cursor-pointer' value="status-desc">Status (Z-A)</option>
          </select>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;