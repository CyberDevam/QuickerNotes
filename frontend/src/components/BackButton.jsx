import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BackButton = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/");
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-4 z-10"
    >
      <button 
        onClick={handleBack}
        className="group relative flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
      >
        <span className="absolute left-0 flex items-center justify-center w-8 h-full transition-all duration-300 transform group-hover:translate-x-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
        <span className="pl-6 pr-2 font-medium tracking-wide transition-all duration-300 transform group-hover:translate-x-1">
          Back
        </span>
      </button>
    </motion.div>
  );
};

export default BackButton;