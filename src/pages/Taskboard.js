import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

// API URL and Task Status Enum
const apiUrl = process.env.REACT_APP_API_URL;
const aiSummaryEndpoint = process.env.REACT_APP_TASK_SUMMARY_ENDPOINT || '/api/tasks/ask-summary';

const TaskStatus = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

// Styling objects
const styles = {
  boardBackground: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '1400px',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
    padding: '0 32px',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100vw',
    gap: '12px',
    margin: '0',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },

  // Responsive columns for small screens
  '@media (max-width: 900px)': {
    container: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '24px',
    },
    column: {
      minWidth: '0',
      width: '100%',
      marginBottom: '18px',
    },
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
    padding: '10px 36px 10px 16px',
    borderRadius: '10px',
    border: '1.5px solid #bdbdbd',
    fontSize: '16px',
    outline: 'none',
    background: 'linear-gradient(90deg, #e3eafc 0%, #fce4ec 100%)',
    boxShadow: '0 2px 8px 0 rgba(80,80,180,0.10)',
    color: '#222',
    fontWeight: 600,
    marginLeft: '8px',
    marginRight: '8px',
    transition: 'background 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    position: 'relative',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%236a11cb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '18px 18px',
  },

  option: {
    fontSize: '16px',
    color: '#2575fc',
    background: '#fce4ec',
    fontWeight: 500,
    padding: '8px 16px',
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
  aiLauncherButton: {
    background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 55%, #7c3aed 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.3px',
    boxShadow: '0 8px 18px rgba(37, 99, 235, 0.22)',
  },
  aiModalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(13, 24, 51, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1100,
    padding: '16px',
    boxSizing: 'border-box',
  },
  aiModalCard: {
    width: 'min(900px, 100%)',
    maxHeight: '85vh',
    overflowY: 'auto',
    borderRadius: '20px',
    border: '1px solid #d8e6ff',
    background: 'linear-gradient(120deg, #ffffff 0%, #f5f9ff 65%, #fff5fb 100%)',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.22)',
    padding: '18px',
    boxSizing: 'border-box',
  },
  aiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  aiTitle: {
    margin: 0,
    fontSize: '1.18em',
    color: '#17317f',
    letterSpacing: '0.3px',
  },
  aiSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '0.92em',
    color: '#4a5a92',
  },
  aiCloseButton: {
    border: '1px solid #d4ddff',
    borderRadius: '10px',
    background: '#fff',
    color: '#1d4ed8',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '8px 12px',
  },
  aiCountSelect: {
    borderRadius: '10px',
    border: '1px solid #bdd3ff',
    background: '#fff',
    color: '#1f3a8a',
    fontWeight: 600,
    padding: '9px 12px',
    outline: 'none',
  },
  aiInputArea: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '10px',
    alignItems: 'stretch',
  },
  aiTextarea: {
    width: '100%',
    minHeight: '74px',
    borderRadius: '12px',
    border: '1.5px solid #c8d9ff',
    padding: '12px 14px',
    resize: 'vertical',
    fontSize: '0.97em',
    boxSizing: 'border-box',
    outline: 'none',
    color: '#1e293b',
    background: '#ffffff',
  },
  aiAskButton: {
    border: 'none',
    borderRadius: '12px',
    padding: '0 18px',
    minWidth: '132px',
    background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 60%, #7c3aed 100%)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.24)',
  },
  aiQuickPrompts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
  },
  aiQuickButton: {
    border: '1px solid #d0ddff',
    background: '#fff',
    color: '#27408a',
    borderRadius: '999px',
    padding: '7px 11px',
    fontSize: '0.85em',
    fontWeight: 600,
    cursor: 'pointer',
  },
  aiError: {
    marginTop: '12px',
    borderRadius: '10px',
    border: '1px solid #fecaca',
    background: '#fff1f2',
    color: '#9f1239',
    padding: '10px 12px',
    fontWeight: 600,
    fontSize: '0.9em',
  },
  aiAnswerCard: {
    marginTop: '12px',
    borderRadius: '14px',
    border: '1px solid #d5e3ff',
    background: 'linear-gradient(160deg, #ffffff 0%, #f7faff 100%)',
    padding: '14px 14px 12px',
    boxShadow: '0 5px 16px rgba(36, 64, 132, 0.09)',
  },
  aiAnswerMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  aiMetaPill: {
    borderRadius: '999px',
    background: '#eaf1ff',
    color: '#1e40af',
    padding: '4px 9px',
    fontSize: '0.78em',
    fontWeight: 700,
    letterSpacing: '0.2px',
  },
  aiAnswerText: {
    margin: 0,
    whiteSpace: 'pre-line',
    lineHeight: 1.65,
    color: '#1f2a4f',
    fontSize: '0.96em',
  },
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('updatedAt'); // Default sorting by updatedAt
  const [statusFilter, setStatusFilter] = useState('all');
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTaskCount, setAiTaskCount] = useState(null);
  const [aiModel, setAiModel] = useState('');
  const [maxTasksForAI, setMaxTasksForAI] = useState(100);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();

  const quickPrompts = [
    'Turn my completed tasks into STAR-format interview answers.',
    'Which tasks show strongest impact I can mention in interviews?',
    'Create interview talking points from my recent task history.',
    'Find leadership and ownership examples from my tasks for interviews.',
    'Draft a 60-second interview pitch using my top tasks.',
  ];

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
    let filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
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
  }, [searchQuery, tasks, sortBy, statusFilter]);

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
    const taskToDelete = tasks.find(task => task._id === taskId);
    const taskTitle = taskToDelete?.title || 'this task';
    const confirmed = window.confirm(`Delete "${taskTitle}"? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

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

  const handleAskTaskSummary = async (promptOverride) => {
    const question = (promptOverride || aiQuery).trim();

    if (!question) {
      setAiError('Please enter a question for the AI assistant.');
      return;
    }

    setAiError('');
    setAiLoading(true);

    try {
      const token = localStorage.getItem('token');
      const normalizedPath = aiSummaryEndpoint.startsWith('/') ? aiSummaryEndpoint : `/${aiSummaryEndpoint}`;
      const response = await axios.post(
        `${apiUrl}${normalizedPath}`,
        {
          query: question,
          maxTasks: maxTasksForAI,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiQuery(question);
      setAiAnswer(response.data?.answer || 'No response content was returned by the AI service.');
      setAiTaskCount(response.data?.taskCount ?? null);
      setAiModel(response.data?.model || '');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const message =
        error.response?.data?.msg ||
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        'Unable to get an AI answer right now. Please try again.';

      setAiError(typeof message === 'string' ? message : 'Unable to get an AI answer right now. Please try again.');
    } finally {
      setAiLoading(false);
    }
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
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          style={styles.aiLauncherButton}
        >
          Ask AI Assistant
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          style={styles.searchInput}
        />
          <div style={styles.dropdownGroup}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option style={styles.option} value="title">Sort by Title</option>
            <option style={styles.option} value="createdAt">Sort by Creation Date</option>
            <option style={styles.option} value="updatedAt">Sort by Modified Date</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ ...styles.select, minWidth: 140 }}
          >
            <option style={styles.option} value="all">Show All</option>
            <option style={styles.option} value="To Do">To Do</option>
            <option style={styles.option} value="In Progress">In Progress</option>
            <option style={styles.option} value="Done">Done</option>
          </select>
        </div>
      </div>

      {isAiModalOpen && (
        <div style={styles.aiModalOverlay} onClick={() => setIsAiModalOpen(false)}>
          <div style={styles.aiModalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.aiHeader}>
              <div>
                <h2 style={styles.aiTitle}>Stop Searching. Start Asking!</h2>
                <p style={styles.aiSubtitle}>Ask questions on your tasks, find answers faster, and save time.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={maxTasksForAI}
                  onChange={(e) => setMaxTasksForAI(Number(e.target.value))}
                  style={styles.aiCountSelect}
                  aria-label="Maximum tasks for AI context"
                >
                  <option value={25}>Use 25 tasks</option>
                  <option value={50}>Use 50 tasks</option>
                  <option value={100}>Use 100 tasks</option>
                  <option value={150}>Use 150 tasks</option>
                  <option value={200}>Use 200 tasks</option>
                </select>
                <button type="button" style={styles.aiCloseButton} onClick={() => setIsAiModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>

            <div style={styles.aiInputArea}>
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Example: Craft 3 STAR format stories from my completed tasks that I can use in interviews."
                style={styles.aiTextarea}
              />
              <button
                type="button"
                onClick={() => handleAskTaskSummary()}
                style={styles.aiAskButton}
                disabled={aiLoading}
              >
                {aiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>

            <div style={styles.aiQuickPrompts}>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  style={styles.aiQuickButton}
                  onClick={() => handleAskTaskSummary(prompt)}
                  disabled={aiLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {aiError && (
              <div style={styles.aiError} role="alert" aria-live="polite">
                {aiError}
              </div>
            )}

            {aiAnswer && !aiError && (
              <div style={styles.aiAnswerCard}>
                <div style={styles.aiAnswerMeta}>
                  {aiTaskCount !== null && <span style={styles.aiMetaPill}>{`Tasks: ${aiTaskCount}`}</span>}
                  {aiModel && <span style={styles.aiMetaPill}>{`Model: ${aiModel}`}</span>}
                </div>
                <p style={styles.aiAnswerText}>{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.container}>

          {Object.values(TaskStatus)
            .filter(status => statusFilter === 'all' || status === statusFilter)
            .map(status => (
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
