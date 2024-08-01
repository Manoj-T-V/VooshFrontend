import React, { useState, useEffect } from 'react';
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
      backgroundColor: '#f8f9fa', // Light gray background
    },
    card: {
      width: '400px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff', // White background for the card
      boxSizing: 'border-box',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      boxSizing: 'border-box',
      resize: 'vertical',
    },
    select: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#007bff', // Blue background
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Update Task</h2>
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}

export default UpdateTaskPage;
