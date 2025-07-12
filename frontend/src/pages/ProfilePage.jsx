import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  IdentifyMe, 
  nameAndemail, 
  profile, 
  followUser, 
  unfollowUser 
} from '../Routes/apiRoutes';

const ProfilePage = ({ mode = 'light' }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const params = useParams();
  const [avatarImg, setAvatarImg] = useState("");
  const id = params.id || new URLSearchParams(window.location.search).get('id');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Theme colors
  const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const inputBg = mode === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = mode === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const buttonBg = mode === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700';
  const errorBorder = mode === 'dark' ? 'border-red-500' : 'border-red-500';
  const errorText = mode === 'dark' ? 'text-red-400' : 'text-red-500';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Avatar settings
  const avatarSize = "w-20 h-20 md:w-24 md:h-24";

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      const fetchProfileData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(IdentifyMe + id);
          const profileData = response.data;

          setIsOwnProfile(profileData.isMe);
          setFormData({
            name: profileData.name,
            email: profileData.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setAvatarImg(profileData.avatarImg || generateAvatarUrl(profileData.name));
          
          // Set follow data
          setFollowersCount(profileData.followers?.length || 0);
          setFollowingCount(profileData.following?.length || 0);
          setIsFollowing(profileData.followers?.includes(user._id) || false);
          
        } catch (error) {
          toast.error("Failed to fetch profile data");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [id, navigate, user?._id]);

  const generateAvatarUrl = (name) => {
    return `https://avatar.iran.liara.run/public/boy?username=${name || 'User'}&random=${Math.random()}`;
  };

  const refreshAvatar = () => {
    const newUrl = generateAvatarUrl(formData.name);
    setAvatarImg(newUrl);
    toast.success("Avatar refreshed!");
  };

  const handleFollow = async () => {
    try {
      setLoading(true);
      const endpoint = isFollowing ? unfollowUser : followUser;
      const response = await axios.post(endpoint, { 
        userId: id, 
        followerId: user._id 
      });

      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
        toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nameAndEmail = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.put(`${nameAndemail}${formData.name}/${formData.email}`, {
        id: user._id
      });

      if (response.status === 200) {
        toast.success("Profile Updated Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.put(`${profile}${id}`, {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const ProfileStats = () => (
    <div className="flex justify-center gap-8 mb-6">
      <Link 
        to={`/users/followers?${id}`}
        className={`text-center ${textColor}`}
      >
        <div className="font-bold text-lg">{followersCount}</div>
        <div className="text-sm">Followers</div>
      </Link>
      <Link 
        to={`/users/following?${id}`}
        className={`text-center ${textColor}`}
      >
        <div className="font-bold text-lg">{followingCount}</div>
        <div className="text-sm">Following</div>
      </Link>
    </div>
  );

  const FollowButton = () => (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );

  if (loading && !formData.name) {
    return (
      <div className={`min-h-[94.8vh] flex items-center justify-center ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-[94.8vh] ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${bgColor} ${textColor}`}>
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img
              src={avatarImg}
              alt={`${formData.name.charAt(0).toUpperCase()}`}
              className={`${avatarSize} rounded-full border-2 ${borderColor} object-cover`}
              onError={(e) => {
                e.target.src = generateAvatarUrl(formData.name?.charAt(0) || 'U');
              }}
            />
            {isOwnProfile && (
              <button
                onClick={refreshAvatar}
                className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                title="Refresh avatar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </button>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{formData.name}</h1>
          <p className="text-gray-500 mb-4">{formData.email}</p>
          
          {!isOwnProfile && <FollowButton />}
          <ProfileStats />
        </div>

        {/* Profile Settings Form (only shown on own profile) */}
        {isOwnProfile && (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Profile Settings</h2>
            <form onSubmit={handleSubmit}>
              <div className='flex gap-2'>
                <div className="mb-4 w-full">
                  <label className={`block mb-2 ${textColor}`} htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder='John Doe'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${inputBg} ${errors.name ? errorBorder : borderColor} ${textColor}`}
                  />
                  {errors.name && <p className={`text-sm mt-1 ${errorText}`}>{errors.name}</p>}
                </div>

                <div className="mb-4 w-full">
                  <label className={`block mb-2 ${textColor}`} htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='john@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${inputBg} ${errors.email ? errorBorder : borderColor} ${textColor}`}
                  />
                  {errors.email && <p className={`text-sm mt-1 ${errorText}`}>{errors.email}</p>}
                </div>
              </div>

              <div className="mb-4">
                <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Change Password (optional)</h3>

                <div className="mb-3">
                  <label className={`block mb-1 ${textColor}`} htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${inputBg} ${errors.currentPassword ? errorBorder : borderColor} ${textColor}`}
                  />
                  {errors.currentPassword && <p className={`text-sm mt-1 ${errorText}`}>{errors.currentPassword}</p>}
                </div>

                <div className="mb-3">
                  <label className={`block mb-1 ${textColor}`} htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${inputBg} ${errors.newPassword ? errorBorder : borderColor} ${textColor}`}
                  />
                  {errors.newPassword && <p className={`text-sm mt-1 ${errorText}`}>{errors.newPassword}</p>}
                </div>

                <div className="mb-3">
                  <label className={`block mb-1 ${textColor}`} htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded ${inputBg} ${errors.confirmPassword ? errorBorder : borderColor} ${textColor}`}
                  />
                  {errors.confirmPassword && <p className={`text-sm mt-1 ${errorText}`}>{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={nameAndEmail}
                  type="button"
                  disabled={loading}
                  className={`w-full h-12 py-2 px-4 text-sm ${buttonBg} text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Saving...' : 'Update Profile'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 py-2 px-4 text-sm ${buttonBg} text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;