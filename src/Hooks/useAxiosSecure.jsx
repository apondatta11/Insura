import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
            // console.log('Adding token to request:', user.accessToken ? 'Token exists' : 'No token');
        } else {
            console.log('No user token available');
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.response?.status;
        console.log('API Error Status:', status);
        
        if (status === 403) {
            console.log('403 Forbidden - navigating to forbidden page');
            navigate('/forbidden');
        }
        else if (status === 401) {
            console.log('401 Unauthorized - logging out');
            logOut()
                .then(() => {
                    navigate('/auth/login');
                })
                .catch(() => { });
        }

        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;