// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import VincentAdmin from './pages/VincentAdmin';
import VincentImages from './pages/HomePage';
import DetailsPage from './pages/DetailsPage'
import { Box } from '@mui/material';
import AppHeader from './components/AppHeader';
import ArtSearchPage from './pages/SearchPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import './styles/index.css';

const GlobalLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <Box component="main" sx={{flexGrow: 1,}}>
        <Box sx={{
          flexGrow: 1, 
          minHeight: '100%',//全屏显示子页面，
          width: '100%',
          // 默认的背景色仍然留给子组件来设置 (保持透明)
          bgcolor: 'transparent'
        }}>
          <Outlet /> {/** Placeholder for Child Router */}
        </Box>
      </Box>
    </Box >
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
