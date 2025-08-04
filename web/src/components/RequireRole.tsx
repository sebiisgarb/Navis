import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  role: "SITE_MANAGER" | "DRIVER" | "ADMIN";
}

export default function RequireRole({ role }: Props) {
  const { token } = useAuth();
  const storedRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (storedRole !== role && storedRole !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  // montează aici rutele-copil (<Route> din App.tsx)
  return <Outlet />;
}
