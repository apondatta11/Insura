import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuth from '@/Hooks/useAuth';
import SocialLogin from './SocialLogin';
import axios from 'axios';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const { createUser, updateUserProfile, user } = useAuth(); 
    const [profilePic, setProfilePic] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageError, setImageError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const validatePassword = (value) => {
        if (value.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/(?=.*[a-z])/.test(value)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
            return 'Password must contain at least one uppercase letter';
        }
        return true;
    };

    const onSubmit = async (data) => {
        if (imageError) {
            toast.error('Please fix the image error before submitting');
            return;
        }

        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            console.log('Starting registration process...');

            const userCredential = await createUser(data.email, data.password);
            console.log('User created:', userCredential.user.email);
            // Update user profile
            const userProfile = {
                displayName: data.name.trim(),
                photoURL: profilePic || '/default-avatar.png'
            };
            
            await updateUserProfile(userProfile);
            console.log('Profile updated');

            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Registration successful! ', {
                position: "top-right",
                autoClose: 3000,
                pauseOnHover: false,
            });
            setTimeout(() => {
                console.log('Navigating to:', from);
                navigate(from, { replace: true });
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = "Registration failed. Please try again.";
            
            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered. Please log in or use another email.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password is too weak. Please choose a stronger password.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email address. Please check your email format.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Please check your internet connection.";
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
            
            toast.error(` ${errorMessage}`, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;
        
        setImageError('');
        clearErrors('profileImage');
    
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        
        if (!validTypes.includes(image.type)) {
            const errorMsg = 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
            setImageError(errorMsg);
            setTimeout(() => {
                toast.error(errorMsg, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }, 100);
            
            e.target.value = '';
            return;
        }
        
        if (image.size > maxSize) {
            const errorMsg = 'Image size too large. Please select an image under 5MB.';
            setImageError(errorMsg);
            
            setTimeout(() => {
                toast.error(errorMsg, {
                    position: "top-right",
                    autoClose: 4000,
                });
            }, 100);
            
            e.target.value = '';
            return;
        }

        setIsUploading(true);
        setImageError('');
        
        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary configuration is missing.');
            }

            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', uploadPreset);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
            const res = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            if (res.data.secure_url) {
                setProfilePic(res.data.secure_url);
                toast.success('Profile picture uploaded successfully!');
            } else {
                throw new Error('Upload failed: No URL returned');
            }
            
        } catch (err) {
            console.error('Upload error:', err);
            const errorMsg = 'Image upload failed. Please try again.';
            setImageError(errorMsg);
            toast.error(` ${errorMsg}`);
        } finally {
            setIsUploading(false);
        }
    };

    const removeProfilePic = () => {
        setProfilePic('');
        setImageError('');
        clearErrors('profileImage');
        toast.info('🗑️ Profile picture removed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
            <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-2">Join our travel community</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { 
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <label className={`flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-full cursor-pointer transition-all ${
                                        isUploading 
                                            ? 'border-muted-foreground bg-muted cursor-not-allowed opacity-50' 
                                            : imageError 
                                            ? 'border-destructive bg-destructive/10' 
                                            : 'border-accent hover:bg-accent/10 hover:border-primary'
                                    }`}>
                                        {profilePic ? (
                                            <img 
                                                src={profilePic} 
                                                alt="Profile preview" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <FaCloudUploadAlt className="h-5 w-5 mb-1" />
                                                <span className="text-xs">Upload</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            accept="image/*"
                                            disabled={isUploading}
                                        />
                                    </label>
                                    {profilePic && !isUploading && (
                                        <button
                                            type="button"
                                            onClick={removeProfilePic}
                                            className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90 transition-colors"
                                            title="Remove photo"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {isUploading ? 'Uploading...' : 'JPEG, PNG, GIF up to 5MB'}
                                    </p>
                                    {/* Display image error */}
                                    {imageError && (
                                        <p className="text-sm text-destructive mt-1">{imageError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address *
                            </label>
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
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', { 
                                        required: 'Password is required',
                                        validate: validatePassword
                                    })}
                                    className="w-full px-4 py-3 pr-10 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                            )}
                            <div className="mt-2 text-xs text-muted-foreground">
                                Password must contain:
                                <ul className="list-disc list-inside ml-2">
                                    <li className={errors.password?.message?.includes('6 characters') ? 'text-destructive' : ''}>
                                        At least 6 characters
                                    </li>
                                    <li className={errors.password?.message?.includes('lowercase') ? 'text-destructive' : ''}>
                                        One lowercase letter
                                    </li>
                                    <li className={errors.password?.message?.includes('uppercase') ? 'text-destructive' : ''}>
                                        One uppercase letter
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !!imageError}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="w-4 h-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Rest of your component remains the same */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            to="/auth/login"
                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-card text-muted-foreground">
                                Or You can choose to
                            </span>
                        </div>
                    </div>

                    <SocialLogin />
                </div>
            </div>
        </div>
    );
};

export default Register;