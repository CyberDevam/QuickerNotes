// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// // import FloatingCreateButton from '../components/FloatingCreateButton';
// import { useAuth } from '../Auth/AuthContext';
// import { DeleteRoutes, EditRoutes, fetchNoteS, IdentifyMe, IdentifyUser, palette } from '../Routes/apiRoutes';
// import { motion, AnimatePresence } from 'framer-motion';

// const DEFAULT_PALETTES = {
//   professional: {
//     view: 'bg-blue-600 hover:bg-blue-700',
//     edit: 'bg-emerald-600 hover:bg-emerald-700',
//     delete: 'bg-rose-600 hover:bg-rose-700'
//   },
//   // ... (keep all your other palette definitions)
// };

// const ShowAllNotes = ({ mode }) => {
//   const { user, setUser } = useAuth();
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPalette, setSelectedPalette] = useState(DEFAULT_PALETTES.professional);
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [id, setId] = useState("");
//   const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(() => {
//     // Initialize from localStorage or default to false
//     const storedValue = localStorage.getItem("skipDeleteConfirm");
//     return storedValue ? JSON.parse(storedValue) : false;
//   });

//   // Initialize palettes in localStorage if they don't exist
//   useEffect(() => {
//     if (!localStorage.getItem("palettes")) {
//       localStorage.setItem("palettes", JSON.stringify(DEFAULT_PALETTES));
//     }
//   }, []);

//   // Fetch user's palette and name on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//         if (currentUser?._id) {
//           // Fetch user name
//           const nameResponse = await axios.get(`${IdentifyMe}${currentUser._id}`);
//           if (nameResponse.status === 200) {
//             setName(nameResponse.data.name);
//             localStorage.setItem("currentUser", JSON.stringify(nameResponse.data));
//           }

//           // Fetch palette
//           const paletteResponse = await axios.get(`${palette}${currentUser._id}`);
//           if (paletteResponse.data?.palette) {
//             setSelectedPalette(paletteResponse.data.palette);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         // Fall back to localStorage or default palette
//         const savedPalette = localStorage.getItem("buttonPalette");
//         setSelectedPalette(
//           savedPalette && DEFAULT_PALETTES[savedPalette]
//             ? DEFAULT_PALETTES[savedPalette]
//             : DEFAULT_PALETTES.professional
//         );
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Fetch user data and notes
//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");
//     if (!storedUser) {
//       navigate("/login");
//     } else {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       fetchNotes(parsedUser._id);
//     }
//   }, [navigate, setUser]);

//   const fetchNotes = async (userId) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${fetchNoteS}${userId}`);
//       const incomingNotes = Array.isArray(response.data) ? response.data : [];
//       setNotes(incomingNotes);
//     } catch (error) {
//       toast.error("Failed to fetch notes");
//       setNotes([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const changeCategory = async (id, category, title, content) => {
//     category = (category === "public") ? "private" : "public";
//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//     const response = await axios.post(EditRoutes, {
//       id,
//       title,
//       content,
//       category
//     });
//     if (response.status >= 200 && response.status < 250) {
//       fetchNotes(currentUser._id);
//     } else {
//       toast.error("There is some server issue");
//     }
//   }
//   const handleDelete = async (id) => {
//     try {
//       await axios.post(DeleteRoutes, { id });
//       toast.success("Note deleted");
//       fetchNotes(user._id);
//     } catch (error) {
//       toast.error("Error deleting note");
//     }
//   };

//   const handleDeleteClick = (noteId) => {
//     setId(noteId);
//     if (skipDeleteConfirm) {
//       handleDelete(noteId);
//     } else {
//       setIsOpen(true);
//     }
//   };

//   const toggleSkipDeleteConfirm = () => {
//     const newValue = !skipDeleteConfirm;
//     setSkipDeleteConfirm(newValue);
//     localStorage.setItem("skipDeleteConfirm", JSON.stringify(newValue));
//   };

//   const formatToIST = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true
//     });
//   };

//   const filteredNotes = notes.filter(note =>
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   let currentUser = JSON.parse(localStorage.getItem("currentUser"));

//   return (
//     <div className={` ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"}`} style={{
//       height: "min-content",
//       maxHeight: "95vh",
//       minHeight: "94.5vh",
//       overflowY: "auto",
//       overflow: "auto",
//       msOverflowStyle: "none",
//       scrollbarWidth: "none",
//       borderTopLeftRadius: "10px",
//       borderTopRightRadius: "10px"
//     }}>
//       {/* Header Section */}
//       <motion.div
//         initial={{
//           opacity: 0,
//           y: 10
//         }}
//         animate={{
//           opacity: 1,
//           y: 0
//         }}
//         transition={{
//           duration: .2
//         }}
//         className={`relative top-0 left-0 right-0 z-20 ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-md p-4`}>
//         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="w-full md:w-auto">
//             <input
//               type="text"
//               placeholder="Search notes..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full md:w-64 p-2 rounded-lg focus:outline-none focus:ring-2 ${mode === "dark"
//                 ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500"
//                 : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-green-500 border border-gray-300"
//                 }`}
//             />
//           </div>

