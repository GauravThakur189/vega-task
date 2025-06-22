import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup, loading, setCurrentPage } = useAuth();
  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
    profileImage: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.name === 'profileImage') {
      setFormData({
        ...formData,
        profileImage: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email address';
    }
    
    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain both letters and numbers';
    }
    
    // Profile image validation
    if (formData.profileImage) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(formData.profileImage.type)) {
        newErrors.profileImage = 'Please select a JPG or PNG image file';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = new FormData();
    submitData.append('email', formData.emailId);
    submitData.append('password', formData.password);
    if (formData.profileImage) {
      submitData.append('profileImage', formData.profileImage);
    }

    const result = await signup(submitData);
    if (result.success) {
      alert(result.message);
      setCurrentPage('login');
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
        <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.emailId}
              onChange={handleChange}
            />
            {errors.emailId && <p className="text-red-500 text-sm mt-1">{errors.emailId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <p className="text-gray-500 text-sm mt-1">Must be at least 8 characters with letters and numbers</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image (JPG/PNG)</label>
            <input
              type="file"
              name="profileImage"
              accept=".jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
            />
            {errors.profileImage && <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentPage('login')}
            className="text-green-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;