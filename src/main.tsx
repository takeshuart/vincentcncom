import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

//React Enter File
/**
 * 全局状态管理器，管理了所有的 查询缓存、失效策略、重试策略 等。
 * useQuery/useMutation会自动使用该管理器
 */
const queryClient = new QueryClient();

//load 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);