import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth";

interface PublicRouteProps {
  redirectTo?: string;
  children?: React.ReactNode
}

export default function PublicRoute({ redirectTo = "/dashboard", children }: PublicRouteProps) {
  const { isLogged } = useAuth()
  
  if (isLogged()) {
   return <Navigate to={redirectTo} />
  }

  return children ? children : <Outlet />
 }