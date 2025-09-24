import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW: indicates if auth is being initialized
  const navigate = useNavigate();

  useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem('task-manager-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // auth initialization finished
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      if (response.status < 200 || response.status >= 300) {
        toast.error(response.data?.message || 'Login failed. Please try again.');
        return false;
      }

      localStorage.setItem('task-manager-user', JSON.stringify(response.data.user));
      localStorage.setItem('task-manager-token', response.data.token);
      setUser(response.data.user);

      navigate('/');
   
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', { name, email, password });

      if (response.status < 200 || response.status >= 300) {
        toast.error(response.data?.message || 'Signup failed. Please try again.');
        return false;
      }

      localStorage.setItem('task-manager-user', JSON.stringify(response.data.user));
      localStorage.setItem('task-manager-token', response.data.token);
      setUser(response.data.user);

      navigate('/');
      
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('task-manager-user');
    localStorage.removeItem('task-manager-token');
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully.');
  };

  const value = { user, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
