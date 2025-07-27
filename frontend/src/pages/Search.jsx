import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiSearch, FiUser, FiX } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
import { Link } from 'react-router-dom'
const Search = ({ mode = "dark" }) => {
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/search/${query}`
      );
      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(searchUser);
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchUser]);

  const isDark = mode === "dark";

  const clearSearch = () => {
    setSearchUser("");
    setUsers([]);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Find Users</h1>
          <p className="text-gray-500">
            Search for users by name or username
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              type="text"
              placeholder="Search users..."
              className={`w-full pl-12 pr-10 py-3 rounded-lg border ${isDark
                ? "bg-gray-800 border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                : "bg-white border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                } outline-none transition-all`}
            />
            {searchUser && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <PulseLoader color={isDark ? "#34d399" : "#10b981"} size={10} />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : users.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {users.length} {users.length === 1 ? "result" : "results"} found
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user) => (
                  <Link to={`/profile?id=${user._id}`} className="cursor-pointer">
                    <div
                      key={user._id}
                      className={`rounded-xl p-4 transition-all ${isDark
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white shadow-md hover:shadow-lg"
                        }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                          <img
                            src={
                              user.avatar ||
                              `https://avatar.iran.liara.run/public/${user.followers?.length || 0
                              }`
                            }
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {user.followers?.length || 0}
                          </div>
                        </div>
                        <h3 className="font-medium text-lg mb-1">@{user.name}</h3>
                        <Link to={`/profile?id=${user._id}`} className="cursor-pointer">
                          <button
                            className={`mt-3 px-4 py-1 rounded-full text-sm font-medium transition-colors ${isDark
                              ? "bg-emerald-600 hover:bg-emerald-500"
                              : "bg-emerald-500 hover:bg-emerald-600 text-white"
                              }`}
                          >
                            View Profile
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gray-200 dark:bg-gray-700 mb-4">
                <FiUser size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-1">
                {searchUser ? "No users found" : "Search for users"}
              </h3>
              <p className="text-gray-500">
                {searchUser
                  ? "Try different search terms"
                  : "Enter a name or username to begin"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;