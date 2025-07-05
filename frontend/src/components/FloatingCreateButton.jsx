import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingCreateButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/create")}
      className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
      title="Create Note"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};

export default FloatingCreateButton;
