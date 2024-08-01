import React, { useState, useEffect } from 'react';
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

  if (!task) return <div>Loading...</div>;

  // Convert the createdAt field to a readable date format
  const createdAt = new Date(task.createdAt).toLocaleString();

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
    detail: {
      margin: '8px 0',
      padding: '8px',
      borderBottom: '1px solid #e9ecef',
    },
    title: {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task Details</h2>
        <div style={styles.detail}>
          <strong>Title:</strong> {task.title}
        </div>
        <div style={styles.detail}>
          <strong>Description:</strong> {task.description}
        </div>
        <div style={styles.detail}>
          <strong>Status:</strong> {task.status}
        </div>
        <div style={styles.detail}>
          <strong>Created At:</strong> {createdAt}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
