import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { IdentifyMe } from "../Routes/apiRoutes";

const Navbar = ({ mode, toggleMode }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userName, setUserName] = useState(currentUser?.name || "");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser?._id) {
        try {
          const response = await axios.get(`${IdentifyMe}${currentUser._id}`);
          if (response.status === 200 && response.data.name) {
            setUserName(response.data.name);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          // Fallback to localStorage name if API fails
          if (currentUser?.name) {
            setUserName(currentUser.name);
          }
        }
      }
    };

    fetchUserName();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  // Mobile sidebar variants for animation
  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            ></motion.div>

            {/* Mobile Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileSidebarVariants}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className={`fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-xl md:hidden dark:bg-gray-800`}
            >
              <div className={`p-4 flex flex-col h-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-8">
                  <Link
                    to="/"
                    className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4.5V16" />
                    </svg>
                    <span className="font-bold text-xl ml-2">
                      Quicker<span>Notes</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2 rounded-full transition-colors ${mode === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col space-y-2 flex-grow">
                  {currentUser && (
                    <Link
                      to="/global"
                      className={`flex items-center p-3 rounded-lg transition-colors font-bold text-lg ${mode === 'dark' ? 'text-gray-200 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Global<span className="text-emerald-600 dark:text-emerald-400"> Section</span>
                    </Link>
                  )}

                  <Link
                    to="setting"
                    className={`flex items-center p-3 rounded-lg transition-colors ${mode === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>

                  <button
                    onClick={toggleMode}
                    className={`flex items-center cursor-pointer p-3 rounded-lg transition-colors ${mode === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {mode === "light" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      )}
                    </svg>
                    {mode === "light" ? "Dark Mode" : "Light Mode"}
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${mode === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>

                {currentUser && (
                  <div className={`mt-auto pt-4 ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                    <Link
                      to={`/profile?id=${currentUser._id}`}
                      className={`flex items-center p-3 rounded-lg transition-colors ${mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-medium mr-3 ${mode === "dark" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
                          }`}
                      >
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-medium ${mode === 'dark' ? 'text-gray-200' : ''}`}>
                          {userName}
                        </p>
                        <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {currentUser.email}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav
        className={`${mode === "dark" ? "bg-black/80" : "bg-white/80"} backdrop-blur-sm border-b border-gray-100 px-4 py-3 w-full fixed top-0 left-0 right-0 z-30 ${mode === "dark" ? "dark:bg-gray-800/80 dark:border-gray-700" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button - Only shows on mobile */}
            {currentUser && isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <svg
                  className={`w-5 h-5 ${mode === "dark" ? "text-white" : "text-gray-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <Link
              to="/"
              className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4.5V16"
                />
              </svg>
              <span className="font-bold text-xl ml-2">
                Quicker
                <span className={mode === "dark" ? "text-gray-200" : "text-gray-800"}>
                  Notes
                </span>
              </span>
            </Link>
          </div>

          {/* Global Section Link - Only shows on desktop when user is logged in */}
          {currentUser && !isMobile && (
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/global"
                className={`font-bold text-xl ${mode === "dark" ? "text-gray-100" : "text-gray-700"} text-lg relative group dark:text-gray-200`}
              >
                Global
                <span className="text-emerald-600 dark:text-emerald-400">
                  Section
                </span>
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 bottom-0 h-1 rounded bg-emerald-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  whileTap={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              </Link>
            </motion.div>
          )}

          {/* Navigation Items - Only shows on desktop */}
          {currentUser && !isMobile && (
            <div className="flex items-center space-x-4">
              <Link
                to="setting"
                className={`${mode === "dark" ? "hover:text-gray-900 bg-white" : "hover:bg-gray-100"} p-2 text-gray-600   rounded-full transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>

              <button
                onClick={toggleMode}
                className={`${mode === "dark" ? "hover:text-gray-900 bg-white" : "hover:bg-gray-100"} p-2 text-gray-600   rounded-full transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700`}
              >
                {mode === "light" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`${mode === "dark" ? "hover:text-gray-900 bg-white" : "hover:bg-gray-100"} p-2 text-gray-600   rounded-full transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>

              {/* Profile Avatar */}
              <Link
                to={`/profile?id=${currentUser._id}`}
                className="flex-shrink-0"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors ${mode === "dark"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    }`}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Add padding to the top of the main content to account for the fixed navbar */}
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;