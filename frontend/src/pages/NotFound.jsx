import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ mode }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[94.2vh] ${mode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="text-center p-8 max-w-md">
        {/* Error Icon */}
        <div className="mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-20 w-20 mx-auto ${mode === 'dark' ? 'text-red-400' : 'text-red-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        {/* Error Message */}
        <h1 className={`text-5xl font-bold mb-4 ${mode === 'dark' ? 'text-red-400' : 'text-red-600'}`}>404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Home Button */}
        <Link
          to="/"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            mode === 'dark'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          Return Home
        </Link>
        
        {/* Additional Help */}
        <div className="mt-8 text-sm">
          <p className="mb-2">Need help?</p>
          <Link
            to="/contact"
            className={`underline ${mode === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;