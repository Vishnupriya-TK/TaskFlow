import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
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

  const handleSignup = async () => {
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

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Signup successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again later.");
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-100"
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.25 }}
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
                    : 'border-gray-200 focus:ring-green-700'
                } bg-white focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
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
                    : 'border-gray-200 focus:ring-green-700'
                } bg-white focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
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
            className="w-full px-4 py-3 text-white bg-green-700 rounded-xl hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all font-medium shadow-sm"
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
