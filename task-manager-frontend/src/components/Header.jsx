import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Search } from 'lucide-react';

const Header = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortBy, setSortBy }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-white">Welcome, {user?.name}!</h1>
        
        <div className="flex flex-wrap items-center gap-4">
       
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 pl-10 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

       
     

        
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="dueDate_asc">Sort by Due Date (Asc)</option>
            <option value="dueDate_desc">Sort by Due Date (Desc)</option>
          </select>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;