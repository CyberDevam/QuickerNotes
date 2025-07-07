import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import { ViewRoutes } from '../Routes/apiRoutes';
import ConfirmDelete from '../components/ConfirmDelete';

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
      <div className={`min-h-[94.2vh] flex justify-center items-center ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className={`p-6 rounded-lg ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[95vh] ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <BackButton mode={mode} />
          
          <div className={`rounded-xl shadow-md p-5 sm:p-8 mt-4 ${
            mode === "dark" 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          } border`}>
            <h1 className={`text-xl sm:text-3xl font-bold mb-4 text-center sm:text-left break-words ${
              mode === "dark" ? "text-green-400" : "text-green-700"
            }`}>
              {note.title}
            </h1>
            <div className="border-t pt-4 mt-4 border-gray-300">
              <pre className={`text-base sm:text-lg leading-7 whitespace-pre-wrap break-words font-sans ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`} 
                style={{ color: note.fontColor || (mode === "dark" ? '#e5e7eb' : '#111827') }}
              >
                {note.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;