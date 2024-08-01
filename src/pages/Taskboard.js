import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

// API URL and Task Status Enum
const apiUrl = process.env.REACT_APP_API_URL;

const TaskStatus = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

// Styling objects
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
  },
  column: {
    margin: '0 8px',
    borderRadius: '4px',
    width: '300px',
    minHeight: '500px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
  },
  columnHeader: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  task: {
    padding: '10px',
    margin: '0 0 8px 0',
    borderRadius: '4px',
    background: '#ffffff',
    border: '1px solid lightgray',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    margin: '5px',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#007bff', // Blue background
  },
  editButton: {
    backgroundColor: '#17a2b8', // Cyan
  },
  detailsButton: {
    backgroundColor: '#28a745', // Green
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red
  },
  todoColumn: {
    backgroundColor: '#e7f1ff', // Light Blue
  },
  inProgressColumn: {
    backgroundColor: '#fff3e0', // Light Orange
  },
  doneColumn: {
    backgroundColor: '#d4edda', // Light Green
  },
  createdAt: {
    fontSize: '12px',
    color: 'gray',
  },
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    }

    // Create a copy of the tasks array and move the task to the new position
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.filter(task => task._id === draggableId);
    if (!movedTask) return;

    movedTask.status = destination.droppableId;
    const filteredTasks = updatedTasks.filter(task => task._id !== draggableId);
    filteredTasks.splice(destination.index, 0, movedTask);

    try {
      await axios.put(`${apiUrl}/api/tasks/${movedTask._id}`, movedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/update/${taskId}`);
  };

  const handleDetails = (taskId) => {
    navigate(`/tasks/details/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${apiUrl}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Convert the createdAt field to a readable date format
  const formatCreatedAt = (createdAt) => new Date(createdAt).toLocaleString();

  return (
    <div>
      <button 
        onClick={() => navigate('/tasks/create')} 
        style={{ ...styles.button, ...styles.addButton }}
      >
        Add Task
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.container}>
          {Object.values(TaskStatus).map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ ...styles.column, ...styles[`${status.toLowerCase().replace(/ /g, '')}Column`] }}
                >
                  <div style={styles.columnHeader}>{status}</div>
                  {getTasksByStatus(status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...styles.task, ...provided.draggableProps.style }}
                        >
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <p style={styles.createdAt}><strong>Created At:</strong> {formatCreatedAt(task.createdAt)}</p>
                          <button 
                            onClick={() => handleEdit(task._id)} 
                            style={{ ...styles.button, ...styles.editButton }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDetails(task._id)} 
                            style={{ ...styles.button, ...styles.detailsButton }}
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleDelete(task._id)} 
                            style={{ ...styles.button, ...styles.deleteButton }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
