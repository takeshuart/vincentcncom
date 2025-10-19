// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import VincentAdmin from './pages/VincentAdmin';
import VincentImages from './pages/VincentGrid';
import ArtworkDetailPage from './pages/VincentArtworkDetail'
import { Box } from '@mui/material';
import AppHeader from './components/AppHeader';


const GlobalLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Box component="main" sx={{ flexGrow: 1, marginTop: '64px' }}>
        <Outlet />
      </Box>

      {/* <AppFooter /> */}
    </Box>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobalLayout />}>
          <Route path="/vincent" element={<VincentImages />} />
          <Route path="/vincent/id/:id" element={<ArtworkDetailPage />} />
        </Route>
        <Route path="/" element={<VincentAdmin />} />

      </Routes>
    </Router>
  );
}

export default App;
