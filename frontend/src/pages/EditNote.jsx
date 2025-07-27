// import axios from 'axios';
// import React, { useEffect, useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../Auth/AuthContext';
// import BackButton from '../components/BackButton';
// import { EditRoutes, ViewRoutes } from '../Routes/apiRoutes';

// const EditNote = ({ mode, toggleMode }) => {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const noteId = queryParams.get("id");
//   const contentTextareaRef = useRef(null);
//   const [showCaseButtons, setShowCaseButtons] = useState(false);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState("");
//   useEffect(() => {
//     if (!localStorage.getItem("currentUser")) {
//       toast.error("Login required");
//       navigate("/login");
//       return;
//     }

//     const fetchNote = async () => {
//       try {
//         const response = await axios.get(`${ViewRoutes}${noteId}`);
//         setTitle(response.data.title);
//         setContent(response.data.content);
//         setCategory(response.data.category);
//       } catch (err) {
//         toast.error("Failed to load note");
//         navigate("/");
//       }
//     };

//     if (noteId) {
//       fetchNote();
//     } else {
//       toast.error("No note selected for editing. Redirecting...");
//       navigate("/");
//     }
//   }, [navigate, noteId]);

//   const handleTextSelection = () => {
//     const textarea = contentTextareaRef.current;
//     if (textarea) {
//       const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
//       setShowCaseButtons(hasSelection);
//     }
//   };

//   const convertSelectedText = (conversionFn) => {
//     const textarea = contentTextareaRef.current;
//     if (!textarea) return;

//     const startPos = textarea.selectionStart;
//     const endPos = textarea.selectionEnd;

//     if (startPos === endPos) {
//       toast('Please select some text first', { icon: 'ℹ️' });
//       return;
//     }

//     const selectedText = content.substring(startPos, endPos);
//     const newText = content.substring(0, startPos) +
//       conversionFn(selectedText) +
//       content.substring(endPos);

//     setContent(newText);

//     // Restore selection after state update
//     setTimeout(() => {
//       textarea.setSelectionRange(startPos, endPos);
//       textarea.focus();
//     }, 0);
//   };

