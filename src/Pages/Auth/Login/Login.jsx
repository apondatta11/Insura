//when user login save user to database 
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../Register/SocialLogin';
import useAuth from '@/Hooks/useAuth';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import useAxios from '@/Hooks/useAxios';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const from = location.state?.from || '/';
    const [showPassword, setShowPassword] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            console.log('User saved/updated in database');
        } catch (error) {
            console.error('Error saving user to database:', error);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const userCredential = await signIn(data.email, data.password);
            const user = userCredential.user;
            
            await saveUserToDB(user);
            
            toast.success('✅ Login successful! Welcome back!');
            
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 2000);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = "Login failed. Please check your credentials.";
            
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email address format.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
            }
            
            toast.error(`❌ ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-sidebar to-muted/20">
            <div className="w-full max-w-md">
                {/* Animated Card */}
                <div className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 overflow-hidden transform hover:shadow-xl transition-all duration-300">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                            <FaUser className="text-2xl text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-white/90 mt-1 text-sm">Sign in to continue your journey</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                    <span className="flex items-center gap-2">
                                        <FaEnvelope className="text-primary/80" />
                                        Email Address
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                        className="w-full px-4 py-3 pl-10 rounded-lg border border-input bg-background/50 
                                                   focus:ring-2 focus:ring-primary/50 focus:border-primary 
                                                   transition-all duration-200 placeholder:text-muted-foreground/60"
                                        placeholder="your@email.com"
                                    />
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60" />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive animate-pulse">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                    <span className="flex items-center gap-2">
                                        <FaLock className="text-primary/80" />
                                        Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', { 
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                        className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-input bg-background/50 
                                                   focus:ring-2 focus:ring-primary/50 focus:border-primary 
                                                   transition-all duration-200 placeholder:text-muted-foreground/60"
                                        placeholder="••••••••"
                                    />
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive animate-pulse">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Forgot password link */}
                            <div className="flex justify-end">
                                <Link
                                    to={`/auth/forgot-password?email=${encodeURIComponent(emailValue || '')}`}
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary 
                                           text-primary-foreground font-semibold rounded-lg transition-all duration-300 
                                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
                                           disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] 
                                           active:scale-[0.98] shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing In...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Register link */}
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            New to Insura?{' '}
                            <Link
                                to="/auth/register"
                                state={{ from }}
                                className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                            >
                                Create an account
                            </Link>
                        </div>

                        {/* Social login divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-card text-muted-foreground font-medium">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social login buttons */}
                        <SocialLogin />
                    </div>
                </div>

                {/* Footer note */}
                <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground/70">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;