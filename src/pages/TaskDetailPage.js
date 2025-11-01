import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// API URL
const apiUrl = process.env.REACT_APP_API_URL;

function TaskDetailsPage() {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task: ", error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f4f7fb',
      }}>
        <motion.div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '6px solid #e3eafc',
            borderTop: '6px solid #2575fc',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        />
      </div>
    );
  }

  // Convert the createdAt field to a readable date format
  const createdAt = new Date(task.createdAt).toLocaleString();

  // Outstanding, modern styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f4f7fb',
    },
    // No animated background
    card: {
      width: '480px',
      maxWidth: '95vw',
      padding: '22px 18px 16px 18px',
      borderRadius: '22px',
      background: '#fff',
      boxShadow: '0 8px 40px 0 rgba(80,80,180,0.13)',
      border: '1.5px solid #e3eafc',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 1,
      position: 'relative',
    },
    title: {
      fontSize: '1.7em',
      fontWeight: 800,
      color: '#1a237e',
      marginBottom: '10px',
      letterSpacing: '0.7px',
      textAlign: 'center',
      textShadow: '0 2px 8px #cfdef344',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    detail: {
      margin: '4px 0',
      padding: '2px 0',
      width: '100%',
      borderBottom: '1px solid #e3eafc',
      fontSize: '1.04em',
      color: '#222',
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      alignItems: 'center',
      gap: '0 12px',
    },
    label: {
      fontWeight: 700,
      color: '#1976d2',
      minWidth: '110px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      justifyContent: 'flex-end',
      textAlign: 'right',
      paddingRight: '8px',
    },
    description: {
      whiteSpace: 'pre-line',
      color: '#333',
      fontSize: '1em',
      lineHeight: 1.6,
      background: 'rgba(255,255,255,0.32)',
      borderRadius: '7px',
      padding: '8px 12px',
      marginTop: '1px',
      boxShadow: '0 1px 6px 0 rgba(166,193,238,0.08)',
      flex: 1,
    },
    status: {
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: '1em',
      color: '#fff',
      background: 'linear-gradient(90deg, #1976d2 0%, #43cea2 100%)',
      borderRadius: '13px',
      padding: '5px 14px',
      boxShadow: '0 2px 8px 0 rgba(67,206,162,0.08)',
      letterSpacing: '0.4px',
      marginLeft: '2px',
    },
    createdAt: {
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 600,
      fontSize: '0.97em',
      color: '#1976d2',
      background: 'rgba(255,255,255,0.6)',
      borderRadius: '11px',
      padding: '4px 10px',
      marginLeft: '2px',
      boxShadow: '0 1px 4px 0 rgba(106,17,203,0.06)',
    },
    icon: {
      fontSize: '1.08em',
      verticalAlign: 'middle',
    },
    // No wave backgrounds
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>
          <span role="img" aria-label="star" style={styles.icon}>🌟</span>
          Task Details
        </div>
        <div style={styles.detail}>
          <span style={styles.label}><span role="img" aria-label="bookmark" style={styles.icon}>🔖</span> Title:</span>
          <span style={{fontWeight: 700, color: '#222', fontSize: '1.08em', wordBreak: 'break-word'}}>{task.title}</span>
        </div>
        <div style={styles.detail}>
          <span style={styles.label}><span role="img" aria-label="memo" style={styles.icon}>📝</span> Description:</span>
          <div style={styles.description}>{task.description}</div>
        </div>
        <div style={styles.detail}>
          <span style={styles.label}><span role="img" aria-label="status" style={styles.icon}>📊</span> Status:</span>
          <span style={styles.status}>{task.status}</span>
        </div>
        <div style={styles.detail}>
          <span style={styles.label}><span role="img" aria-label="calendar" style={styles.icon}>📅</span> Created At:</span>
          <span style={styles.createdAt}>{createdAt}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
