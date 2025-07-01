import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Add actual signup logic here
    console.log('Signup attempt:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-bg text-white rounded-t-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">GroupMirror</h1>
          <p className="opacity-90">Join our community</p>
        </div>
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create your account</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full gradient-bg text-white py-3 rounded-lg font-medium mb-4 hover:opacity-90"
            >
              Sign Up
            </button>
            <div className="text-center text-sm text-gray-600">
              Already have an account?
              <Link
                to="/"
                className="text-primary font-medium hover:underline ml-1"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 