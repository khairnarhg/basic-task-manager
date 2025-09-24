import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('task-manager-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('task-manager-users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      localStorage.setItem('task-manager-user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('task-manager-users')) || [];
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
        return false; 
    }

    const newUser = { name, email, password }; 
    users.push(newUser);
    localStorage.setItem('task-manager-users', JSON.stringify(users));
    
   
    const userData = { email: newUser.email, name: newUser.name };
    localStorage.setItem('task-manager-user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
    return true;
  };


  const logout = () => {
    localStorage.removeItem('task-manager-user');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};