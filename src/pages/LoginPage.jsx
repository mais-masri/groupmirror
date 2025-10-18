import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser(formData.email, formData.password);
      const token = res?.data?.token ?? res?.token;
      if (!token) throw new Error('No token in response');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res?.data?.user ?? res?.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Login failed. Please try again.');
    }
  };


  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-bg text-white rounded-t-2xl p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">GroupMirror</h1>
          <p className="opacity-90">Reflect. Share. Grow Together.</p>
        </div>
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome back!</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
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
              Sign In
            </button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline ml-1"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 