import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSignup = () => {
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      if (!formData.username) toast.error("Username is required");
      if (!formData.email) toast.error("Email is required");
      if (!formData.password) toast.error("Password is required");
      if (!formData.confirmPassword) toast.error("Please confirm your password");
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Store user credentials
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some(user => user.email === formData.email);

    if (userExists) {
      toast.error("Email already registered");
      return;
    }

    users.push({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    localStorage.setItem("users", JSON.stringify(users));
    
    toast.success("Signup successful! Please login.");
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-8"
            variants={itemVariants}
          >
            Create Account
          </motion.h2>

          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <motion.input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.username && !formData.username 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.email && !formData.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <motion.input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.password && !formData.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <motion.input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.confirmPassword && !formData.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-green-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>

          <motion.button
            onClick={handleSignup}
            className="w-full px-4 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            Sign Up
          </motion.button>

          <motion.p 
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Login here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