//   const toUppercase = () => convertSelectedText(text => text.toUpperCase());
//   const toLowercase = () => convertSelectedText(text => text.toLowerCase());

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(EditRoutes, {
//         id: noteId,
//         title,
//         content,
//         category
//       });

//       if (response.status === 200) {
//         toast.success("Note updated!");
//         navigate('/');
//       } else {
//         toast.error("Failed to update note");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div style={{
//       borderTopLeftRadius: "10px",
//       borderTopRightRadius: "10px"
//     }} className={`min-h-[95vh] flex justify-center items-start pt-10 ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"} px-4`}>
//       <BackButton mode={mode} />
//       <div className={`p-8 shadow-md rounded-xl w-full max-w-2xl ${mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
//         <h2 className={`text-3xl font-bold mb-6 text-center ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
//           Edit Note
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
//               Title
//             </label>
//             <input
//               type="text"
//               placeholder="Enter a catchy title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${mode === "dark"
//                   ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
//                   : "border border-gray-300 focus:ring-green-500"
//                 }`}
//             />
//           </div>

//           <div>
//             <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
//               Category
//             </label>
//             <select
//               value={category}
//               onChange={e => setCategory(e.target.value)}
//               className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${mode === "dark"
//                   ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
//                   : "border border-gray-300 focus:ring-green-500"
//                 }`}
//             >
//               <option value="private">Private</option>
//               <option value="public">Public</option>
//             </select>
//           </div>

//           <div className="relative">
//             <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
//               Content
//             </label>
//             {showCaseButtons && (
//               <div className="absolute right-0 top-0 flex gap-2">
//                 <button
//                   type="button"
//                   onClick={toUppercase}
//                   className={`px-2 py-1 text-xs rounded ${mode === "dark"
//                       ? "bg-gray-700 hover:bg-gray-600 text-white"
//                       : "bg-gray-200 hover:bg-gray-300 text-gray-800"
//                     }`}
//                   title="Convert to UPPERCASE"
//                 >
//                   Aa
//                 </button>
//                 <button
//                   type="button"
//                   onClick={toLowercase}
//                   className={`px-2 py-1 text-xs rounded ${mode === "dark"
//                       ? "bg-gray-700 hover:bg-gray-600 text-white"
//                       : "bg-gray-200 hover:bg-gray-300 text-gray-800"
//                     }`}
//                   title="Convert to lowercase"
//                 >
//                   aa
//                 </button>
//               </div>
//             )}
//             <textarea
//               ref={contentTextareaRef}
//               placeholder="Write your note here..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               onMouseUp={handleTextSelection}
//               onKeyUp={handleTextSelection}
//               required
//               rows="8"
//               className={`w-full rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 ${mode === "dark"
//                   ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
//                   : "border border-gray-300 focus:ring-green-500"
//                 }`}
//             ></textarea>
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-2 rounded-md transition ${mode === "dark"
//                 ? "bg-green-600 hover:bg-green-700 text-white"
//                 : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditNote;




import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import BackButton from '../components/BackButton';
import { EditRoutes, ViewRoutes } from '../Routes/apiRoutes';
import { motion, AnimatePresence } from 'framer-motion';

const EditNote = ({ mode, toggleMode }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const noteId = queryParams.get("id");
  const contentTextareaRef = useRef(null);
  const [showCaseButtons, setShowCaseButtons] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    content: false
  });

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    const fetchNote = async () => {
      try {
        const response = await axios.get(`${ViewRoutes}${noteId}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCategory(response.data.category);
      } catch (err) {
        toast.error("Failed to load note");
        navigate("/");
      }
    };

    if (noteId) {
      fetchNote();
    } else {
      toast.error("No note selected for editing. Redirecting...");
      navigate("/");
    }
  }, [navigate, noteId]);

  const handleTextSelection = () => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
      setShowCaseButtons(hasSelection);
    }
  };

  const convertSelectedText = (conversionFn) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    if (startPos === endPos) {
      toast('Please select some text first', { icon: 'ℹ️' });
      return;
    }

    const selectedText = content.substring(startPos, endPos);
    const newText = content.substring(0, startPos) +
      conversionFn(selectedText) +
      content.substring(endPos);

    setContent(newText);

    // Restore selection after state update
    setTimeout(() => {
      textarea.setSelectionRange(startPos, endPos);
      textarea.focus();
    }, 0);
  };

  const toUppercase = () => convertSelectedText(text => text.toUpperCase());
  const toLowercase = () => convertSelectedText(text => text.toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {
      title: !title.trim(),
      content: !content.trim()
    };
    
    setErrors(newErrors);

    if (newErrors.title || newErrors.content) {
      // Scroll to first error
      if (newErrors.title) {
        document.getElementById('title-input')?.focus();
      } else if (newErrors.content) {
        contentTextareaRef.current?.focus();
      }
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(EditRoutes, {
        id: noteId,
        title,
        content,
        category
      });

      if (response.status === 200) {
        toast.success("Note updated!");
        navigate('/');
      } else {
        toast.error("Failed to update note");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={`min-h-screen ${mode === "dark" ? "bg-gray-900" : "bg-gray-50"} flex flex-col items-center`}>
      <BackButton mode={mode} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-2xl mx-auto p-6 sm:p-8 my-8 rounded-xl shadow-lg ${
          mode === "dark" 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold ${
            mode === "dark" ? "text-green-400" : "text-green-600"
          }`}>
            Edit Note
          </h2>
          <div className={`text-xs px-3 py-1 rounded-full ${
            mode === "dark" 
              ? "bg-gray-700 text-green-400" 
              : "bg-green-100 text-green-800"
          }`}>
            {category === "public" ? "Public" : "Private"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={`block text-sm font-medium ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Title
              </label>
              <AnimatePresence>
                {errors.title && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-rose-500 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Title is required
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <input
              id="title-input"
              type="text"
              placeholder="What's this note about?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({...errors, title: false});
              }}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                mode === "dark"
                  ? `bg-gray-700 ${errors.title ? 'border-rose-500' : 'border-gray-600'} text-white focus:ring-green-500 focus:ring-offset-gray-800 placeholder-gray-400`
                  : `border ${errors.title ? 'border-rose-500' : 'border-gray-300'} focus:ring-green-500 focus:ring-offset-white placeholder-gray-500`
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Visibility
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:ring-offset-gray-800"
                  : "border-gray-300 focus:ring-green-500 focus:ring-offset-white"
              }`}
            >
              <option value="private">Private (Only you can see)</option>
              <option value="public">Public (Visible to others)</option>
            </select>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center">
              <label className={`block text-sm font-medium ${
                mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Content
              </label>
              <div className="flex gap-2">
                {showCaseButtons && (
                  <>
                    <button
                      type="button"
                      onClick={toUppercase}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        mode === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                      title="Convert to UPPERCASE"
                    >
                      UPPER
                    </button>
                    <button
                      type="button"
                      onClick={toLowercase}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        mode === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                      title="Convert to lowercase"
                    >
                      lower
                    </button>
                  </>
                )}
                <AnimatePresence>
                  {errors.content && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-rose-500 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Content is required
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <textarea
              id="content-textarea"
              ref={contentTextareaRef}
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors({...errors, content: false});
              }}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              rows="10"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                mode === "dark"
                  ? `bg-gray-700 ${errors.content ? 'border-rose-500' : 'border-gray-600'} text-white focus:ring-green-500 focus:ring-offset-gray-800 placeholder-gray-400`
                  : `border ${errors.content ? 'border-rose-500' : 'border-gray-300'} focus:ring-green-500 focus:ring-offset-white placeholder-gray-500`
              }`}
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              mode === "dark"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditNote;