import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API URL
const apiUrl = process.env.REACT_APP_API_URL;

function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do'); // Use exact enum value
  const [versions, setVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const navigate = useNavigate();
  
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
    const fetchVersions = async () => {
      setIsLoadingVersions(true);

      try {
        const response = await axios.get(`${apiUrl}/api/tasks/versions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const versionList = Array.isArray(response.data) ? response.data : [];
        setVersions(versionList);

        const defaultVersion = versionList.find((item) => item.versionCode === 'v1') || versionList[0];
        setSelectedVersionId(defaultVersion?._id || '');
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthError(true);
          setSubmitError('Your session expired. Please log in again.');
        }
      } finally {
        setIsLoadingVersions(false);
      }
    };

    fetchVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsAuthError(false);
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        status,
      };

      if (selectedVersionId) {
        payload.versionId = selectedVersionId;
        payload.version = selectedVersionId;
      }

      await axios.post(
        `${apiUrl}/api/tasks`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/tasks');
    } catch (error) {
      if (error.response?.status === 401) {
        setIsAuthError(true);
        setSubmitError('Your session expired. Please log in again.');
      } else {
        setSubmitError(error.response?.data?.error || 'Unable to create task. Please try again.');
      }
      console.error("Error creating task: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modern, stylish styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#f4f7fb',
    },
    animatedBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    },
    card: {
      width: '480px',
      maxWidth: '97vw',
      padding: '38px 32px 30px 32px',
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
    heading: {
      fontSize: '2em',
      fontWeight: 900,
      color: '#2575fc',
      marginBottom: '18px',
      letterSpacing: '1px',
      textAlign: 'center',
      textShadow: '0 2px 12px #a6c1ee44',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      margin: '12px 0',
      borderRadius: '7px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      transition: 'border 0.2s',
    },
    textarea: {
      width: '100%',
      padding: '14px 16px',
      margin: '12px 0',
      borderRadius: '7px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      resize: 'vertical',
      minHeight: '120px',
      transition: 'border 0.2s',
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      margin: '12px 0',
      borderRadius: '7px',
      border: '1.5px solid #bdbdbd',
      boxSizing: 'border-box',
      fontSize: '1.08em',
      background: '#f8fafc',
      transition: 'border 0.2s',
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '7px',
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
    errorBox: {
      marginTop: '10px',
      marginBottom: '4px',
      width: '100%',
      background: '#fff2f2',
      color: '#9f1239',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '10px 12px',
      fontSize: '0.95em',
      boxSizing: 'border-box',
    },
    helperActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '8px',
      flexWrap: 'wrap',
    },
    secondaryButton: {
      border: 'none',
      borderRadius: '6px',
      padding: '8px 12px',
      background: '#1d4ed8',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.9em',
    },
    float1: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #a1c4fd 80%, #c2e9fb 100%)',
      top: 60,
      left: 40,
      opacity: 0.32,
      filter: 'blur(1.5px)',
      zIndex: 0,
    },
    float2: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 70% 70%, #fbc2eb 70%, #f8fafc 100%)',
      bottom: 80,
      right: 60,
      opacity: 0.22,
      filter: 'blur(1.2px)',
      zIndex: 0,
    },
    float3: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 50% 50%, #b2f7ef 70%, #e0c3fc 100%)',
      top: 180,
      right: 120,
      opacity: 0.18,
      filter: 'blur(1.2px)',
      zIndex: 0,
    },
  };

  return (
    <div style={styles.container}>
      {/* Animated floating shapes background */}
      <motion.div
        style={styles.animatedBg}
        aria-hidden="true"
      >
        <motion.div
          style={styles.float1}
          animate={{
            y: [0, 24, 0],
            x: [0, 18, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={styles.float2}
          animate={{
            y: [0, -18, 0],
            x: [0, -14, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
        <motion.div
          style={styles.float3}
          animate={{
            y: [0, 12, 0],
            x: [0, 9, 0],
            scale: [1, 1.09, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        />
      </motion.div>
      {/* Card content with entrance and hover animation */}
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        whileHover={{ scale: 1.025, boxShadow: '0 10px 32px 0 rgba(80,80,180,0.18)' }}
      >
        <div style={styles.heading}>
          <span role="img" aria-label="rocket" style={{fontSize: '1.3em'}}>🚀</span>
          Create Task
        </div>
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
          <select
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(e.target.value)}
            style={styles.select}
            disabled={isLoadingVersions}
          >
            <option value="">Default (v1)</option>
            {versions.map((version) => (
              <option key={version._id} value={version._id}>
                {`${version.versionCode} - ${version.versionName}`}
              </option>
            ))}
          </select>
          {submitError && (
            <div style={styles.errorBox} role="alert" aria-live="polite">
              <div>{submitError}</div>
              {isAuthError && (
                <div style={styles.helperActions}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </div>
          )}
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateTaskPage;
