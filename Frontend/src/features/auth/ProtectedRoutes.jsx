import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "./authSlice";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated)
    return <Navigate to="/" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
