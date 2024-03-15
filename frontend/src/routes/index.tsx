import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import AuthLayout from '../pages/AuthLayout.tsx';
import App from '../App.tsx';
import DashboardLayout from '../pages/DashboardLayout.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import PublicRoute from './PublicRoute.tsx';
import Entradas from '../pages/Entradas.tsx';
import Cuentas from '../pages/Cuentas.tsx';
import Categorias from '../pages/Categorias.tsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <PublicRoute>
      <AuthLayout />
    </PublicRoute>,
    // errorElement: <h1> NUUUU </h1>,
    children: [
      {
        index: true,
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ]
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute>
       <DashboardLayout />
    </ProtectedRoute>,
    // errorElement: <h1> NUUUU </h1>,
    children: [
      {
        index: true,
        element: <Entradas />,
      },
      {
        path: "cuentas",
        element: <Cuentas />,
      },
      {
        path: "categorias",
        element: <Categorias />,
      },
    ]
  }
]);