import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// API URL
const apiUrl = process.env.REACT_APP_API_URL;

function UpdateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do'); // Use exact enum value
  const navigate = useNavigate();
  const { id } = useParams();

  const TaskStatus = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  const statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.DONE, label: 'Done' },
  ];

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTitle(response.data.title);
        setDescription(response.data.description);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/tasks/${id}`, { title, description, status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/tasks');
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Styling objects
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
    },
    card: {
      width: '410px',
      padding: '32px 28px 24px 28px',
      borderRadius: '16px',
      boxShadow: '0 6px 32px 0 rgba(80,80,180,0.10)',
      background: '#fff',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    heading: {
      fontSize: '1.6em',
      fontWeight: 700,
      color: '#2575fc',
      marginBottom: '18px',
      letterSpacing: '0.5px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      margin: '10px 0',
      borderRadius: '6px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      transition: 'border 0.2s',
    },
    textarea: {
      width: '100%',
      padding: '12px 14px',
      margin: '10px 0',
      borderRadius: '6px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      resize: 'vertical',
      minHeight: '130px',
      transition: 'border 0.2s',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      margin: '10px 0',
      borderRadius: '6px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      transition: 'border 0.2s',
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.13em',
      color: '#fff',
      background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
      marginTop: '18px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px 0 rgba(80,80,180,0.10)',
      transition: 'background 0.2s, box-shadow 0.2s',
    },
  };

  return (
    <div style={{...styles.container, position: 'relative', overflow: 'hidden'}}>
      {/* Animated floating circles background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {/* Circle 1 */}
        <motion.div
          style={{
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #a1c4fd 80%, #c2e9fb 100%)',
            top: 60,
            left: 40,
            opacity: 0.45,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Circle 2 */}
        <motion.div
          style={{
            position: 'absolute',
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 70% 70%, #fbc2eb 70%, #f8fafc 100%)',
            bottom: 80,
            right: 60,
            opacity: 0.38,
            filter: 'blur(1.5px)',
          }}
          animate={{
            y: [0, -22, 0],
            x: [0, -18, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        {/* Circle 3 */}
        <motion.div
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, #b2f7ef 70%, #e0c3fc 100%)',
            top: 180,
            right: 120,
            opacity: 0.32,
            filter: 'blur(1.5px)',
          }}
          animate={{
            y: [0, 18, 0],
            x: [0, 12, 0],
            scale: [1, 1.09, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
      </motion.div>
      {/* Card content (above background) */}
      <motion.div
        style={{...styles.card, zIndex: 1, position: 'relative'}}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        whileHover={{ scale: 1.025, boxShadow: '0 10px 32px 0 rgba(80,80,180,0.18)' }}
      >
        <div style={styles.heading}>Update Task</div>
        <form onSubmit={handleSubmit} style={{width: '100%'}}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            style={styles.input}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            style={styles.textarea}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.button}>Update</button>
        </form>
      </motion.div>
    </div>
  );
}

export default UpdateTaskPage;
