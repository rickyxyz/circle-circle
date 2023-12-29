/* eslint-disable @typescript-eslint/no-throw-literal */
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
import PageProfile from '@/pages/PageProfile';
import { getCurrentUser } from '@/lib/firebase/auth';
import { getData } from '@/lib/firebase/firestore';
import PageCircle from '@/pages/PageCircle';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageRoot />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        element: <PageAuth />,
      },
      {
        path: 'profile/:userId?',
        element: <PageProfile />,
        loader: async ({ params }) => {
          const currentUser = await getCurrentUser();

          if (params.userId) {
            const userData = await getData('user', params.userId);
            if (!userData) {
              throw new Response('Not Found', { status: 404 });
            }
            return { ...userData };
          }

          if (currentUser) {
            const userData = await getData('user', currentUser.uid);
            return { ...userData };
          }

          throw new Response('Not Found', { status: 404 });
        },
      },
      {
        path: 'circle',
        element: <PageCircle />,
      },
      {
        path: 'auth',
        element: <ProtectedRoute />,
        loader: async () => {
          const currentUser = await getCurrentUser();
          if (!currentUser) {
            throw new Response('Not Found', { status: 404 });
          }
          return { isLoggedIn: Boolean(currentUser) };
        },
        children: [
          {
            index: true,
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
