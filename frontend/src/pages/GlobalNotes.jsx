import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import FloatingCreateButton from '../components/FloatingCreateButton';

const GlobalNotes = ({ mode }) => {
  const navigate = useNavigate();
  const [publicNotes, setPublicNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({}); // userId -> name
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/note/global/public');
        if (response.status === 200) {
          setPublicNotes(response.data);

          // Extract unique user IDs
          const uniqueUserIds = [
            ...new Set(response.data.map(note => note.user?._id).filter(Boolean))
          ];

          // Fetch user names in parallel
          const userResponses = await Promise.all(
            uniqueUserIds.map(id =>
              axios.get(`http://localhost:3000/auth/${id}`).then(res => ({
                id,
                name: res.data.name || res.data.username || 'Anonymous'
              })).catch(() => ({
                id,
                name: 'Anonymous'
              }))
            )
          );

          // Build userId -> name map
          const userMap = {};
          userResponses.forEach(({ id, name }) => {
            userMap[id] = name;
          });
          setUserNames(userMap);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch public notes");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNotes();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  const filteredNotes = searchTerm ? publicNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : publicNotes;
  return (
    <div className={`max-h-[94.5vh] sticky h-[94.7vh] min-h-[94.8vh] py-8 ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <FloatingCreateButton />
      <div className="container mx-auto px-4">
        <div className='flex items-start justify-between w-full'>
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full md:w-64 p-2 rounded-lg focus:outline-none focus:ring-2 ${mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500"
                : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-green-500 border border-gray-300"
                }`}
            />
          </div>
          <h1 className={`text-3xl font-bold mb-8 text-center ${mode === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Global Notes
          </h1>
        </div>

        {publicNotes.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-lg">No public notes available yet.</p>
            <p className="mt-2 text-sm opacity-75">Be the first to share a public note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 max-h-[93vh] pt-1 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className={`p-6 rounded-lg shadow-md transition-all hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800 hover:translate-y-[-3px]' : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <p className={`${mode === "dark" ? "text-blue-400" : "text-blue-500"} text-lg mb-1`}>@{userNames[note.user?._id] || 'Anonymous'}</p>
                <h2 className={`text-xl font-semibold mb-2 ${mode === 'dark' ? 'text-green-300' : 'text-green-600'
                  }`}>
                  {note.title}
                </h2>
                <p className="mb-4 whitespace-pre-line">{note.content}</p>
                <div className="text-sm opacity-75">
                  <p>CreatedAt: {new Date(note.createdAt).toLocaleDateString()}</p>
                  <p>UpdatedAt: {new Date(note.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalNotes;