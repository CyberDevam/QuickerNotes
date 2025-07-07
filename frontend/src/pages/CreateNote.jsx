// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAuth } from '../Auth/AuthContext';
// import BackButton from '../components/BackButton';
// import { CreateRoutes } from '../Routes/apiRoutes';

// const CreateNote = ({ mode }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   useEffect(() => {
//     if (!localStorage.getItem("currentUser")) {
//       toast.error("Login required");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(CreateRoutes, {
//         title,
//         content,
//         user: user._id,
//       });
//       if (response.status === 200) {
//         toast.success("Note created!");
//         navigate('/');
//       } else {
//         toast.error("Failed to create note");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };

//   return (
//     <div className={`min-h-[95vh] flex justify-center items-start pt-10 ${mode === "dark" ? "bg-gray-900" : "bg-gray-100"} px-4`}>
//       <BackButton mode={mode} />
//       <div className={`p-8 shadow-md rounded-xl w-full max-w-2xl ${mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
//         <h2 className={`text-3xl font-bold mb-6 text-center ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
//           Create a New Note
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
//               className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
//                 mode === "dark" 
//                   ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400" 
//                   : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
//               }`}
//             />
//           </div>

//           <div>
//             <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
//               Content
//             </label>
//             <textarea
//               placeholder="Write your note here..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//               rows="8"
//               className={`w-full rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 ${
//                 mode === "dark" 
//                   ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400" 
//                   : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
//               }`}
//             ></textarea>
//           </div>

//           <button
//             type="submit"
//             className={`w-full py-2 rounded-md transition font-medium ${
//               mode === "dark" 
//                 ? "bg-green-600 hover:bg-green-700 text-white" 
//                 : "bg-green-600 hover:bg-green-700 text-white"
//             }`}
//           >
//             Create Note
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNote;




import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext';
import BackButton from '../components/BackButton';
import { CreateRoutes } from '../Routes/apiRoutes';
import { useMemo } from 'react';

const CreateNote = ({ mode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCaseButtons, setShowCaseButtons] = useState(false);
  const contentTextareaRef = useRef(null);
  const [category, setCategory] = useState("private");
  const { wordCount, readingTime } = useMemo(() => {
    const trimmedContent = content.trim();
    const words = trimmedContent === "" ? [] : trimmedContent.split(/\s+/);
    return {
      wordCount: words.length,
      readingTime: Math.ceil(words.length / 200) // 200 WPM
    };
  }, [content]);
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
        category
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
              className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400"
                : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
                }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
                : "border border-gray-300 focus:ring-green-500"
                }`}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="relative">
            <label className={`block font-semibold mb-1 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Content
            </label>
            {showCaseButtons && (
              <div className="absolute right-0 top-0 flex gap-2">
                <button
                  type="button"
                  onClick={toUppercase}
                  className={`px-2 py-1 text-xs rounded ${mode === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  title="Convert to UPPERCASE"
                >
                  Aa
                </button>
                <button
                  type="button"
                  onClick={toLowercase}
                  className={`px-2 py-1 text-xs rounded ${mode === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  title="Convert to lowercase"
                >
                  aa
                </button>
              </div>
            )}

            <textarea
              ref={contentTextareaRef}
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              required
              rows="8"
              className={`w-full rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 ${mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 placeholder-gray-400"
                : "border border-gray-300 focus:ring-green-500 placeholder-gray-500"
                }`}
            ></textarea>
          </div>
          <div className='flex gap-10'>
            <h3 className='text-sm text-gray-400'>
              Word count -{"> "} {wordCount}
            </h3>
            <h3 className='text-sm text-gray-400'>
              Reading time -{"> "} {readingTime}
            </h3>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md transition font-medium ${mode === "dark"
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