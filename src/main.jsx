import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "@fortawesome/fontawesome-free/css/all.min.css";
import TokenContextProvider from './context/tokenContext.jsx';
import DarkModeContextProvider from './context/darkModeContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <DarkModeContextProvider>
    <TokenContextProvider>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <App />
          <Toaster position='top-center'/>
          <ReactQueryDevtools initialIsOpen={false} />
        </StrictMode>
      </QueryClientProvider>
    </TokenContextProvider>
  </DarkModeContextProvider>
);