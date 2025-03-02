// packages/frontend/src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container py-16 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;