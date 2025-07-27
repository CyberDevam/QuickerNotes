// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import FloatingCreateButton from '../components/FloatingCreateButton';
// import { globalNotes, IdentifyMe, likeNote, unlikeNote } from '../Routes/apiRoutes';

// const GlobalNotes = ({ mode }) => {
//   const navigate = useNavigate();
//   const [publicNotes, setPublicNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userNames, setUserNames] = useState({}); // userId -> name
//   const [searchTerm, setSearchTerm] = useState("");
//   const user = JSON.parse(localStorage.getItem("currentUser"));

//   const handleLike = async (noteId, isLiked) => {
//     if (!user) {
//       toast.error("Please login to like notes");
//       navigate('/login');
//       return;
//     }

//     try {
//       if (isLiked) {
//         await axios.post(unlikeNote, { noteId, userId: user._id });
//         setPublicNotes(prevNotes =>
//           prevNotes.map(note =>
//             note._id === noteId ? { ...note, isLiked: false, likes: note.likes.filter(id => id !== user._id) } : note
//           )
//         );
//         toast.success("Note unliked");
//       } else {
//         await axios.post(likeNote, { noteId, userId: user._id });
//         setPublicNotes(prevNotes =>
//           prevNotes.map(note =>
//             note._id === noteId ? { ...note, isLiked: true, likes: [...(note.likes || []), user._id] } : note
//           )
//         );
//         toast.success("Note liked");
//       }
//     } catch (error) {
//       console.error("Like error:", error);
//       toast.error(error.response?.data?.error || "Failed to update like status");
//     }
//   };

//   useEffect(() => {
//     const fetchPublicNotesAndUserNames = async () => {
//       try {
//         const notesResponse = await axios.get(globalNotes);
//         console.log("Fetched public notes:", notesResponse.data);
//         if (notesResponse.status === 200) {
//           const notesWithLikeStatus = notesResponse.data.map(note => ({
//             ...note,
//             isLiked: user ? note.likes?.includes(user._id) : false
//           }));
//           setPublicNotes(notesWithLikeStatus);

//           const uniqueUserIds = [...new Set(notesResponse.data.map(note => note.user?._id).filter(Boolean))];

//           const userResponses = await Promise.all(
//             uniqueUserIds.map(id =>
//               axios.get(`${IdentifyMe}${id}`)
//                 .then(res => ({
//                   id,
//                   name: res.data.name || res.data.username || 'Anonymous'
//                 }))
//                 .catch(() => ({
//                   id,
//                   name: 'Anonymous'
//                 }))
//             )
//           );

//           const userMap = {};
//           userResponses.forEach(({ id, name }) => {
//             userMap[id] = name;
//           });
//           setUserNames(userMap);
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.error || "Failed to fetch public notes");
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPublicNotesAndUserNames();
//   }, [user]); // Only re-run when the 'user' object changes

//   if (loading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   const filteredNotes = searchTerm ? publicNotes.filter(note =>
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
//   ) : publicNotes;

//   return (
//     <div style={{
//       borderTopLeftRadius: "10px",
//       borderTopRightRadius: "10px"
//     }} className={`max-h-[94.5vh] sticky h-[94.7vh] min-h-[94.8vh] py-8 ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
//       <FloatingCreateButton />
//       <div className="container mx-auto px-4">
//         <div className='items-start flex flex-col md:flex-row justify-between w-full'>
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
//           <h1 className={`text-3xl md:text-2xl gap-2 font-bold mb-8 text-center ${mode === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
//             Global Notes
//           </h1>
//         </div>

//         {publicNotes.length === 0 ? (
//           <div className={`text-center py-12 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//             <p className="text-lg">No public notes available yet.</p>
//             <p className="mt-2 text-sm opacity-75">Be the first to share a public note!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 max-h-[93vh] pt-1 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredNotes.map((note) => (
//               <motion.div
//                 key={note._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.05 * (filteredNotes.indexOf(note) % 10) }}
//                 whileHover={{ y: -5 }}
//                 className={`p-6 rounded-lg shadow-md transition-all hover:shadow-xl ${mode === 'dark' ? 'bg-gray-800' : 'bg-white hover:bg-gray-50'
//                   }`}
//               >
//                 <Link to={`/profile?id=${note.user?._id}`}>
//                   <p className={`${mode === "dark" ? "text-blue-400" : "text-blue-500"} text-lg mb-1`}>
//                     @{userNames[note.user?._id] || 'Anonymous'}
//                   </p>
//                 </Link>
//                 <h2 className={`text-xl font-semibold mb-2 ${mode === 'dark' ? 'text-green-300' : 'text-green-600'
//                   }`}>
//                   {note.title}
//                 </h2>
//                 <p className="mb-4 whitespace-pre-line">{note.content}</p>
//                 <div className="flex justify-between items-center">
//                   <div className="text-sm opacity-75">
//                     <p>CreatedAt: {new Date(note.createdAt).toLocaleDateString()}</p>
//                     <p>UpdatedAt: {new Date(note.updatedAt).toLocaleDateString()}</p>
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => handleLike(note._id, note.isLiked)}
//                     className="flex items-center gap-1 text-sm"
//                   >
//                     {note.isLiked ? (
//                       <FaHeart className="text-red-500" />
//                     ) : (
//                       <FaRegHeart className="text-gray-500 hover:text-red-500" />
//                     )}
//                     <span className="text-xs text-gray-600 dark:text-gray-400">
//                       {note.likes?.length || 0}
//                     </span>
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GlobalNotes;






