// src/pages/Profile.jsx
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '@/Hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import useAuth from '@/Hooks/useAuth';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user, updateUserProfile, role } = useAuth();

  // Fetch user profile data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile', user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: userData?.name || user?.displayName || '',
        email: user?.email || '',
        photoURL: userData?.photoURL || user?.photoURL || '/api/placeholder/128/128'
      });
    }
  }, [user, userData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await axiosSecure.put(`/users/${user?.email}`, profileData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['user-profile']);
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoURL: previewURL
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    // Reset to original values
    setFormData({
      name: userData?.name || user?.displayName || '',
      email: user?.email || '',
      photoURL: userData?.photoURL || user?.photoURL || '/api/placeholder/128/128'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update in Firebase first
      if (formData.name !== user?.displayName || formData.photoURL !== user?.photoURL) {
        await updateUserProfile({
          displayName: formData.name,
          photoURL: formData.photoURL
        });
      }

      // Prepare data for MongoDB
      const profileData = {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL,
        role: userData?.role || role,
        lastLoggedAt: new Date(),
        updatedAt: new Date()
      };

      // Update in MongoDB
      updateMutation.mutate(profileData);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + error.message);
    }
  };

  const getRoleBadge = () => {
    const userRole = userData?.role || role;
    
    return (
      <div className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${
        userRole === 'admin' ? 'bg-destructive text-destructive-foreground' :
        userRole === 'agent' ? 'bg-warning text-warning-foreground' :
        'bg-success text-success-foreground'
      }`}>
        {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
      </div>
    );
  };

  const getLastLoginInfo = () => {
    if (userData?.lastLoggedAt) {
      return new Date(userData.lastLoggedAt).toLocaleString();
    }
    
    const lastSignInTime = user?.metadata?.lastSignInTime;
    if (lastSignInTime) {
      return new Date(lastSignInTime).toLocaleString();
    }
    
    return 'Recently';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Profile - Insurance Platform</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight mb-3">
            Profile Settings
          </h1>
          <p className="text-muted-foreground font-sans text-lg">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-sidebar border-b border-border p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Personal Information
                </h2>
                <p className="text-muted-foreground font-sans mt-1">
                  Update your personal details and profile picture
                </p>
              </div>
              {getRoleBadge()}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={formData.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-border shadow-sm"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    {formData.name || 'No name set'}
                  </h3>
                  <p className="text-muted-foreground font-sans mb-3">{formData.email}</p>
                  <div className="badge badge-outline font-sans">
                    Last login: {getLastLoginInfo()}
                  </div>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-3 font-sans">
                      Click the camera icon to update your profile picture
                    </p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name Field */}
                <div>
                  <label className="label font-sans text-sm font-medium text-foreground">
                    Full Name {isEditing && <span className="text-destructive">*</span>}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="input input-bordered w-full font-sans bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-sidebar rounded-lg border border-border">
                      <p className="font-sans text-foreground">
                        {formData.name || 'No name set'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="label font-sans text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <p className="font-sans text-muted-foreground">
                      {formData.email}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-sans">
                    Email cannot be changed
                  </p>
                </div>

                {/* Role Field */}
                <div>
                  <label className="label font-sans text-sm font-medium text-foreground">
                    Account Role
                  </label>
                  <div className="p-3 bg-sidebar w-1/3 rounded-lg border border-border">
                    {getRoleBadge()}
                  </div>
                </div>

                {/* Last Login Field */}
                <div>
                  <label className="label font-sans text-sm font-medium text-foreground">
                    Last Login
                  </label>
                  <div className="p-3 bg-sidebar rounded-lg border border-border">
                    <p className="font-sans text-foreground">
                      {getLastLoginInfo()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="btn btn-primary font-sans text-primary-foreground px-8"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      type="submit"
                      disabled={updateMutation.isLoading}
                      className="btn btn-success font-sans text-success-foreground flex-1"
                    >
                      {updateMutation.isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-ghost font-sans text-foreground border-border flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;