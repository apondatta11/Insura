//from cursor

// import React, { use } from 'react';
// import { Navigate, useLocation } from 'react-router';
// import { AuthContext } from '../provider/AuthContext';

// const AdminRoute = ({ children }) => {
//     const { user, userRole, loading } = use(AuthContext);
//     const location = useLocation();

//     if(loading){
//         return <span className="loading loading-ring loading-xl"></span>
//     }

//     if(!user){
//         return <Navigate to="/auth/login" state={location.pathname}></Navigate>
//     }

//     if(userRole !== 'admin'){
//         return <Navigate to="/unauthorized" state={location.pathname}></Navigate>
//     }

//     return children;
// };

// export default AdminRoute;

// import UseAuth from "@/Hooks/useAuth";
// import useUserRole from "@/Hooks/useUserRole";
// import React, { Children } from "react";
// import { Navigate } from "react-router";

// const AdminRoute = ({ children }) => {
//   const { user, loading } = UseAuth();
//   const { role, roleLoading } = useUserRole();

//   if (loading || roleLoading) {
//     return <span className="loading loading-spinner loading-xl"></span>;
//   }
//   if (!user) {
//     return <Navigate to="/auth/login" state={location.pathname}></Navigate>;
//   }

//   if (!user || role !== "admin") {
//     return (
//       <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
//     );
//   }

//   return children;
// };

// export default AdminRoute;

import useUserRole from '@/Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only allow admins
  if (role === 'admin') {
    return children;
  }

  // Redirect to forbidden page if not authorized
  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default AdminRoute;
