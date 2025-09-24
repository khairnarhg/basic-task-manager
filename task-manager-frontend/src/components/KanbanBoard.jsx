import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, setTasks, onEditTask, onDeleteTask }) => {
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const updatedTasks = tasks.map(task => 
        task.id.toString() === draggableId 
            ? { ...task, status: destination.droppableId } 
            : task
    );
    setTasks(updatedTasks);
  };
  
  const columns = {
    'todo': { name: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    'in-progress': { name: 'In Progress', tasks: tasks.filter(t => t.status === 'in-progress') },
    'done': { name: 'Done', tasks: tasks.filter(t => t.status === 'done') },
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-800 p-4 rounded-lg shadow-inner ${snapshot.isDraggingOver ? 'bg-gray-700' : ''}`}
              >
                <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-600 pb-2">{column.name}</h3>
                <div className="space-y-4 min-h-[400px]">
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;