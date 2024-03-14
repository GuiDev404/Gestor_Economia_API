import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth";

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: React.ReactNode
}

export default function ProtectedRoute({ redirectTo = "/auth/login", children }: ProtectedRouteProps) {
  const { isLogged } = useAuth()
  
  console.log(isLogged());

  if (!isLogged()) {
   return <Navigate to={redirectTo} />
  }

  return children ? children : <Outlet />
 }