import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL;

function TaskDetailsPage() {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchTask = async () => {
    setIsLoading(true);
    setLoadError('');
    setIsAuthError(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTask(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setIsAuthError(true);
        setLoadError('Your session expired. Please log in again.');
      } else {
        setLoadError(error.response?.data?.error || 'Unable to load task details.');
      }
      console.error('Error fetching task: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f4f7fb',
        }}
      >
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

  if (loadError) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f4f7fb',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '460px',
            maxWidth: '100%',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            background: '#fff',
            color: '#881337',
            padding: '16px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          }}
          role="alert"
          aria-live="polite"
        >
          <div>{loadError}</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fetchTask}
              style={{
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                background: '#1d4ed8',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Retry
            </button>
            {isAuthError && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  background: '#1d4ed8',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const createdAt = new Date(task.createdAt).toLocaleString();
  const updatedAt = task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Not available';

  const getStatusTone = (status) => {
    if (status === 'Done') {
      return {
        gradient: 'linear-gradient(90deg, #22c55e 0%, #15803d 100%)',
        pill: 'rgba(34,197,94,0.16)',
        text: '#166534',
      };
    }

    if (status === 'In Progress') {
      return {
        gradient: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
        pill: 'rgba(245,158,11,0.18)',
        text: '#92400e',
      };
    }

    return {
      gradient: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
      pill: 'rgba(59,130,246,0.18)',
      text: '#1e40af',
    };
  };

  const statusTone = getStatusTone(task.status);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #eef4ff 0%, #f7fbff 45%, #fff2f8 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '28px 16px 20px',
      boxSizing: 'border-box',
    },
    surface: {
      width: 'min(920px, 100%)',
      margin: '0 auto',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.7)',
      background: 'linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(249,251,255,0.9) 100%)',
      boxShadow: '0 14px 45px rgba(34, 76, 152, 0.12)',
      padding: '22px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1,
    },
    ornamentA: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, rgba(141,179,255,0.6) 0%, rgba(141,179,255,0) 70%)',
      top: -30,
      right: -40,
      filter: 'blur(2px)',
      zIndex: 0,
    },
    ornamentB: {
      position: 'absolute',
      width: 280,
      height: 280,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 50%, rgba(247,149,209,0.28) 0%, rgba(247,149,209,0) 72%)',
      bottom: -80,
      left: -70,
      filter: 'blur(2px)',
      zIndex: 0,
    },
    hero: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '14px',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    eyebrow: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      background: 'rgba(37, 99, 235, 0.1)',
      color: '#1d4ed8',
      fontWeight: 700,
      fontSize: '0.82em',
      borderRadius: '999px',
      padding: '6px 11px',
      letterSpacing: '0.3px',
    },
    heading: {
      margin: '10px 0 8px',
      fontSize: 'clamp(1.35rem, 3.4vw, 2rem)',
      lineHeight: 1.25,
      letterSpacing: '0.2px',
      color: '#12204a',
      maxWidth: '640px',
      wordBreak: 'break-word',
    },
    statusChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '999px',
      padding: '8px 12px',
      background: statusTone.pill,
      color: statusTone.text,
      fontWeight: 700,
      fontSize: '0.92em',
      border: '1px solid rgba(255,255,255,0.85)',
    },
    statusDot: {
      width: '9px',
      height: '9px',
      borderRadius: '50%',
      background: statusTone.gradient,
      boxShadow: '0 0 0 4px rgba(255,255,255,0.45)',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    actionButton: {
      border: 'none',
      borderRadius: '10px',
      padding: '10px 14px',
      background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '0.92em',
      boxShadow: '0 7px 16px rgba(37,99,235,0.24)',
    },
    ghostButton: {
      border: '1px solid #dbeafe',
      borderRadius: '10px',
      padding: '10px 14px',
      background: '#fff',
      color: '#1d4ed8',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '0.92em',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      marginTop: '10px',
    },
    card: {
      borderRadius: '15px',
      background: '#ffffff',
      border: '1px solid #e2e8ff',
      padding: '14px 14px 12px',
      boxShadow: '0 6px 20px rgba(38, 72, 138, 0.08)',
      minHeight: '96px',
      boxSizing: 'border-box',
    },
    cardLabel: {
      fontSize: '0.82em',
      color: '#4f63a6',
      fontWeight: 700,
      letterSpacing: '0.35px',
      marginBottom: '7px',
    },
    cardValue: {
      color: '#1e2b57',
      fontWeight: 700,
      fontSize: '0.96em',
      wordBreak: 'break-word',
    },
    descriptionPanel: {
      marginTop: '14px',
      borderRadius: '16px',
      border: '1px solid #dbe7ff',
      background: 'linear-gradient(140deg, #ffffff 0%, #f6f9ff 100%)',
      padding: '16px',
      boxShadow: '0 8px 22px rgba(31, 71, 142, 0.09)',
    },
    descriptionTitle: {
      fontSize: '0.9em',
      color: '#2d4b99',
      fontWeight: 800,
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    descriptionText: {
      whiteSpace: 'pre-line',
      color: '#27335e',
      lineHeight: 1.72,
      fontSize: '0.99em',
      minHeight: '88px',
    },
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.ornamentA}
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={styles.ornamentB}
        animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={styles.surface}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
      >
        <div style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>TaskFlow Overview</div>
            <h1 style={styles.heading}>{task.title}</h1>
            <div style={styles.statusChip}>
              <span style={styles.statusDot} />
              {task.status}
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.actionButton} onClick={() => navigate(`/tasks/update/${id}`)}>
              Edit Task
            </button>
            <button type="button" style={styles.ghostButton} onClick={() => navigate('/tasks')}>
              Back to Board
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Created</div>
            <div style={styles.cardValue}>{createdAt}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Last Updated</div>
            <div style={styles.cardValue}>{updatedAt}</div>
          </div>
        </div>

        <div style={styles.descriptionPanel}>
          <div style={styles.descriptionTitle}>Description</div>
          <div style={styles.descriptionText}>{task.description || 'No description provided.'}</div>
        </div>
      </motion.div>
    </div>
  );
}

export default TaskDetailsPage;
