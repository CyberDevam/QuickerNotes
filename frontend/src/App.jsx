import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShowAllNotes from "./pages/ShowAllNotes";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import { Toaster } from "react-hot-toast";
import LandingAnimation from "./assets/LandingAnimation";
import ViewNote from './pages/ViewNote';
import axios from "axios";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import GlobalNotes from "./pages/GlobalNotes";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [buttonPalette, setButtonPalette] = useState('professional');
  const [landingAnimation, setLandingAnimation] = useState(true);
  const [mode, setMode] = useState("light"); // Default fallback
  const [loadingMode, setLoadingMode] = useState(true);

  // Fetch mode from backend
  const fetchMode = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/mode/${userId}`);
      if (response.data.mode) {
        setMode(response.data.mode);
        document.documentElement.classList.toggle("dark", response.data.mode === "dark");
      }
    } catch (error) {
      console.error("Error fetching mode:", error);
      // Fallback to light mode if error occurs
      setMode("light");
    } finally {
      setLoadingMode(false);
    }
  };

  // Update mode in backend
  const updateMode = async (userId, newMode) => {
    try {
      await axios.post(`http://localhost:3000/auth/mode/${userId}`, { mode: newMode });
    } catch (error) {
      console.error("Error updating mode:", error);
      // Revert UI if update fails
      setMode(prev => prev === "light" ? "dark" : "light");
      document.documentElement.classList.toggle("dark");
      throw error; // Re-throw to handle in toggleMode
    }
  };

  // Initialize user and mode
  useEffect(() => {
    const initialize = async () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        await fetchMode(parsedUser._id);
        
        // Redirect if on auth pages
        const path = window.location.pathname;
        if (path === "/login" || path === "/register") {
          navigate("/");
        }
      } else {
        setLoadingMode(false); // No user, use default mode
      }
    };

    initialize();
  }, [navigate]);

  const toggleMode = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    
    // Optimistic UI update
    setMode(newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
    
    // Update backend if user is logged in
    if (user?._id) {
      try {
        await updateMode(user._id, newMode);
      } catch (error) {
        toast.error("Failed to save theme preference");
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("buttonPalette", buttonPalette);
  }, [buttonPalette]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLandingAnimation(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loadingMode) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}>
        Loading theme...
      </div>
    );
  }

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Toaster position="left" />
      {landingAnimation ? (
        <LandingAnimation mode={mode} />
      ) : (
        <>
          <Navbar mode={mode} toggleMode={toggleMode} />
          <Routes>
            <Route path="/login" element={<Login mode={mode} toggleMode={toggleMode} />} />
            <Route path="/register" element={<Register mode={mode} toggleMode={toggleMode} />} />
            <Route path="/" element={<ShowAllNotes mode={mode} />} />
            <Route path="/setting" element={
              <Settings 
                mode={mode} 
                buttonPalette={buttonPalette} 
                setButtonPalette={setButtonPalette} 
              />
            } />
            <Route path="/learnmore" element={<LearnMore mode={mode}/>} />
            <Route path="/global" element={<GlobalNotes mode={mode}/>} />
            <Route path="/landing" element={<LandingPage mode={mode}/>} />
            <Route path="/create" element={<CreateNote mode={mode} />} />
            <Route path="/edit" element={<EditNote mode={mode} />} />
            <Route path="/view" element={<ViewNote mode={mode} />} />
            <Route path="/profile" element={<ProfilePage mode={mode} />} />
            <Route
              path="*"
              element={<NotFound/>}
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;