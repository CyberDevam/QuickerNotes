import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const Settings = ({ mode, buttonPalette, setButtonPalette }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const palettes = {
    // Professional Palettes
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
  useEffect(() => {
    localStorage.setItem("palettes", JSON.stringify({
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
    }));
  }, [])
  const navigate = useNavigate()
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate])
  const [selectedPalette, setSelectedPalette] = useState(buttonPalette || 'professional');
  // Load saved palette from localStorage on mount
  const savedPalette = localStorage.getItem('buttonPalette');
  useEffect(() => {
    const savedPalette = localStorage.getItem('buttonPalette');
    if (savedPalette && palettes[savedPalette]) {
      setSelectedPalette(savedPalette);
    }
  }, []);

  // console.log(currentUser._id);
  // console.log(savedPalette, palettes[savedPalette]);
  const handleSave = async () => {
    try {
      setButtonPalette(selectedPalette);
      const response = await axios.post(
        "http://localhost:3000/auth/palette/" + currentUser._id,
        {
          category: selectedPalette,
          palette: palettes[selectedPalette],
        }
      );

      if (response.status === 200) {
        localStorage.setItem("buttonPalette", selectedPalette);
        toast.success("Palette changed successfully");
        navigate("/");
      } else {
        toast.error("Error updating palette");
      }
    } catch (error) {
      console.error("Error saving palette:", error);
      toast.error("Failed to update palette");
    }
  };
  return (
    <div className={`p-6 min-h-[95vh] rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-6 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Button Color Themes
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(palettes).map(([key, palette]) => (
            <div
              key={key}
              onClick={() => setSelectedPalette(key)}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedPalette === key
                ? 'border-green-500 ring-2 ring-green-200'
                : mode === 'dark' ? 'border-gray-600' : 'border-gray-200'
                } ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
            >
              <h3 className={`font-medium mb-3 ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Theme
              </h3>
              <div className="flex space-x-2">
                <button className={`px-3 py-1 rounded-md text-sm text-white ${palette.view}`}>
                  View
                </button>
                <button className={`px-3 py-1 rounded-md text-sm text-white ${palette.edit}`}>
                  Edit
                </button>
                <button className={`px-3 py-1 rounded-md text-sm text-white ${palette.delete}`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
          <h3 className={`text-sm font-medium mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Live Preview
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className={`px-4 py-2 rounded-md text-white ${palettes[selectedPalette].view
              }`}>
              View Note
            </button>
            <button className={`px-4 py-2 rounded-md text-white ${palettes[selectedPalette].edit
              }`}>
              Edit Note
            </button>
            <button className={`px-4 py-2 rounded-md text-white ${palettes[selectedPalette].delete
              }`}>
              Delete Note
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`mt-6 px-4 py-2 cursor-pointer rounded-md ${mode === 'dark'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;