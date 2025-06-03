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

  const handleLogin = () => {
    setTouched({
      email: true,
      password: true
    });

    if (!formData.email || !formData.password) {
      if (!formData.email) toast.error("Email is required");
      if (!formData.password) toast.error("Password is required");
      return;
    }

    // Check credentials
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      toast.success(`Welcome back, ${user.username}!`);
      setAuth({ email: user.email, username: user.username });
    } else {
      toast.error("Invalid email or password");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-90 to-white px-4">
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
                    : 'border-gray-200 focus:ring-blue-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
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
                    : 'border-gray-200 focus:ring-blue-500'
                } bg-gray-50 focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>

          <motion.button
            onClick={handleLogin}
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
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
