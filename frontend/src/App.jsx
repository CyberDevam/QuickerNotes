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

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [buttonPalette, setButtonPalette] = useState('professional');
  localStorage.setItem("buttonPalette", buttonPalette);
  const [landingAnimation, setLandingAnimation] = useState(true);
  const [mode, setMode] = useState(localStorage.getItem("mode"));
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    localStorage.setItem("mode", mode === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark", mode === "light");
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      const path = window.location.pathname;
      if (path === "/login" || path === "/register") {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLandingAnimation(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
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
            <Route path="/setting" element={<Settings mode={mode} buttonPalette={buttonPalette} setButtonPalette={setButtonPalette} />} />
            <Route path="/learnmore" element={<LearnMore mode={mode}/>} />
            <Route path="/landing" element={<LandingPage mode={mode}/>} />
            <Route path="/create" element={<CreateNote mode={mode} toggleMode={toggleMode} />} />
            <Route path="/edit" element={<EditNote mode={mode} toggleMode={toggleMode} />} />
            <Route path="/view" element={<ViewNote mode={mode} toggleMode={toggleMode} />} />
            <Route path="/profile" element={<ProfilePage mode={mode} />} />
            <Route
              path="*"
              element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>}
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
