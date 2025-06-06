import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button } from '@mui/material';
import UsersPage from './pages/users';
import StatisticsPage from './pages/statistics';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Statistics
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>

        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<StatisticsPage />} />
          <Route path="/users" element={<UsersPage />} />
      
        </Routes>
      </Box>
    </Router>
  );
}

export default App;