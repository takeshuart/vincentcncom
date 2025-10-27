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

// Header 的实际高度
export const HEADER_HEIGHT = 40;
// Header 下方与子内容之间的间距
export const CONTENT_GAP = 40;

// 结合高度和间距，这是 main Box 需要的完整偏移量
export const TOTAL_HEADER_OFFSET = HEADER_HEIGHT + CONTENT_GAP;

const GlobalLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppHeader />

      <Box component="main" sx={{
        flexGrow: 1,
        // 负外边距：让内容的背景向上延伸覆盖顶部空白区
        marginTop: `-${TOTAL_HEADER_OFFSET}px`,
        // // 内边距：将 Outlet 内容推到 Header 下边缘 + 20px 的位置
        paddingTop: `${TOTAL_HEADER_OFFSET}px`,
      }}>
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
