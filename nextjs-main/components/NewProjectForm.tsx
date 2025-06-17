"use client";

import React, { useState } from 'react';

// Define the shape of the data this form will output
export interface NewProjectData {
  name: string;
  description: string;
  otherDetails: string;
}

// Define the props for the form component
interface Props {
  onSave: (data: NewProjectData) => void;
}

const NewProjectForm: React.FC<Props> = ({ onSave }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [otherDetails, setOtherDetails] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, otherDetails });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center mb-6">Create New Project</h2>
      {/* Form fields remain the same */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="otherDetails" className="block text-gray-700 text-sm font-bold mb-2">
          Other Details
        </label>
        <input
          type="text"
          id="otherDetails"
          value={otherDetails}
          onChange={(e) => setOtherDetails(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Project
      </button>
    </form>
  );
};

export default NewProjectForm;
