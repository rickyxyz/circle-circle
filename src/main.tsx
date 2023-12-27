import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import PageError from '@/pages/PageError';
import { AuthProvider } from '@/context/AuthProvider.tsx';
import PageAuth from '@/pages/PageAuth';
import PageRoot from '@/pages/PageRoot';
import ProtectedRoute from '@/pages/middleware/ProtectedRoute';
import PageProtected from '@/pages/PageProtected';
import PageProfile from '@/pages/PageProfile';
import { getCurrentUser } from '@/lib/firebase/auth';

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
          // TODO: add user data fetching and return user data
          try {
            const currentUser = await getCurrentUser();

            if (!currentUser && !params.userId) {
              return redirect('/404');
            } else {
              return {
                isLoggedIn: Boolean(currentUser),
                userId: params.userId,
              };
            }
          } catch (error) {
            return null;
          }
        },
      },
      {
        path: 'auth',
        element: <ProtectedRoute />,
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
