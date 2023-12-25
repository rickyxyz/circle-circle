import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageError from '@/pages/PageError';
import { AuthProvider } from '@/context/AuthProvider.tsx';
import PageAuth from '@/pages/PageAuth';
import PageRoot from '@/pages/PageRoot';
import ProtectedRoute from '@/pages/middleware/ProtectedRoute';
import PageProtected from '@/pages/PageProtected';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageRoot />,
    errorElement: <PageError />,
    children: [
      {
        path: '',
        element: <PageAuth />,
      },
      {
        path: 'auth',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <PageProtected />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
