// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import VincentAdmin from './pages/VincentAdmin';
import VincentImages from './pages/HomePage';
import DetailsPage from './pages/DetailsPage'
import { Box } from '@mui/material';
import AppHeader from './components/AppHeader';
import ArtSearchPage from './pages/SearchPage';


const GlobalLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />
      <Box component="main" sx={{ flexGrow: 1}}>
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
          <Route path="/vincent/search" element={<ArtSearchPage />} />
          <Route path="/vincent/id/:id" element={<DetailsPage />} />
        </Route>
        <Route path="/" element={<VincentAdmin />} />

      </Routes>
    </Router>
  );
}

export default App;