//           {currentUser && (
//             <div className="text-center md:text-right">
//               <p className={`text-lg md:text-xl font-semibold ${mode === "dark" ? "text-gray-300" : "text-gray-700"
//                 }`}>
//                 Welcome,{" "}
//                 <span className={`font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
//                   {name.charAt(0).toUpperCase() + name.slice(1)}
//                 </span> 👋
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div
//         style={{
//           WebkitOverflowScrolling: "touch",
//           overflow: "auto",
//           scrollbarWidth: "none",
//           msOverflowStyle: "none"
//         }}
//         className="container mx-auto p-4 pb-20">
//         {/* {notes && <FloatingCreateButton />} */}

//         {loading ? (
//           <div className={`text-center mt-20 text-lg ${mode === "dark" ? "text-gray-400" : "text-gray-500"
//             }`}>
//             Loading notes...
//           </div>
//         ) : filteredNotes.length === 0 ? (
//           <div className="flex flex-col items-center justify-center mt-20">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className={`h-20 w-20 mb-4 ${mode === "dark" ? "text-gray-500" : "text-gray-300"
//                 }`}
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className={`text-xl font-semibold ${mode === "dark" ? "text-gray-300" : "text-gray-600"
//               }`}>
//               {searchTerm ? "No matching notes found" : "No notes found"}
//             </h3>
//             <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"
//               }`}>
//               {searchTerm
//                 ? "Try a different search term"
//                 : "You haven't created any notes yet."
//               }{" "}
//               <span
//                 onClick={() => navigate("/create")}
//                 className="text-green-600 font-medium cursor-pointer hover:underline"
//               >
//                 Create your first note
//               </span>
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 scroll-hide" style={{
//             height: "min-content", overflowY: "auto", maxHeight: "83vh", overflow: "auto",
//             msOverflowStyle: "none",
//             scrollbarWidth: "none"
//           }}>
//             {filteredNotes.map((note) => (
//               <div
//                 key={note._id}
//                 className={`p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between ${mode === "dark"
//                   ? "bg-gray-800 border-gray-700"
//                   : "bg-white border-gray-100"
//                   } border`}
//               >
//                 <div>
//                   <div className='flex justify-between'>
//                     <h2 className={`text-lg font-semibold mb-2 ${mode === "dark" ? "text-white" : "text-gray-800"
//                       }`}>
//                       {note.title}
//                     </h2>
//                     <div>
//                       <button
//                         onClick={() => changeCategory(note._id, note.category, note.title, note.content)}
//                         className='flex items-center gap-2 bg-emerald-200 py-3 text-emerald-700 px-3.5 rounded-md hover:scale-[1.1] transition-all'
//                       >
//                         {note.category === "public" ? (
//                           <>
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
//                               <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
//                             </svg>
//                             {/* Public */}
//                           </>
//                         ) : (
//                           <>
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
//                               <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
//                             </svg>
//                             {/* Private */}
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <p className={`text-sm whitespace-pre-line line-clamp-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"
//                     }`}>
//                     {note.content}
//                   </p>
//                 </div>

//                 <div className="mt-4">
//                   <div className="flex gap-2 mb-3">
//                     <Link
//                       to={`/view?id=${note._id}`}
//                       className={`px-3 py-1 text-xs sm:text-sm ${selectedPalette?.view || DEFAULT_PALETTES.professional.view} text-white rounded-md transition-colors`}
//                     >
//                       View
//                     </Link>
//                     <Link
//                       to={`/edit?id=${note._id}`}
//                       className={`px-3 py-1 text-xs sm:text-sm ${selectedPalette?.edit || DEFAULT_PALETTES.professional.edit} text-white rounded-md transition-colors`}
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleDeleteClick(note._id)}
//                       className={`px-3 py-1 text-xs cursor-pointer sm:text-sm ${selectedPalette?.delete || DEFAULT_PALETTES.professional.delete} text-white rounded-md transition-colors`}
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   {/* Confirmation Delete Modal */}
//                   <AnimatePresence>
//                     {isOpen && (
//                       <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
//                         <motion.div
//                           initial={{ scale: 0.9, opacity: 0 }}
//                           animate={{ scale: 1, opacity: 1 }}
//                           exit={{ scale: 0.9, opacity: 0 }}
//                           transition={{ duration: 0.2 }}
//                           style={{ maxWidth: "min-content" }}
//                           className={`p-6 rounded-lg shadow-xl w-auto max-w-sm ${mode === 'dark' ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}`}
//                         >
//                           <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
//                           <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
//                             Are you sure you want to delete this note? This action cannot be undone.
//                           </p>
//                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//                             <label className="inline-flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={skipDeleteConfirm}
//                                 onChange={toggleSkipDeleteConfirm}
//                                 className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-2"
//                               />
//                               <span className={`ml-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Don't ask me again</span>
//                             </label>

