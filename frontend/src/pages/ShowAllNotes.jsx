import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import FloatingCreateButton from '../components/FloatingCreateButton';
import { useAuth } from '../Auth/AuthContext';
import { DeleteRoutes, EditRoutes, fetchNoteS, IdentifyUser, palette } from '../Routes/apiRoutes';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PALETTES = {
  professional: {
    view: 'bg-blue-600 hover:bg-blue-700',
    edit: 'bg-emerald-600 hover:bg-emerald-700',
    delete: 'bg-rose-600 hover:bg-rose-700'
  },
  // ... (keep all your other palette definitions)
};

const ShowAllNotes = ({ mode }) => {
  const { user, setUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPalette, setSelectedPalette] = useState(DEFAULT_PALETTES.professional);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(() => {
    // Initialize from localStorage or default to false
    const storedValue = localStorage.getItem("skipDeleteConfirm");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  // Initialize palettes in localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem("palettes")) {
      localStorage.setItem("palettes", JSON.stringify(DEFAULT_PALETTES));
    }
  }, []);

  // Fetch user's palette and name on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser?._id) {
          // Fetch user name
          const nameResponse = await axios.get(`${IdentifyUser}${currentUser._id}`);
          if (nameResponse.status === 200) {
            setName(nameResponse.data.name);
            localStorage.setItem("currentUser", JSON.stringify(nameResponse.data));
          }

          // Fetch palette
          const paletteResponse = await axios.get(`${palette}${currentUser._id}`);
          if (paletteResponse.data?.palette) {
            setSelectedPalette(paletteResponse.data.palette);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fall back to localStorage or default palette
        const savedPalette = localStorage.getItem("buttonPalette");
        setSelectedPalette(
          savedPalette && DEFAULT_PALETTES[savedPalette]
            ? DEFAULT_PALETTES[savedPalette]
            : DEFAULT_PALETTES.professional
        );
      }
    };

    fetchUserData();
  }, []);

  // Fetch user data and notes
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
  const changeCategory = async (id, category, title, content) => {
    category = (category === "public") ? "private" : "public";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const response = await axios.post(EditRoutes, {
      id,
      title,
      content,
      category
    });
    if (response.status >= 200 && response.status < 250) {
      fetchNotes(currentUser._id);
    } else {
      toast.error("There is some server issue");
    }
  }
  const handleDelete = async (id) => {
    try {
      await axios.post(DeleteRoutes, { id });
      toast.success("Note deleted");
      fetchNotes(user._id);
    } catch (error) {
      toast.error("Error deleting note");
    }
  };

  const handleDeleteClick = (noteId) => {
    setId(noteId);
    if (skipDeleteConfirm) {
      handleDelete(noteId);
    } else {
      setIsOpen(true);
    }
  };

  const toggleSkipDeleteConfirm = () => {
    const newValue = !skipDeleteConfirm;
    setSkipDeleteConfirm(newValue);
    localStorage.setItem("skipDeleteConfirm", JSON.stringify(newValue));
  };

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

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className={` ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"}`} style={{
      height: "min-content",
      maxHeight: "95vh",
      minHeight: "94.5vh",
      overflowY: "auto",
      overflow: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      borderTopLeftRadius:"10px",
      borderTopRightRadius:"10px"
    }}>
      {/* Header Section */}
      <div className={`relative top-0 left-0 right-0 z-20 ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-4`}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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

          {currentUser && (
            <div className="text-center md:text-right">
              <p className={`text-lg md:text-xl font-semibold ${mode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                Welcome,{" "}
                <span className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span> 👋
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          WebkitOverflowScrolling: "touch",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
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
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}>
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className={`p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between ${mode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
                  } border`}
              >
                <div>
                  <div className='flex justify-between'>
                    <h2 className={`text-lg font-semibold mb-2 ${mode === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                      {note.title}
                    </h2>
                    <div>
                      <button
                        onClick={() => changeCategory(note._id, note.category, note.title, note.content)}
                        className='flex items-center gap-2 bg-emerald-200 py-3 text-emerald-700 px-3.5 rounded-md hover:scale-[1.1] transition-all'
                      >
                        {note.category === "public" ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                            </svg>
                            {/* Public */}
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            {/* Private */}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm whitespace-pre-line line-clamp-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                    {note.content}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex gap-2 mb-3">
                    <Link
                      to={`/view?id=${note._id}`}
                      className={`px-3 py-1 text-xs sm:text-sm ${selectedPalette?.view || DEFAULT_PALETTES.professional.view} text-white rounded-md transition-colors`}
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit?id=${note._id}`}
                      className={`px-3 py-1 text-xs sm:text-sm ${selectedPalette?.edit || DEFAULT_PALETTES.professional.edit} text-white rounded-md transition-colors`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(note._id)}
                      className={`px-3 py-1 text-xs cursor-pointer sm:text-sm ${selectedPalette?.delete || DEFAULT_PALETTES.professional.delete} text-white rounded-md transition-colors`}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Confirmation Delete Modal */}
                  <AnimatePresence>
                    {isOpen && (
                      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ maxWidth: "min-content" }}
                          className={`p-6 rounded-lg shadow-xl w-auto max-w-sm ${mode === 'dark' ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}`}
                        >
                          <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                          <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                            Are you sure you want to delete this note? This action cannot be undone.
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={skipDeleteConfirm}
                                onChange={toggleSkipDeleteConfirm}
                                className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-2"
                              />
                              <span className={`ml-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Don't ask me again</span>
                            </label>

                            <div className="flex space-x-4">
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  toast.error("Cancelled");
                                }}
                                className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === 'dark'
                                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                  }`}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  handleDelete(id);
                                }}
                                className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  <div className={`text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    <p>Created: {formatToIST(note.createdAt)}</p>
                    <p>Updated: {formatToIST(note.updatedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllNotes;