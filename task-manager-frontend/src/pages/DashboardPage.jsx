import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import AddTaskModal from '../components/AddTaskModal';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const DashboardPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate_asc');

   useEffect(() => {
    const fetchTasks = async () => {
        try {
        const token = localStorage.getItem("task-manager-token");

        if (!token) {
            console.warn("No auth token found.");
            return;
        }

        const response = await axios.get("https://basic-task-manager-0t1x.onrender.com/api/tasks", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        console.log("Fetched tasks:", response.data);

        const mappedTasks = response.data.map(task => ({
          id: task.tid,
          title: task.tname,
          description: task.tdesc,
          status: task.status,
          dueDate: task.dueDate,
        }));

        setTasks(mappedTasks);
        } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error(error.response?.data?.message || "Failed to fetch tasks.");
        }
    };

    fetchTasks();
    }, [user.email]);

   
     const handleSaveTask = async (task) => {
    const token = localStorage.getItem("task-manager-token");
    try {
      if (task.id) {
   
        await axios.put(`https://basic-task-manager-0t1x.onrender.com/api/tasks/${task.id}`, {
          tname: task.title,
          tdesc: task.description,
          status: task.status,
          dueDate: task.dueDate
        }, { headers: { Authorization: `Bearer ${token}` }});

        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
        toast.success("Task updated successfully!");
      } else {
        
        const response = await axios.post("https://basic-task-manager-0t1x.onrender.com/api/tasks", {
          tname: task.title,
          tdesc: task.description,
          status: task.status,
          dueDate: task.dueDate
        }, { headers: { Authorization: `Bearer ${token}` }});

        const newTask = {
          id: response.data.tid,
          title: response.data.tname,
          description: response.data.tdesc,
          status: response.data.status,
          dueDate: response.data.dueDate
        };

        setTasks(prev => [...prev, newTask]);
        toast.success("Task added successfully!");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Failed to save task.");
    } finally {
      setIsModalOpen(false);
      setTaskToEdit(null);
    }
  };


  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("task-manager-token");
    try {
      await axios.delete(`https://basic-task-manager-0t1x.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };

 
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem("task-manager-token");
    try {
      const task = tasks.find(t => t.id === taskId);
      await axios.put(`https://basic-task-manager-0t1x.onrender.com/api/tasks/${taskId}`, {
        tname: task.title,
        tdesc: task.description,
        status: newStatus,
        dueDate: task.dueDate
      }, { headers: { Authorization: `Bearer ${token}` }});

      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };


    const filteredAndSortedTasks = useMemo(() => {
        return tasks
            .filter(task => {
                const searchLower = searchTerm.toLowerCase();
                return task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower);
            })
            .sort((a, b) => { 
                if (sortBy === 'dueDate_asc') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else {
                    return new Date(b.dueDate) - new Date(a.dueDate);
                }
            });
    }, [tasks, searchTerm, sortBy]);


    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Your Tasks</h1>
                    <button
                        onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        <Plus size={20} /> Add Task
                    </button>
                </div>
                <KanbanBoard 
                    tasks={filteredAndSortedTasks} 
                    setTasks={setTasks}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateStatus={handleUpdateTaskStatus}
                />
            </main>
            {isModalOpen && (
                <AddTaskModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
                    onSave={handleSaveTask}
                    taskToEdit={taskToEdit}
                />
            )}
        </div>
    );
};

export default DashboardPage;