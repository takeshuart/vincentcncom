import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import { Box, useMediaQuery } from '@mui/material';
// import AppHeader from './components/AppHeader';
import AppHeader from './components/header/Header';
import ArtSearchPage from './pages/SearchPage';

import './styles/index.css';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ScrollToTop from './components/ScrollToTop';
import FavoritesPage from './pages/FavoritesPage';
import { Toaster } from 'react-hot-toast';

const GlobalLayout = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <Box component="main" sx={{ flexGrow: 1, pb: isMobile ? 7 : 0 }}>
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
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000, 
          style: {
            padding: '6px 12px',
            fontSize: '10px',
            borderRadius: '8px',
            background: 'rgba(33, 90, 143, 0.1)', 
            color: '#215A8F',                    
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)', 
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GlobalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="search" element={<ArtSearchPage />} />
          <Route path="vincent/:id" element={<DetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
