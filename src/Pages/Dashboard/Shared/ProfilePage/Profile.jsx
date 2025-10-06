import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import useAuth from "@/Hooks/useAuth";
import {
  Camera,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  Upload,
  CloudUpload,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { ProfileLoading } from "@/Components/Loading/Loading";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user, updateUserProfile } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (user && userData) {
      setFormData({
        name: userData?.name || user?.displayName || "",
        email: user?.email || "",
        photoURL: userData?.photoURL || user?.photoURL || "",
      });
    }
  }, [user, userData]);

  const handleImageUpload = async (file) => {
    setImageError("");

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      const errorMsg =
        "Please select a valid image file (JPEG, PNG, GIF, WebP)";
      setImageError(errorMsg);
      toast.error(`  ${errorMsg}`);
      return null;
    }

    if (file.size > maxSize) {
      const errorMsg =
        "Image size too large. Please select an image under 5MB.";
      setImageError(errorMsg);
      toast.error(`  ${errorMsg}`);
      return null;
    }

    setIsUploading(true);

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      if (res.data.secure_url) {
        toast.success(" Profile picture uploaded successfully!");
        return res.data.secure_url;
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = "Image upload failed. Please try again.";
      setImageError(errorMsg);
      toast.error(`  ${errorMsg}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setFormData((prev) => ({
        ...prev,
        photoURL: uploadedUrl,
      }));
      setSelectedFile(file);
    }
  };

  const removeProfilePic = () => {
    setFormData((prev) => ({
      ...prev,
      photoURL: "",
    }));
    setSelectedFile(null);
    setImageError("");
    toast.info("   Profile picture removed");
  };

  const updateMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await axiosSecure.put(
        `/users/${user?.email}`,
        profileData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!", {
        description: "Your profile information has been saved.",
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });
      queryClient.invalidateQueries(["user-profile"]);
      setIsSubmitting(false);
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error.response?.data?.message || "Please try again later.",
      });
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setImageError("");
    setFormData({
      name: userData?.name || user?.displayName || "",
      email: user?.email || "",
      photoURL: userData?.photoURL || user?.photoURL || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required", {
        description: "Please enter your full name.",
      });
      return;
    }

    if (imageError) {
      toast.error("Please fix the image error before saving");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPhotoURL = formData.photoURL;

      if (selectedFile) {
        const uploadedUrl = await handleImageUpload(selectedFile);
        if (uploadedUrl) {
          finalPhotoURL = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      if (
        formData.name !== user?.displayName ||
        finalPhotoURL !== user?.photoURL
      ) {
        await updateUserProfile({
          displayName: formData.name,
          photoURL: finalPhotoURL,
        });
      }

      const profileData = {
        name: formData.name.trim(),
        email: formData.email,
        photoURL: finalPhotoURL,
        role: userData?.role,
        lastLoggedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateMutation.mutate(profileData);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = () => {
    const userRole = userData?.role;
    const roleConfig = {
      admin: {
        label: "Administrator",
        class:
          "bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        icon: "🛡️",
      },
      agent: {
        label: "Insurance Agent",
        class:
          "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        icon: "👨‍💼",
      },
      customer: {
        label: "Customer",
        class:
          "bg-green-500/15 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        icon: "👤",
      },
    };

    const config = roleConfig[userRole] || roleConfig.customer;

    return (
      <Badge variant="outline" className={`${config.class} font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </Badge>
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

    return "Recently";
  };

  const getMemberSince = () => {
    if (userData?.createdAt) {
      return new Date(userData.createdAt).toLocaleDateString();
    }

    const creationTime = user?.metadata?.creationTime;
    if (creationTime) {
      return new Date(creationTime).toLocaleDateString();
    }

    return "Recently";
  };

  if (isLoading) {
    return <ProfileLoading></ProfileLoading>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-purple-50/20 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10 p-6">
      <Helmet>
        <title>Profile - Insurance Platform</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto">
            Manage your personal information and account preferences to keep
            your insurance profile up to date
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="font-sans text-base mt-2">
                  Update your profile details and manage your account
                  information
                </CardDescription>
              </div>
              {getRoleBadge()}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 mb-8 p-6 bg-sidebar/30 rounded-xl border border-border/50">
                <div className="flex-shrink-0 relative">
                  <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                    <AvatarImage src={formData.photoURL} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {formData.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 rounded-full shadow-lg border-2 border-background"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </Button>
                      {formData.photoURL && (
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={removeProfilePic}
                          className="absolute -top-2 -right-2 rounded-full shadow-lg border-2 border-background w-6 h-6"
                          disabled={isUploading}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>

                <div className="text-center sm:text-left flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-serif font-semibold text-foreground">
                      {formData.name || "No name set"}
                    </h3>
                    <p className="text-muted-foreground font-sans text-lg flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {getMemberSince()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Last login: {getLastLoginInfo()}</span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground font-sans flex items-center gap-2">
                        <CloudUpload className="w-4 h-4" />
                        Click the camera icon to upload a new profile picture
                      </p>
                      {imageError && (
                        <p className="text-sm text-destructive font-sans">
                          {imageError}
                        </p>
                      )}
                      {isUploading && (
                        <p className="text-sm text-primary font-sans flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          Uploading image to Cloudinary...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name{" "}
                    {isEditing && <span className="text-destructive">*</span>}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="font-sans"
                      required
                    />
                  ) : (
                    <div className="p-3 bg-sidebar rounded-lg border border-border min-h-[42px] flex items-center">
                      <span className="font-sans text-foreground">
                        {formData.name || "No name set"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="p-3 bg-muted rounded-lg border border-border min-h-[42px] flex items-center">
                    <span className="font-sans text-muted-foreground">
                      {formData.email}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans">
                    Email address cannot be changed
                  </p>
                </div>

                {/* Role Field (Read-only) */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Account Role
                  </Label>
                  <div className="min-h-[42px] flex items-center">
                    {getRoleBadge()}
                  </div>
                </div>

                {/* Member Since Field (Read-only) */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <div className="p-3 bg-sidebar rounded-lg border border-border min-h-[42px] flex items-center">
                    <span className="font-sans text-foreground">
                      {getMemberSince()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="font-sans gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUploading || !!imageError}
                      className="font-sans gap-2 flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      className="font-sans gap-2 flex-1"
                      disabled={isSubmitting || isUploading}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
