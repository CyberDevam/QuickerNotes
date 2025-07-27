import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IdentifyMe } from '../Routes/apiRoutes';
import { FiUserPlus, FiUserMinus, FiUser } from 'react-icons/fi';
import BackButton from '../components/BackButton';

const Following = ({ mode }) => {
  const [following, setFollowing] = useState([]);
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (!user && !id) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, meResponse] = await Promise.all([
          axios.get(IdentifyMe + id),
          user?._id ? axios.get(IdentifyMe + user._id) : Promise.resolve(null)
        ]);

        const profileUser = profileResponse.data.user;
        setFollowing(profileUser.following || []);

        if (meResponse?.data?.user?.following) {
          setMyFollowingIds(meResponse.data.user.following.map(f => f._id) || []);
        }

      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load following list");
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user, id]);

  const handleFollow = async (targetId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to follow users");
      navigate('/login');
      return;
    }

    const isCurrentlyFollowing = myFollowingIds.includes(targetId);

    try {
      const endpoint = isCurrentlyFollowing
        ? `http://localhost:3000/auth/${targetId}/unfollow`
        : `http://localhost:3000/auth/${targetId}/follow`;

      await axios.post(endpoint, { currentUserId: user._id });

      setMyFollowingIds(prev => 
        isCurrentlyFollowing
          ? prev.filter(fid => fid !== targetId)
          : [...prev, targetId]
      );

      toast.success(isCurrentlyFollowing ? "Unfollowed successfully" : "Followed successfully");
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton mode={mode} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold ${mode === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Following
          </h1>
          <p className="text-sm opacity-75 mt-1">
            {following.length} {following.length === 1 ? 'person' : 'people'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : following.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <FiUser className="mx-auto h-12 w-12 opacity-50" />
            <p className="text-lg mt-4">No following to display</p>
            <p className="text-sm opacity-75 mt-2">
              {id === user?._id ? "You're not following anyone yet" : "This user isn't following anyone"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {following.map((followed) => {
                const isCurrentlyFollowing = myFollowingIds.includes(followed._id);
                const isCurrentUser = followed._id === user?._id;

                return (
                  <motion.div
                    key={followed._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -3 }}
                  >
                    <Link to={`/profile?id=${followed._id}`} className="block">
                      <div className={`rounded-xl p-4 transition-all ${mode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'}`}>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={
                                followed.avatar ||
                                `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(
                                  followed.name || "User"
                                )}`
                              }
                              alt={followed.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                            />
                            {isCurrentUser && (
                              <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-semibold truncate">{followed.name}</h2>
                            <p className="text-sm opacity-75 truncate">{followed.email}</p>
                          </div>
                          {!isCurrentUser && (
                            <motion.button
                              onClick={(e) => handleFollow(followed._id, e)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${isCurrentlyFollowing ? 'text-red-500' : 'text-green-500'}`}
                            >
                              {isCurrentlyFollowing ? (
                                <>
                                  <FiUserMinus /> 
                                  <span className="hidden sm:inline">Following</span>
                                </>
                              ) : (
                                <>
                                  <FiUserPlus /> 
                                  <span className="hidden sm:inline">Follow</span>
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;