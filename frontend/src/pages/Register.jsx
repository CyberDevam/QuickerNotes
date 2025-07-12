import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "../Auth/AuthContext";
import { RegisterRoutes } from "../Routes/apiRoutes";
const Register = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("currentUser") !== null) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGender("male");
    console.log(name,email,password,gender);
    if (!name || !email || !password || !gender) {
      toast.error("All Credentials Are Required");
    }
    try {
      const response = await axios.post(RegisterRoutes, {
        name,
        email,
        password,
        gender
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("currentUser", JSON.stringify({
          name: data.name,
          _id: data._id,
        }));
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
        navigate("/");
        toast.success("Registered Successfully")
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
      setEmail("");
      setName("");
      setPassword("");
    }
  };

  return (
    <div className="h-[94vh] z-0 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Register to QuickNotes
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@you.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <select className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400" value={gender} onChange={(e) => {
              setGender(e.target.value);
            }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white py-2 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
