import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import AddTaskModal from '../components/AddTaskModal';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate_asc');

   
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || [];
        setTasks(storedTasks);
    }, [user.email]);

   
    const saveTasks = (newTasks) => {
        setTasks(newTasks);
        localStorage.setItem(`tasks_${user.email}`, JSON.stringify(newTasks));
    };
    
  
    const handleSaveTask = (task) => {
        let newTasks;
        if (task.id) { 
            newTasks = tasks.map(t => t.id === task.id ? task : t);
            toast.success('Task updated successfully!');
        } else { 
            newTasks = [...tasks, { ...task, id: Date.now() }];
             toast.success('Task added successfully!');
        }
        saveTasks(newTasks);
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    const handleDeleteTask = (taskId) => {
        const newTasks = tasks.filter(t => t.id !== taskId);
        saveTasks(newTasks);
        toast.success('Task deleted!');
    };
    
    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleUpdateTaskStatus = (taskId, newStatus) => {
        const newTasks = tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
        );
        saveTasks(newTasks);
    };

    const filteredAndSortedTasks = useMemo(() => {
        return tasks
            .filter(task => {
                const searchLower = searchTerm.toLowerCase();
                return task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower);
            })
            .filter(task => { 
                if (statusFilter === 'all') return true;
                return task.status === statusFilter;
            })
            .sort((a, b) => { 
                if (sortBy === 'dueDate_asc') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else {
                    return new Date(b.dueDate) - new Date(a.dueDate);
                }
            });
    }, [tasks, searchTerm, statusFilter, sortBy]);


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
                    setTasks={saveTasks}
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