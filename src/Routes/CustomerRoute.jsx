// src/Routes/CustomerRoute.jsx
import useUserRole from '@/Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const CustomerRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Allow customers and admins (admins can access customer routes)
  if (role === 'customer') {
    return children;
  }

  // Redirect to forbidden page if not authorized
  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default CustomerRoute;