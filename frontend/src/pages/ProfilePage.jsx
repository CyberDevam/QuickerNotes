import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  IdentifyMe,
  nameAndemail,
  profile,
  fetchNoteS,
  likeNote,
  unlikeNote
} from '../Routes/apiRoutes';

const ProfilePage = ({ mode = 'light' }) => {
  const user = useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
  const navigate = useNavigate();
  const params = useParams();
  const [avatarImg, setAvatarImg] = useState("");
  const id = params.id || new URLSearchParams(window.location.search).get('id');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userChoice, setUserChoice] = useState(0);

  const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const cardBg = mode === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = mode === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const buttonBg = mode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }
    if (!id) {
      toast.error("Invalid profile ID");
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: profileData } = await axios.get(`${IdentifyMe}${id}`);
        const isCurrentUser = user._id === id;

        setFollowersCount(profileData.user?.followers?.length || 0);
        setFollowingCount(profileData.user?.following?.length || 0);
        setIsFollowing(profileData.user?.followers?.some(f => f._id === user._id) || false);
        setIsOwnProfile(isCurrentUser);

        setFormData({
          name: profileData.user?.name || '',
          email: profileData.user?.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setAvatarImg(profileData.user?.avatar || generateAvatarUrl(profileData.user?.name));

        // Pass both the profile user ID and current user ID to check for mutual follows
        const notesResponse = await axios.get(`${fetchNoteS}${id}&currentUserId=${user._id}`);
        let allNotes = [];

        if (Array.isArray(notesResponse.data)) {
          allNotes = notesResponse.data.map(note => ({
            ...note,
            isLiked: note.likes?.includes(user._id) || false
          }));

        } else if (Array.isArray(notesResponse.data.notes)) {
            allNotes = notesResponse.data.notes.map(note => ({
              ...note,
              isLiked: note.likes?.includes(user._id) || false
            }));
        }

        // The backend now handles the filtering based on mutual follows
        setNotes(allNotes);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load profile");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  const generateAvatarUrl = (name) =>
    `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(name || 'User')}`;

  const refreshAvatar = () => {
    setAvatarImg(generateAvatarUrl(formData.name));
    toast.success("Avatar refreshed!");
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      const endpoint = isFollowing
        ? `http://localhost:3000/auth/${id}/unfollow`
        : `http://localhost:3000/auth/${id}/follow`;
      await axios.post(endpoint, { currentUserId: user._id });
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleLike = async (noteId, isLiked) => {
    try {
      if (isLiked) {
        // Unlike the note
        await axios.post(unlikeNote, { noteId, userId: user._id });
        // Update the notes state
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId ? { ...note, isLiked: false, likes: note.likes.filter(id => id !== user._id) } : note
          )
        );
        toast.success("Note unliked");
      } else {
        // Like the note
        await axios.post(likeNote, { noteId, userId: user._id });
        // Update the notes state
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId ? { ...note, isLiked: true, likes: [...(note.likes || []), user._id] } : note
          )
        );
        toast.success("Note liked");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error.response?.data?.error || "Failed to update like status");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (userChoice === 1) {
      if (!formData.currentPassword) newErrors.currentPassword = 'Current password required';
      if (!formData.newPassword || formData.newPassword.length < 6)
        newErrors.newPassword = 'Password must be at least 6 characters';
      if (formData.newPassword !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (userChoice === 0) {
        // Update name and email
        await axios.put(`${nameAndemail}${formData.name}/${formData.email}`, { id: user._id });

        // Update local user data
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      } else {
        // Update password
        await axios.put(`${profile}/${user._id}`, {
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
      }} 
      className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} p-4 md:p-6`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cardBg} rounded-xl shadow-lg p-6 md:w-1/3 transition-all duration-300 hover:shadow-xl`}
        >
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={avatarImg}
                alt="Avatar"
                className="w-28 h-28 rounded-full border-2 border-blue-400 object-cover shadow-md"
                onError={(e) => (e.target.src = generateAvatarUrl('User'))}
              />
              {isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={refreshAvatar}
                  className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-md"
                >
                  🔄
                </motion.button>
              )}
            </div>

            <h1 className="text-xl font-bold mb-1 text-gray-700 dark:text-gray-200">{formData.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{formData.email}</p>

            {!isOwnProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${isFollowing ? 
                  'bg-gray-200 text-gray-800 hover:bg-gray-300' : 
                  'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {isFollowing ? "Following" : "Follow"}
              </motion.button>
            )}

            <div className="flex justify-around w-full mt-6 mb-4">
              <Link to={`/profile/followers?id=${id}`} className="transition-transform hover:scale-105">
                <div className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{followersCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                </div>
              </Link>
              <Link to={`/profile/following?id=${id}`} className="transition-transform hover:scale-105">
                <div className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{followingCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                </div>
              </Link>
            </div>

            {isOwnProfile && (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit} 
                className="w-full mt-4 space-y-3"
              >
                <select 
                  value={userChoice} 
                  onChange={(e) => setUserChoice(Number(e.target.value))} 
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                >
                  <option value={0}>Edit Profile</option>
                  <option value={1}>Change Password</option>
                </select>

                <motion.div layout className="space-y-3">
                  <input 
                    name="name" 
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none" 
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                  <input 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none" 
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                  {userChoice === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <input 
                        name="currentPassword" 
                        placeholder="Current Password" 
                        type="password" 
                        value={formData.currentPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none" 
                      />
                      {errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword}</p>}
                      
                      <input 
                        name="newPassword" 
                        placeholder="New Password" 
                        type="password" 
                        value={formData.newPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none" 
                      />
                      {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
                      
                      <input 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        type="password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none" 
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    </motion.div>
                  )}
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className={`w-full py-3 rounded-lg ${buttonBg} text-white font-medium shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  Save Changes
                </motion.button>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* Notes Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${cardBg} rounded-xl shadow-lg p-6 md:w-2/3 transition-all duration-300 hover:shadow-xl`}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">Notes</h2>
          
          {!isOwnProfile && isFollowing && notes.some(note => note.category === "private") && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800 shadow-sm"
            >
              <p className="text-sm">You can see all notes (including private) because you follow each other.</p>
            </motion.div>
          )}
          
          {notes.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              {isOwnProfile ? "You haven't created any notes yet." : "This user has no public notes."}
            </motion.p>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {notes.map((note, index) => (
                <motion.div 
                  key={note._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-5 border rounded-lg ${bgColor} shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{note.title}</h3>
                    <div className="flex items-center gap-2">
                      {note.category === "private" && (
                        <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium dark:bg-red-900 dark:text-red-200">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">{note.content}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(note._id, note.isLiked)}
                      className="flex items-center gap-1 text-sm"
                    >
                      {note.isLiked ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500 hover:text-red-500" />
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {note.likes?.length || 0}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
