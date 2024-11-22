import React, { useEffect, useState } from 'react';
import AuthProvider from './components/AuthProvider';
import Cookies from 'js-cookie';

import "./assets/styles/_global.scss";
import 'react-toastify/dist/ReactToastify.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import MoviePage from './pages/MoviePage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { checkUser } from './services/checkUser';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import SearchPage from './pages/SearchPage';
import SeriePage from './pages/SeriePage';
import FavoritePage from './pages/FavoritePage';
import WatchedPage from './pages/WatchedPage';
import NotFoundPage from './pages/NotFoundPage';
import { createRoot } from 'react-dom/client';
import EditPage from './pages/EditPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';

const router = createBrowserRouter(
  [
    {
      path: '/welcome',
      element: <WelcomePage />
    },
    {
      path: '/signin',
      element: <SignInPage />
    },
    {
      path: '/signup',
      element: <SignUpPage />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/movie',
      element: (
        <ProtectedRoute>
          <MoviePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/seriee',
      element: (
        <ProtectedRoute>
          <SeriePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/movies',
      element: (
        <ProtectedRoute>
          <MoviesPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/series',
      element: (
        <ProtectedRoute>
          <SeriesPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/search',
      element: (
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/favorite',
      element: (
        <ProtectedRoute>
          <FavoritePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/watched',
      element: (
        <ProtectedRoute>
          <WatchedPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/edit',
      element: (
        <ProtectedRoute>
          <EditPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/subscription',
      element: (
        <ProtectedRoute>
          <SubscriptionPage />
        </ProtectedRoute>
      )
    },
    {
      path: '*',
      element: (
        <NotFoundPage />
      )
    }
  ]
)

const root = document.getElementById('root');

if (root !== null) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}


function App() {
  const [isSignedIn, setIsSignedIn] = useState(Cookies.get('user') ? true : false);

  useEffect(() => {
    checkUser().then(result => {
      if (isSignedIn != result) {
        Cookies.remove('user');
        setIsSignedIn(result)
        location.reload();
      }
      else {
        setIsSignedIn(result)
      }
    });
  }, []);

  return (
    <AuthProvider isSignedIn={isSignedIn}>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

