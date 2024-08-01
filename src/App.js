import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TaskBoard from './pages/Taskboard';
import Navbar from './components/NavBar'; 
import PrivateRoute from './components/PrivateRoute';
import CreateTaskPage from './pages/createTaskPage';
import UpdateTaskPage from './pages/updateTaskPage';
import TaskDetailsPage from './pages/TaskDetailPage';
import GoogleAuth from './components/GoogleAuth';

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
      <Route path="/login" element={<><LoginPage /><GoogleAuth /></>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute element={<TaskBoard />} />
          }
        />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
        <Route path="/tasks/update/:id" element={<UpdateTaskPage />} />
        <Route path="/tasks/details/:id" element={<TaskDetailsPage />} />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
      </>
  );
}

export default App;
