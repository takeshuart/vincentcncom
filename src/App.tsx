import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import { Box } from '@mui/material';
// import AppHeader from './components/AppHeader';
import AppHeader from './components/header/Header';
import ArtSearchPage from './pages/SearchPage';

import './styles/index.css';
import AuthPage from './pages/AuthPage';
import ScrollToTop from './components/ScrollToTop';
import FavoritesPage from './pages/FavoritesPage';

const GlobalLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <Box component="main" sx={{ flexGrow: 1, }}>
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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<GlobalLayout />}>
            <Route index element={<HomePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="search" element={<ArtSearchPage />} />
            <Route path="vincent/:id" element={<DetailsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
        </Routes>
      </>
    );
}

export default App;
