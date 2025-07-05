import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import FloatingCreateButton from '../components/FloatingCreateButton';
import { useAuth } from '../Auth/AuthContext';
import { DeleteRoutes, fetchNoteS } from '../Routes/apiRoutes';

// Default palettes that will be used if none exist in localStorage
const DEFAULT_PALETTES = {
  professional: {
    view: 'bg-blue-600 hover:bg-blue-700',
    edit: 'bg-emerald-600 hover:bg-emerald-700',
    delete: 'bg-rose-600 hover:bg-rose-700'
  },
  corporate: {
    view: 'bg-indigo-600 hover:bg-indigo-700',
    edit: 'bg-slate-600 hover:bg-slate-700',
    delete: 'bg-gray-700 hover:bg-gray-800'
  },
  // Vibrant Palettes
  neon: {
    view: 'bg-pink-500 hover:bg-pink-600',
    edit: 'bg-purple-500 hover:bg-purple-600',
    delete: 'bg-cyan-400 hover:bg-cyan-500'
  },
  electric: {
    view: 'bg-yellow-400 hover:bg-yellow-500',
    edit: 'bg-green-400 hover:bg-green-500',
    delete: 'bg-red-500 hover:bg-red-600'
  },
  // Nature Palettes
  forest: {
    view: 'bg-green-700 hover:bg-green-800',
    edit: 'bg-lime-600 hover:bg-lime-700',
    delete: 'bg-amber-700 hover:bg-amber-800'
  },
  ocean: {
    view: 'bg-cyan-600 hover:bg-cyan-700',
    edit: 'bg-blue-500 hover:bg-blue-600',
    delete: 'bg-violet-600 hover:bg-violet-700'
  },
  // Earthy Palettes
  desert: {
    view: 'bg-amber-600 hover:bg-amber-700',
    edit: 'bg-orange-500 hover:bg-orange-600',
    delete: 'bg-red-700 hover:bg-red-800'
  },
  clay: {
    view: 'bg-red-600 hover:bg-red-700',
    edit: 'bg-orange-600 hover:bg-orange-700',
    delete: 'bg-yellow-600 hover:bg-yellow-700'
  },
  // Pastel Palettes
  cottonCandy: {
    view: 'bg-pink-300 hover:bg-pink-400',
    edit: 'bg-blue-300 hover:bg-blue-400',
    delete: 'bg-purple-300 hover:bg-purple-400'
  },
  mint: {
    view: 'bg-teal-300 hover:bg-teal-400',
    edit: 'bg-emerald-300 hover:bg-emerald-400',
    delete: 'bg-cyan-300 hover:bg-cyan-400'
  },
  // Dark Mode Optimized
  midnight: {
    view: 'bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600',
    edit: 'bg-violet-700 hover:bg-violet-800 dark:bg-violet-600',
    delete: 'bg-purple-700 hover:bg-purple-800 dark:bg-purple-600'
  },
  obsidian: {
    view: 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700',
    edit: 'bg-gray-700 hover:bg-gray-800 dark:bg-gray-600',
    delete: 'bg-red-700 hover:bg-red-800 dark:bg-red-600'
  }
};

const ShowAllNotes = ({ mode }) => {
  const { user, setUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Initialize palettes in localStorage if they don't exist
  if (!localStorage.getItem("palettes")) {
    localStorage.setItem("palettes", JSON.stringify(DEFAULT_PALETTES));
  }
  
  // Get button palette from localStorage or default to 'professional'
  const [buttonPalette, setButtonPalette] = useState(
    localStorage.getItem("buttonPalette") || 'professional'
  );
  
  // Parse palettes from localStorage or use default
  const palettes = JSON.parse(localStorage.getItem("palettes")) || DEFAULT_PALETTES;
  const selectedPalete = palettes[buttonPalette] || palettes.professional;

  // Rest of your component remains the same...
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchNotes(parsedUser._id);
    }
  }, [navigate, setUser]);

  // Fetch notes
  const fetchNotes = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${fetchNoteS}${userId}`);
      const incomingNotes = Array.isArray(response.data) ? response.data : [];
      setNotes(incomingNotes);
    } catch (error) {
      toast.error("Failed to fetch notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.post(DeleteRoutes, { id });
      toast.success("Note deleted");
      fetchNotes(user._id);
    } catch (error) {
      toast.error("Error deleting note");
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date to Indian time (IST)
  const formatToIST = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className={` ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"}`} style={{
      height: "min-content",
      minHeight: "94.8vh",
      overflowY: "auto",
      overflow: "auto",
      msOverflowStyle: "none",  /* IE and Edge */
      scrollbarWidth: "none"
    }}>
      {/* Header Section */}
      <div className={`sticky top-0 z-10 ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-4`}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
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

          {/* Welcome Message */}
          {currentUser && (
            <div className="text-center md:text-right">
              <p className={`text-lg md:text-xl font-semibold ${mode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                Welcome,{" "}
                <span className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {currentUser.name}
                </span> 👋
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          WebkitOverflowScrolling: "touch", // for smooth scrolling on iOS
          overflow: "auto",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none" // IE and Edge
        }}
        className="container mx-auto p-4 pb-20">
        {notes && <FloatingCreateButton />}

        {loading ? (
          <div className={`text-center mt-20 text-lg ${mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-20 w-20 mb-4 ${mode === "dark" ? "text-gray-500" : "text-gray-300"
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className={`text-xl font-semibold ${mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
              {searchTerm ? "No matching notes found" : "No notes found"}
            </h3>
            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              {searchTerm
                ? "Try a different search term"
                : "You haven't created any notes yet."
              }{" "}
              <span
                onClick={() => navigate("/create")}
                className="text-green-600 font-medium cursor-pointer hover:underline"
              >
                Create your first note
              </span>
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 scroll-hide" style={{
            height: "min-content", overflowY: "auto", maxHeight: "83vh", overflow: "auto",
            msOverflowStyle: "none",  /* IE and Edge */
            scrollbarWidth: "none"
          }}>
            {
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className={`p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between ${mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                    } border`}
                >
                  <div>
                    <h2 className={`text-lg font-semibold mb-2 ${mode === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                      {note.title}
                    </h2>
                    <p className={`text-sm whitespace-pre-line line-clamp-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2 mb-3">
                      <Link
                        to={`/view?id=${note._id}`}
                        className={`px-3 py-1 text-xs sm:text-sm ${selectedPalete.view} text-white rounded-md transition-colors`}
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit?id=${note._id}`}
                        className={`px-3 py-1 text-xs sm:text-sm ${selectedPalete.edit} text-white rounded-md transition-colors`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className={`px-3 py-1 text-xs cursor-pointer sm:text-sm ${selectedPalete.delete} text-white rounded-md transition-colors`}
                      >
                        Delete
                      </button>
                    </div>

                    <div className={`text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}>
                      <p>Created: {formatToIST(note.createdAt)}</p>
                      <p>Updated: {formatToIST(note.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllNotes;