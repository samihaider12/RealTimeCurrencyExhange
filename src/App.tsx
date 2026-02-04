import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useAuth } from './context/AuthContext'; // Hook use karein
import Navbar from './components/Navbar';
import Dashboard from './components/Dashbord';
import Form from './pages/Form';
import AuthForm from './auth/AuthForm';

const App = () => {
  const { user } = useAuth();

  return (
    <Box

    >
      {user && <Navbar />}

      <Box  >
        {user && <Toolbar />}
<Routes>
  <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />}/>
  <Route path="/form" element={user ? <Form /> : <Navigate to="/auth" />}/>
  <Route path="/auth" element={!user ? <AuthForm /> : <Navigate to="/dashboard" />}/>
  <Route path="/" element={<Navigate to="/dashboard" />} />
  <Route path="*" element={<Navigate to="/dashboard" />} />

</Routes>

      </Box>
    </Box>
  );
};

export default App;