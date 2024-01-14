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
import { getCurrentUser } from '@/lib/firebase/auth';
import { getCollectionAsArray, getData } from '@/lib/firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import LayoutRoot from '@/pages/layout/LayoutRoot';
import {
  PageCircles,
  PageCircle,
  PageError,
  PagePost,
  PageProfile,
  PageHome,
  PageSettings,
} from '@/pages';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/redux/store';
import RegisterForm from '@/component/form/RegisterForm';
import LoginForm from '@/component/form/LoginForm';
import LayoutCentered from '@/pages/layout/LayoutCentered';
import ProtectedRoute from '@/pages/middleware/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/account',
    errorElement: <PageError />,
    element: <LayoutCentered />,
    loader: async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        return redirect('/');
      }
      return null;
    },
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
    ],
  },
  {
    path: '/account',
    errorElement: <PageError />,
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
        element: <LayoutRoot />,
        children: [
          {
            path: 'settings',
            element: <PageSettings />,
          },
        ],
      },
    ],
  },
  {
    element: <LayoutRoot />,
    errorElement: <PageError />,
    children: [
      {
        index: true,
        element: <PageHome />,
      },
      {
        path: 'u/:userId?',
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
        path: '/c',
        element: <PageCircles />,
        loader: async () => {
          const circleData = await getCollectionAsArray('circle');
          return [...circleData];
        },
      },
      {
        path: '/c/:circleId',
        element: <PageCircle />,
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
        path: '/c/:circleId/p/:postId',
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ReduxProvider>
  </React.StrictMode>
);
