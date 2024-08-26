import React from 'react';
import logo from './logo.svg';
import Navbar from './componenets/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Recipes from './pages/Recipes';
import Signin from './componenets/Signin';
import Signup from './componenets/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from './features/user/userSlice';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { userActions } from './features/user/userSlice';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { fetchUserDetailsAsync } from './features/user/userSlice';
import RecipeDetails from './pages/RecipeDetails';
import FavoritesPage from './pages/favourites';
import './App.css';
import Loader from './componenets/loader';
import { useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const { loggedIn, loading } = useSelector(userSelector);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token) {
      try {
        const parsedToken = JSON.parse(token);

        if (typeof parsedToken === 'string') {
          const decodedToken = jwtDecode(parsedToken);

          // Check if the token is expired
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            dispatch(userActions.signOut());
            setAuthChecked(true);
          } else {
            // Initialize user state with token
            dispatch(userActions.initializeUser({ token: parsedToken }));
            // Fetch user details
            dispatch(fetchUserDetailsAsync()).then((action) => {
              if (fetchUserDetailsAsync.fulfilled.match(action)) {
                dispatch(userActions.setUser(action.payload));
              } else {
                dispatch(userActions.signOut());
              }
              setAuthChecked(true);
            });
          }
        }
      } catch (e) {
        console.error('Error parsing token:', e);
        dispatch(userActions.signOut());
        setAuthChecked(true);
      }
    } else {
      dispatch(userActions.signOut());
      setAuthChecked(true);
    }
  }, [dispatch]);

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {

    return loggedIn ? children : <Navigate to="/signin" />;
  };

  const AppLayout = () => {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "",
          element: <ProtectedRoute><Home /></ProtectedRoute>,
        },
        {
          path: "recipes",
          element: (
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "recipe/:recipeId", // Define the route with a recipe ID parameter
          element: (
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "favourites", // Define the route with a recipe ID parameter
          element: (
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          ),
        },
      ],
    }

  ]);




  return <RouterProvider router={router} />;
}

export default App;
