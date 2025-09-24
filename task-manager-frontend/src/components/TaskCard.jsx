import React from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';

const STATUS_MAP = {
  0: { label: 'To Do', color: 'bg-blue-500' },
  1: { label: 'In Progress', color: 'bg-yellow-500' },
  2: { label: 'Done', color: 'bg-green-500' }
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const status = STATUS_MAP[task.status] || { label: 'Unknown', color: 'bg-gray-500' };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 2; // not done

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg mb-2">{task.title}</h4>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-white">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-300 mb-4 text-sm">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400 font-bold' : ''}`}>
          <Calendar size={14} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${status.color}`}>
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
