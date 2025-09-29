//when user login save user to database
import React from 'react';
import useAuth from '@/Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';
import useAxios from '@/Hooks/useAxios';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosInstance = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [isLoading, setIsLoading] = React.useState(false);

    const saveUserToDB = async (user) => {
        try {
            const userData = {
                name: user.displayName || 'User',
                email: user.email,
                photoURL: user.photoURL || '/default-avatar.png',
                role: 'customer',
                createdAt: new Date(),
                lastLoggedAt: new Date()
            };

            await axiosInstance.put(`/users/${user.email}`, userData);
            console.log('User saved/updated in database via social login');
        } catch (error) {
            console.error('Error saving user to database:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        
        try {
            const result = await googleSignIn();
            console.log('Google sign-in successful:', result.user);
            
            await saveUserToDB(result.user);
            
            toast.success('✅ Google Sign-In Successful! Welcome to Insura!');
            
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 2000);
            
        } catch (error) {
            console.error('Google sign-in error:', error);
            toast.error('❌ Google Sign-In Failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-input bg-background/50 hover:bg-accent/20 
                           text-foreground font-semibold rounded-lg transition-all duration-300 focus:outline-none 
                           focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#DB4437]/30 border-t-[#DB4437] rounded-full animate-spin" />
                        <span>Connecting...</span>
                    </div>
                ) : (
                    <>
                        <FaGoogle className="h-5 w-5 text-foreground" />
                        <span>Continue with Google</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialLogin;

