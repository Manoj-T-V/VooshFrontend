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
  boardBackground: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  gap: '12px',
    margin: '0',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  column: {
    flex: 1,
    margin: '0',
    borderRadius: '16px',
    minWidth: '240px',
    minHeight: '500px',
    padding: '18px 12px',
    background: '#f8fafc',
    boxSizing: 'border-box',
    boxShadow: '0 4px 16px 0 rgba(60,60,60,0.08)',
    transition: 'box-shadow 0.2s',
  },
  columnHeader: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
  },
  task: {
    padding: '10px',
    margin: '0 0 8px 0',
    borderRadius: '4px',
    background: '#ffffff',
    border: '1px solid lightgray',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  description: {
    whiteSpace: 'pre-line',
    fontSize: '0.97em',
    color: '#222',
    margin: '0 0 8px 0',
    lineHeight: 1.5,
  },
  taskTitle: {
    fontSize: '1.22em',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 8px 0',
    letterSpacing: '0.7px',
    lineHeight: 1.3,
    textShadow: '0 2px 8px rgba(67,206,162,0.18), 0 1px 2px rgba(60,60,60,0.10)',
    wordBreak: 'break-word',
    padding: '4px 8px',
    borderLeft: '5px solid #43cea2',
    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    borderRadius: '6px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 12px 0 rgba(67,206,162,0.10)',
    transition: 'background 0.2s, color 0.2s',
  },
  taskDivider: {
    height: '3px',
    width: '40%',
    minWidth: '60px',
    maxWidth: '120px',
    margin: '6px 0 12px 0',
    border: 'none',
    borderRadius: '2px',
    background: 'linear-gradient(90deg, #42a5f5 0%, #e3f2fd 100%)',
    opacity: 0.7,
    boxShadow: '0 1px 4px 0 rgba(66,165,245,0.10)',
  },
  button: {
    margin: '5px',
    padding: '10px 22px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
    letterSpacing: '0.5px',
    transition: 'background 0.2s, box-shadow 0.2s',
  },
  addTaskBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '0 0 16px 0',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #bdbdbd',
    fontSize: '16px',
    outline: 'none',
    width: '240px',
    background: '#fff',
    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
    transition: 'border 0.2s',
  },
  select: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #bdbdbd',
    fontSize: '16px',
    outline: 'none',
    background: '#fff',
    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
    transition: 'border 0.2s',
  },
  addButton: {
    backgroundColor: '#007bff', // Blue background
  },
  editButton: {
    background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px 0 rgba(67,206,162,0.10)',
  },
  detailsButton: {
    background: 'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px 0 rgba(255,179,71,0.10)',
  },
  deleteButton: {
    background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px 0 rgba(221,36,118,0.10)',
  },
  todoColumn: {
    background: 'linear-gradient(120deg, #bbdefb 60%, #90caf9 100%)',
    boxShadow: '0 2px 12px 0 rgba(66,165,245,0.10)',
  },
  inProgressColumn: {
    background: 'linear-gradient(120deg, #fff9c4 60%, #ffe082 100%)',
    boxShadow: '0 2px 12px 0 rgba(255,179,0,0.10)',
  },
  doneColumn: {
    background: 'linear-gradient(120deg, #c8e6c9 60%, #a5d6a7 100%)',
    boxShadow: '0 2px 12px 0 rgba(56,142,60,0.10)',
  },
  todoHeader: {
    backgroundColor: '#42a5f5', // Blue
  },
  inProgressHeader: {
    backgroundColor: '#ffb300', // Amber
  },
  doneHeader: {
    backgroundColor: '#388e3c', // Green
  },
  createdAt: {
    fontSize: '0.93em',
    color: '#666',
    margin: '4px 0 0 0',
    letterSpacing: '0.2px',
  },
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('updatedAt'); // Default sorting by updatedAt
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
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortTasks = (tasks) => {
      return tasks.slice().sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'createdAt') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
         else if (sortBy ==='updatedAt') {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
         }
        return 0;
      });
    };

    setSortedTasks(sortTasks(filteredTasks));
  }, [searchQuery, tasks, sortBy]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    }

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
    return sortedTasks.filter(task => task.status === status);
  };

  // Convert the createdAt field to a readable date format
  const formatCreatedAt = (createdAt) => new Date(createdAt).toLocaleString();

  return (
    <div style={styles.boardBackground}>
      <div style={styles.addTaskBar}>
        <button
          onClick={() => navigate('/tasks/create')}
          style={{ ...styles.button, ...styles.addButton }}
        >
          ＋ Add Task
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          style={styles.searchInput}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="title">Sort by Title</option>
          <option value="createdAt">Sort by Creation Date</option>
          <option value="updatedAt">Sort by Modified Date</option>
        </select>
      </div>
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
                  <div
                    style={{
                      ...styles.columnHeader,
                      ...(status === TaskStatus.TODO
                        ? styles.todoHeader
                        : status === TaskStatus.IN_PROGRESS
                        ? styles.inProgressHeader
                        : styles.doneHeader),
                    }}
                  >
                    {status}
                  </div>
                  {getTasksByStatus(status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...styles.task, ...provided.draggableProps.style }}
                        >
                          <h3 style={styles.taskTitle}>{task.title}</h3>
                          <p style={styles.description}>{task.description}</p>
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
