import Loading from '@/Components/Loading/Loading';
import { AuthContext } from '@/Provider/AuthContext';
import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();
    
    if(loading){
        return <Loading></Loading>
    }

    if(!user){
        return <Navigate to="/auth/login" state={location.pathname}></Navigate>
    }

    return children;
};

export default PrivateRoute;