//                             <div className="flex space-x-4">
//                               <button
//                                 onClick={() => {
//                                   setIsOpen(false);
//                                   toast.error("Cancelled");
//                                 }}
//                                 className={`px-4 py-2 rounded-md font-semibold transition-colors ${mode === 'dark'
//                                   ? 'bg-gray-600 hover:bg-gray-500 text-white'
//                                   : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//                                   }`}
//                               >
//                                 Cancel
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setIsOpen(false);
//                                   handleDelete(id);
//                                 }}
//                                 className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       </div>
//                     )}
//                   </AnimatePresence>

//                   <div className={`text-xs ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
//                     <p>Created: {formatToIST(note.createdAt)}</p>
//                     <p>Updated: {formatToIST(note.updatedAt)}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowAllNotes;



import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import { DeleteRoutes, EditRoutes, fetchNoteS, IdentifyMe, IdentifyUser, palette } from '../Routes/apiRoutes';
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
  // All existing state and hooks remain the same
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
          const nameResponse = await axios.get(`${IdentifyMe}${currentUser._id}`);
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
    <div className={`min-h-screen ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm border-b ${mode === "dark" ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${mode === "dark"
                    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-green-500 border border-gray-200"
                    }`}
                />
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-sm ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Welcome back,
                  </p>
                  <p className={`font-medium ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${mode === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                  <span className={`font-medium ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-6 rounded-full ${mode === "dark" ? "bg-gray-800" : "bg-gray-100"} mb-6`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke={mode === "dark" ? "#9CA3AF" : "#6B7280"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${mode === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {searchTerm ? "No notes found" : "No notes yet"}
            </h3>
            <p className={`max-w-md mx-auto mb-6 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {searchTerm
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Get started by creating your first note."}
            </p>
            <button
              onClick={() => navigate("/create")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === "dark"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              Create Note
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-medium ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} found
              </h2>
              <button
                onClick={() => navigate("/create")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${mode === "dark"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Note
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${mode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                    } border`}
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-lg font-semibold line-clamp-2 ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                        {note.title}
                      </h3>
                      <button
                        onClick={() => changeCategory(note._id, note.category, note.title, note.content)}
                        className={`p-2 rounded-full ${mode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        aria-label={note.category === "public" ? "Make private" : "Make public"}
                      >
                        {note.category === "public" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        )}
                      </button>
                    </div>

                    <p className={`text-sm whitespace-pre-line line-clamp-4 mb-4 ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {note.content}
                    </p>

                    <div className={`text-xs ${mode === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created: {formatToIST(note.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Updated: {formatToIST(note.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-5 py-3 border-t ${mode === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50"} flex justify-between`}>
                    <div className="flex space-x-2">
                      <Link
                        to={`/view?id=${note._id}`}
                        className={`px-3 py-1 text-xs ${selectedPalette?.view || DEFAULT_PALETTES.professional.view} text-white rounded-md transition-colors flex items-center gap-1`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                      <Link
                        to={`/edit?id=${note._id}`}
                        className={`px-3 py-1 text-xs ${selectedPalette?.edit || DEFAULT_PALETTES.professional.edit} text-white rounded-md transition-colors flex items-center gap-1`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(note._id)}
                      className={`px-3 py-1 text-xs ${selectedPalette?.delete || DEFAULT_PALETTES.professional.delete} text-white rounded-md transition-colors flex items-center gap-1`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Delete Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className={`rounded-xl shadow-2xl w-full max-w-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${mode === 'dark' ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Delete Note</h3>
                </div>

                <p className={`mb-6 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Are you sure you want to delete this note? This action cannot be undone.
                </p>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipDeleteConfirm}
                      onChange={toggleSkipDeleteConfirm}
                      className={`rounded ${mode === 'dark' ? 'bg-gray-700 border-gray-600 text-green-500' : 'border-gray-300 text-green-600'} focus:ring-green-500`}
                    />
                    <span className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Don't ask me again</span>
                  </label>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        toast.error("Cancelled");
                      }}
                      className={`px-4 py-2 rounded-lg font-medium ${mode === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
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
                      className="px-4 py-2 rounded-lg font-medium bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowAllNotes;