/* eslint-disable @typescript-eslint/no-throw-literal */
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/global.css';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider.tsx';
import ProtectedRoute from '@/pages/middleware/ProtectedRoute';
import { getCurrentUser } from '@/lib/firebase/auth';
import { getCollection, getData } from '@/lib/firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import ModalProvider from '@/context/ModalProvider';
import LayoutRoot from '@/pages/layout/LayoutRoot';
import {
  PageAuth,
  PageCircle,
  PageCircleForms,
  PageError,
  PagePost,
  PageProfile,
  PageProtected,
} from '@/pages';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/redux/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoot />,
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
        path: '/circle',
        element: <PageCircle />,
        loader: async () => {
          const circleData = await getCollection('circle');
          return [...circleData];
        },
      },
      {
        path: '/circle/:circleId',
        element: <PageCircleForms />,
        loader: async ({ params }) => {
          if (!params.circleId) {
            return null;
          } else {
            const circleData = await getData('circle', params.circleId);

            if (!circleData) {
              throw new Response('Not Found', { status: 404 });
            }

            const currentUser = await getCurrentUser();

            if (!currentUser) {
              return { circle: circleData, isMember: false };
            }

            const memberData = await getDoc(
              doc(db, `circle/${params.circleId}/member/${currentUser.uid}`)
            );
            if (memberData.exists()) {
              return { circle: circleData, isMember: true };
            }

            return { circle: circleData, isMember: false };
          }
        },
      },
      {
        path: '/circle/:circleId/post/:postId',
        element: <PagePost />,
        loader: async ({ params }) => {
          if (!params.postId) {
            redirect(`/circle/${params.circleId}`);
          }
          const circleDoc = await getDoc(
            doc(db, `/circle/${params.circleId}/post/${params.postId}`)
          );

          if (circleDoc.exists()) {
            return circleDoc.data();
          } else {
            throw new Response('Not Found', { status: 404 });
          }
        },
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
    <ReduxProvider store={store}>
      <AuthProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </AuthProvider>
    </ReduxProvider>
  </React.StrictMode>
);
