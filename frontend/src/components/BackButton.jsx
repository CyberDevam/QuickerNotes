import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = ()=>{
    navigate("/");
  }
  return (
    <div>
      <button 
      onClick={handleBack}
      className="px-3 absolute m-1 py-1 cursor-pointer text-white bg-emerald-600 hover:bg-emerald-700 transition duration-200 ease-in-out rounded-lg text-lg font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
        ⏪
      </button>
    </div>
  );
};

export default BackButton;
