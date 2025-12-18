import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
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

  const validateField = (field) => {
    if (touched[field] && !formData[field]) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (field === 'email' && touched.email && !formData.email.includes('@')) {
      return 'Please enter a valid email';
    }
    return '';
  };

  const handleLogin = async () => {
    setTouched({
      email: true,
      password: true
    });

    if (!formData.email || !formData.password) {
      if (!formData.email) toast.error("Email is required");
      if (!formData.password) toast.error("Password is required");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Welcome back, ${data.user.username}!`);
        setAuth({ email: data.user.email, username: data.user.username });
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again later.");
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
          className="bg-white rounded-2xl shadow-sm p-8 space-y-6 border border-gray-100"
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.25 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-8"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h2>

          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.email && !formData.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-blue-700'
                } bg-white focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <motion.input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  touched.password && !formData.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-blue-700'
                } bg-white focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              />
            </div>
          </motion.div>

          <motion.button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-white bg-blue-700 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 transition-all font-medium shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            Login
          </motion.button>

          <motion.p 
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
