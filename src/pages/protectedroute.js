import { Navigate, Outlet,useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to login, but save the current location they were 
    // trying to go to. This allows for a better UX (redirect back after login).
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;