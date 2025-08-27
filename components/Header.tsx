
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <BookOpenIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">
          University of Technology AI Assistant
        </h1>
      </div>
    </header>
  );
};

export default Header;
