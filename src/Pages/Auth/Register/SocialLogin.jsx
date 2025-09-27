// import React from 'react';
// import useAuth from '@/Hooks/useAuth';
// import { useLocation, useNavigate } from 'react-router';
// import { FaGoogle } from 'react-icons/fa';
// import { showErrorToast, showSuccessToast } from '@/Utilities/Toasterror';

// const SocialLogin = () => {
//     const { googleSignIn } = useAuth();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const from = location.state?.from?.pathname || '/';
//     const [isLoading, setIsLoading] = React.useState(false);

//     const handleGoogleSignIn = () => {
//         setIsLoading(true);
        
//         googleSignIn()
//             .then((result) => {
//                 console.log('Google sign-in successful:', result.user);
//                 showSuccessToast("Google Sign-In Successful");
                
//                 navigate(from, { replace: true });
//             })
//             .catch(error => {
//                 console.error('Google sign-in error:', error);
//                 showErrorToast('Google Sign-In Failed. Please try again.');
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     }

//     return (
//         <div className="space-y-4">
//             <button
//                 onClick={handleGoogleSignIn}
//                 disabled={isLoading}
//                 className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-input bg-background hover:bg-accent/10 text-foreground font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
//             >
//                 {isLoading ? (
//                     <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                 ) : (
//                     <>
//                         <FaGoogle className="h-5 w-5 text-[#DB4437]" />
//                         <span>Continue with Google</span>
//                     </>
//                 )}
//             </button>
//         </div>
//     );
// };

// export default SocialLogin;

import React from 'react';
import useAuth from '@/Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [isLoading, setIsLoading] = React.useState(false);

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        
        googleSignIn()
            .then((result) => {
                console.log('Google sign-in successful:', result.user);
                toast.success('✅ Google Sign-In Successful!');
                navigate(from, { replace: true });
            })
            .catch(error => {
                console.error('Google sign-in error:', error);
                toast.error('❌ Google Sign-In Failed. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
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