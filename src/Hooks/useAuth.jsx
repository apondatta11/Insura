import { AuthContext } from '@/Provider/AuthContext';
import React, { use } from 'react';

const UseAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo
};

export default UseAuth;