import React, { useState, useEffect } from 'react';
import { Heart, Search, User, Calendar, Plus, Filter, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { globalNotes, likeNote, unlikeNote } from '../Routes/apiRoutes';


const FloatingCreateButton = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
      <Plus className="w-6 h-6" />
    </button>
  </div>
);

const GlobalNotes = ({ mode = 'light' }) => {
  const [publicNotes, setPublicNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLiked, setFilterLiked] = useState(false);
  const [error, setError] = useState(null);

  // Get user from localStorage (like in your original code)
  const user = JSON.parse(localStorage.getItem("currentUser")) ||
    { _id: '6853f294ce7df2a55150b115', name: 'CyberRish' }; // Fallback for demo

  const showToast = (message, type = 'success') => {
    // Replace with your actual toast implementation
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const handleLike = async (noteId, isLiked) => {
    if (!user) {
      showToast("Please login to like notes", 'error');
      return;
    }

    try {
      if (isLiked) {
        // Call unlike API
        await axios.post(unlikeNote, { noteId, userId: user._id });
        setPublicNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === noteId
              ? { ...note, isLiked: false, likes: note.likes.filter(id => id !== user._id) }
              : note
          )
        );
        showToast("Note unliked");
      } else {
        // Call like API
        await axios.post(likeNote, { noteId, userId: user._id });
        setPublicNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === noteId
              ? { ...note, isLiked: true, likes: [...(note.likes || []), user._id] }
              : note
          )
        );
        showToast("Note liked");
      }
    } catch (error) {
      console.error("Like error:", error);
      showToast(error.response?.data?.error || "Failed to update like status", 'error');
    }
  };

  // OPTIMIZED useEffect - no unnecessary API calls for user names
  useEffect(() => {
    const fetchPublicNotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const notesResponse = await axios.get(globalNotes);
        console.log("Fetched public notes:", notesResponse.data);

        if (notesResponse.status === 200) {
          // Since user data is already in each note, no need for separate API calls
          const notesWithLikeStatus = notesResponse.data.map(note => ({
            ...note,
            isLiked: user ? note.likes?.includes(user._id) : false
          }));

          setPublicNotes(notesWithLikeStatus);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch public notes";
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNotes();
  }, [user?._id]); // Only depend on user ID, not the whole user object

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className={`text-lg ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>Loading global notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className={`text-2xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Failed to Load Notes
        </h2>
        <p className={`text-center mb-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredNotes = publicNotes.filter(note => {
    const matchesSearch = searchTerm ?
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) : true;

    const matchesFilter = filterLiked ? note.isLiked : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div
      style={{
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px"
      }}
      className={`max-h-[94.5vh] sticky h-[94.7vh] min-h-[94.8vh] py-8 ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <FloatingCreateButton />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="items-start flex flex-col md:flex-row justify-between w-full mb-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full md:w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${mode === "dark"
                    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500"
                    : "bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-green-500 border border-gray-300"
                  }`}
              />
            </div>
            <button
              onClick={() => setFilterLiked(!filterLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${filterLiked
                  ? "bg-green-500 text-white"
                  : mode === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              <Filter className="w-4 h-4" />
              {filterLiked ? "Liked" : "All"}
            </button>
          </div>

          <h1 className={`text-3xl md:text-2xl gap-2 font-bold ${mode === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Global Notes
          </h1>
        </div>

        {/* Stats */}
        <div className={`mb-6 p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Total Notes: {publicNotes.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Showing: {filteredNotes.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Total Likes: {publicNotes.reduce((sum, note) => sum + (note.likes?.length || 0), 0)}</span>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {publicNotes.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-lg mb-2">No public notes available yet.</p>
            <p className="text-sm opacity-75">Be the first to share a public note!</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <p className="text-lg mb-2">No notes match your criteria</p>
            <p className="text-sm opacity-75">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 max-h-[93vh] pt-1 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note._id}
                className={`group p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white hover:bg-gray-50'
                  } ${note.isLiked ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
                style={{
                  animationDelay: `${(index % 10) * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                {/* Author - Using the user data directly from the note */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-medium ${mode === "dark" ? "text-blue-400" : "text-blue-600"
                    } hover:underline cursor-pointer`}>
                    @{note.user?.name || 'Anonymous'}
                  </span>
                </div>

                {/* Title */}
                <h2 className={`text-xl font-semibold mb-3 line-clamp-2 ${mode === 'dark' ? 'text-green-300' : 'text-green-600'
                  }`}>
                  {note.title}
                </h2>

                {/* Content */}
                <p className="mb-4 whitespace-pre-line text-sm leading-relaxed line-clamp-4">
                  {note.content}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col gap-1 text-xs opacity-75">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(note._id, note.isLiked)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 hover:scale-110 ${note.isLiked
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-300'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${note.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">
                      {note.likes?.length || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box !important;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GlobalNotes;