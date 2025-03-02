// packages/frontend/src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold">
              Articles-Manager
            </Link>
            <p className="text-gray-400 mt-2">A modern platform for managing articles</p>
          </div>
          <div>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/articles" className="text-gray-300 hover:text-white transition-colors">
                Articles
              </Link>
              <Link to="/articles/new" className="text-gray-300 hover:text-white transition-colors">
                Create Article
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Articles-Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;