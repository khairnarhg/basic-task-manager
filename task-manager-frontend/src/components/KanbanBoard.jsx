import React, { useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onEditTask, onDeleteTask, onUpdateStatus }) => {
  useEffect(() => {
    console.log("tasks:", tasks);
  }, [tasks]);

  const columnIdToStatus = (id) => {
    switch (id) {
      case 'todo': return 0;
      case 'in-progress': return 1;
      case 'done': return 2;
      default: return 0;
    }
  };

  const statusToColumnId = (status) => {
    switch (status) {
      case 0: return 'todo';
      case 1: return 'in-progress';
      case 2: return 'done';
      default: return 'todo';
    }
  };

  const columns = useMemo(() => ({
    todo: { name: 'To Do', tasks: tasks?.filter(t => t.status === 0) || [] },
    'in-progress': { name: 'In Progress', tasks: tasks?.filter(t => t.status === 1) || [] },
    done: { name: 'Done', tasks: tasks?.filter(t => t.status === 2) || [] },
  }), [tasks]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskId = Number(draggableId);
    const newStatus = columnIdToStatus(destination.droppableId);

    if (onUpdateStatus) {
      onUpdateStatus(taskId, newStatus);
    }
  };

  // Return null if tasks is not loaded yet
  if (!tasks || !Array.isArray(tasks)) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable 
            key={columnId}
            droppableId={columnId}
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-800 p-4 rounded-lg shadow-inner transition-colors min-h-[200px] ${
                  snapshot.isDraggingOver ? 'bg-gray-700' : ''
                }`}
              >
                <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-600 pb-2">
                  {column.name}
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-700 hover:scrollbar-thumb-indigo-500">
                  {column.tasks.map((task, index) => (
                    <Draggable 
                      key={`${task.id}-${columnId}`} 
                      draggableId={task.id.toString()} 
                      index={index}
                      isDragDisabled={false}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform ${
                            snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                          }`}
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