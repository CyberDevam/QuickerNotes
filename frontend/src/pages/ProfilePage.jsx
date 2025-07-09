import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ProfilePage = ({ mode = 'light' }) => {
  let currentUser;
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [only, setOnly] = useState(false);
  const id = params.id || new URLSearchParams(window.location.search).get('id'); // support both
  // Determine color classes based on mode
  const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const inputBg = mode === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = mode === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const buttonBg = mode === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700';
  const errorBorder = mode === 'dark' ? 'border-red-500' : 'border-red-500';
  const errorText = mode === 'dark' ? 'text-red-400' : 'text-red-500';
  useEffect(() => {
    if (!user) {  // Changed from if(user)
      toast.error("Please login first");
      navigate('/login');
      return;
    }
  }, []);
  useEffect(() => {
    if (id) {
      const identifyUser = async () => {
        const currentUser = await axios.get("http://localhost:3000/auth/" + id);
        if (currentUser.data.isMe) {
          setFormData({
            name: currentUser.data.name,
            email: currentUser.data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        }
        else {
          toast.error("There is some Error");
          navigate("/");
        }
      }
      identifyUser();
    } else {
      toast.error("No note selected for editing. Redirecting...");
      navigate("/");
    }
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});


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
  const nameAndEmail = async () => {
    if (formData.name && formData.email) {
      const response = await axios.put(`http://localhost:3000/auth/profile/${formData.name}/${formData.email}`, {
        id: user._id
      });
      if (response.status == 200) {
        toast.success("Profile Updated Successfully");
        navigate("/")
      } else {
        toast.error("There is some error");
      }
    } else {
      toast.error("Name or Email is Empty");
    }
  }
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
  const avatarSize = "w-12 h-12 md:w-16 md:h-16"; // Responsive size
  const avatarText = "text-2xl md:text-3xl"; // Responsive text size
  const avatarColor = mode === 'dark'
    ? 'bg-blue-600 text-white'
    : 'bg-blue-500 text-white';
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
      const dataToLog = {
        name: formData.name,
        email: formData.email,
        isPasswordChanged: !!formData.newPassword
      };
      const response = await axios.put(`http://localhost:3000/auth/profile/${id}`, {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setFormData({
          name: '',
          email: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        navigate("/")
      } else {
        toast.error("error : " + response.data);
      }
    } else {
      toast.error("All fields Are required");
    }
  };

  return (
    <div className={`max-h-[94.6vh] min-h-[94.8vh] transition-all h-[94.6vh] ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div style={{ marginTop: "30px" }} className={`max-w-md mx-auto my-auto p-6 rounded-lg shadow-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        <div className="flex justify-center mb-6">
          <div className={`${avatarSize} ${avatarColor} rounded-full flex items-center justify-center ${avatarText} font-bold shadow-md`}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Profile Settings</h1>

        <form className='h-auto' onSubmit={handleSubmit}>
          <div className='flex gap-2'>
            <div className="mb-4">
              <label className={`block mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} ${errors.name ? 'border-red-500' : mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  } ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
              />
              {errors.name && <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className={`block mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} ${errors.email ? 'border-red-500' : mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  } ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
              />
              {errors.email && <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{errors.email}</p>}
            </div>
          </div>

          <div className="mb-4">
            <h3 className={`text-lg font-medium mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Change Password (optional)</h3>

            <div className='flex gap-3'>
              <div className="mb-3">
                <label className={`text-lg block mb-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} ${errors.currentPassword ? 'border-red-500' : mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    } ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                />
                {errors.currentPassword && <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{errors.currentPassword}</p>}
              </div>

              <div className="mb-3">
                <label className={`text-lg block mb-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} ${errors.newPassword ? 'border-red-500' : mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                    } ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                />
                {errors.newPassword && <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{errors.newPassword}</p>}
              </div>
            </div>

            <div className="mb-3">
              <label className={`block mb-1 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${mode === 'dark' ? 'bg-gray-700' : 'bg-white'} ${errors.confirmPassword ? 'border-red-500' : mode === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  } ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
              />
              {errors.confirmPassword && <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={nameAndEmail}
              type="button"
              className={`w-full h-12 text-sm py-2 px-4 ${mode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Name Or Email
            </button>
            <button
              type="submit"
              className={`w-full h-12 text-sm py-2 px-4 ${mode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;