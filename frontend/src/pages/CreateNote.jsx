import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import BackButton from '../components/BackButton';
import { CreateRoutes } from '../Routes/apiRoutes';

const CreateNote = ({ mode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      toast.error("Login required");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(CreateRoutes, {
        title,
        content,
        user: user._id,
      });
      if (response.status === 200) {
        toast.success("Note created!");
        navigate('/');
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={`min-h-[95vh] flex justify-center items-start pt-10 ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"} px-4`}>
      <BackButton mode={mode} />
      <div className={`p-8 shadow-md rounded-xl w-full max-w-2xl ${mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
          Create a New Note
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Title
            </label>
            <input
              type="text"
              placeholder="Enter a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                mode === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400" 
                  : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Content
            </label>
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="8"
              className={`w-full rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 ${
                mode === "dark" 
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400" 
                  : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
              }`}
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md transition font-medium ${
              mode === "dark" 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;