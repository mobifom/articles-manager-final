// packages/frontend/src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary-700 shadow-md text-white">
      <div className="page-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Articles-Manager
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors">
              Home
            </Link>
            <Link to="/articles" className="hover:text-primary-200 transition-colors">
              Articles
            </Link>
            <Link to="/articles/new" className="hover:text-primary-200 transition-colors">
              Create Article
            </Link>
          </div>
          <div className="md:hidden">
            <button className="p-2 rounded hover:bg-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;