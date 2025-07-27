import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import { ViewRoutes } from '../Routes/apiRoutes';
import { motion } from 'framer-motion';

const ViewNote = ({ mode, toggleMode }) => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const noteId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (!noteId) {
      toast.error("Invalid note ID");
      navigate('/');
      return;
    }

    const fetchNote = async () => {
      try {
        const res = await axios.get(`${ViewRoutes}${noteId}`);
        setNote(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch note");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, navigate]);

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${mode === "dark" ? "border-green-500" : "border-green-600"}`}></div>
          <p className={`mt-4 text-lg ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>Loading your note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <BackButton mode={mode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl overflow-hidden shadow-lg ${
            mode === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          } border`}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-2">
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                mode === "dark" 
                  ? "bg-gray-700 text-green-400" 
                  : "bg-green-100 text-green-800"
              }`}>
                {note.category === "public" ? "Public Note" : "Private Note"}
              </div>
              <span className={`text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Last updated: {new Date(note.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold mt-4 mb-6 break-words ${
              mode === "dark" ? "text-green-400" : "text-green-600"
            }`}>
              {note.title}
            </h1>

            <div className={`prose max-w-none ${
              mode === "dark" ? "prose-invert" : ""
            }`}>
              <pre className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words font-sans ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`} 
                style={{ 
                  color: note.fontColor || (mode === "dark" ? '#e5e7eb' : '#111827'),
                  fontFamily: 'inherit'
                }}
              >
                {note.content}
              </pre>
            </div>
          </div>

          <div className={`px-6 py-4 border-t ${
            mode === "dark" 
              ? "border-gray-700 bg-gray-800/50" 
              : "border-gray-200 bg-gray-50"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Created on {new Date(note.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/edit?id=${note._id}`)}
                  className={`px-4 py-2 text-sm rounded-lg font-medium ${
                    mode === "dark"
                      ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } transition-colors`}
                >
                  Edit Note
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewNote;