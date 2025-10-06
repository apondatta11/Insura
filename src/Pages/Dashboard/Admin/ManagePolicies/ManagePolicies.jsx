import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaMagic,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { GiLifeBar } from "react-icons/gi";
import { Camera, Upload, X } from "lucide-react";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import axios from "axios";

const ManagePolicies = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isDialogOpen && !editingPolicy) {
      reset({
        title: "",
        category: "",
        description: "",
        minAge: "",
        maxAge: "",
        minCoverage: "",
        maxCoverage: "",
        durationOptions: "",
        basePremiumRate: "",
        image: "",
      });
      setSelectedCategory("");
      setCustomCategory("");
    }
  }, [isDialogOpen, editingPolicy, reset]);

  useEffect(() => {
    if (editingPolicy && isDialogOpen) {
      setValue("title", editingPolicy.title);
      setValue("description", editingPolicy.description);
      setValue("minAge", editingPolicy.minAge);
      setValue("maxAge", editingPolicy.maxAge);
      setValue("minCoverage", editingPolicy.coverage?.minAmount);
      setValue("maxCoverage", editingPolicy.coverage?.maxAmount);
      setValue("durationOptions", editingPolicy.duration?.options?.join(", "));
      setValue("basePremiumRate", editingPolicy.premiumDetails?.baseRate);
      setValue("image", editingPolicy.image);

      const predefinedCategories = [
        "Term Life",
        "Whole Life",
        "Senior Plan",
        "Family Plan",
        "Child Plan",
      ];
      if (predefinedCategories.includes(editingPolicy.category)) {
        setSelectedCategory(editingPolicy.category);
        setCustomCategory("");
        setValue("category", editingPolicy.category);
      } else {
        setSelectedCategory("other");
        setCustomCategory(editingPolicy.category);
        setValue("category", editingPolicy.category);
      }
    }
  }, [editingPolicy, isDialogOpen, setValue]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value === "other") {
      setValue("category", customCategory);
    } else {
      setCustomCategory("");
      setValue("category", value);
    }
  };

  const handleCustomCategoryChange = (value) => {
    setCustomCategory(value);
    if (selectedCategory === "other") {
      setValue("category", value);
    }
  };

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ["policies", "admin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/policies?admin=true");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (policyId) => {
      const res = await axiosSecure.delete(`/policies/${policyId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      toast.success("Policy deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete policy");
    },
  });

  const policyMutation = useMutation({
    mutationFn: async (formData) => {
      if (editingPolicy) {
        const res = await axiosSecure.put(
          `/policies/${editingPolicy._id}`,
          formData
        );
        return res.data;
      } else {
        const res = await axiosSecure.post("/policies", formData);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      setIsDialogOpen(false);
      setEditingPolicy(null);
      setSelectedCategory("");
      setCustomCategory("");
      toast.success(
        editingPolicy
          ? "Policy updated successfully"
          : "Policy added successfully"
      );
    },
    onError: (error) => {
      console.error("Policy mutation error:", error);
      toast.error("Operation failed");
    },
  });

  const handleDelete = async (policy) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${policy.title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#fff",
      customClass: {
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
      focusConfirm: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          resolve();
        });
      },
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(policy._id);
    }
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPolicy(null);
    setIsDialogOpen(true);
  };

  const confirmUpdate = async (data) => {
    if (editingPolicy) {
      setIsDialogOpen(false);

      const result = await Swal.fire({
        title: "Confirm Update",
        text: `Are you sure you want to update "${editingPolicy.title}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
        background: "#1f2937",
        color: "#fff",
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          confirmButton: "swal2-confirm",
          cancelButton: "swal2-cancel",
        },
        focusConfirm: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            resolve();
          });
        },
      });

      if (result.isConfirmed) {
        submitFormData(data);
      } else {
        setIsDialogOpen(true);
      }
    } else {
      submitFormData(data);
    }
  };



  const handleFormSubmit = (data) => {
    console.log("Data received from form:", data);

    const finalCategory =
      selectedCategory === "other" ? customCategory : data.category;

    const policyData = {
      title: data.title,
      category: finalCategory,
      description: data.description,
      minAge: parseInt(data.minAge),
      maxAge: parseInt(data.maxAge),
      coverage: {
        minAmount: parseInt(data.minCoverage),
        maxAmount: parseInt(data.maxCoverage),
      },
      duration: {
        options: data.durationOptions.split(",").map((d) => parseInt(d.trim())),
      },
      premiumDetails: {
        baseRate: parseFloat(data.basePremiumRate),
      },
      image: data.image || "/default-policy.jpg",
      benefits: ["Death Benefit", "Tax Free", "Critical Illness Cover"],
      status: "active",
    };

    console.log(" Final policy data to send to backend:", policyData);

    policyMutation.mutate(policyData);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPolicy(null);
    setSelectedCategory("");
    setCustomCategory("");
  };

  const getBadgeColor = (category) => {
    const colorMap = {
      "Term Life": "bg-blue-100 text-blue-800 border-blue-200",
      "Whole Life": "bg-green-100 text-green-800 border-green-200",
      "Senior Plan": "bg-purple-100 text-purple-800 border-purple-200",
      "Family Plan": "bg-pink-100 text-pink-800 border-pink-200",
      "Child Plan": "bg-orange-100 text-orange-800 border-orange-200",
    };

    return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center items-center space-x-3">
          <GiLifeBar className="text-4xl text-primary animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Policy Management
          </h1>
          <FaShieldAlt className="text-4xl text-purple-600 animate-bounce" />
        </div>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Craft exceptional insurance experiences
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Manage Policies</h2>
          <p className="text-muted-foreground text-sm">
            Create, edit, and manage insurance policies
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <FaPlus className="mr-2" />
              <FaMagic className="mr-2 animate-pulse" />
              Add New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-2 border-border shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {editingPolicy ? "✨ Edit Policy" : "🚀 Create New Policy"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingPolicy
                  ? "Refine and update policy details"
                  : "Craft a new insurance masterpiece"}
              </DialogDescription>
            </DialogHeader>

            <PolicyForm
              register={register}
              errors={errors}
              isSubmitting={isSubmitting || policyMutation.isLoading}
              editingPolicy={editingPolicy}
              onSubmit={handleFormSubmit} // Use handleFormSubmit directly
              onClose={closeDialog}
              selectedCategory={selectedCategory}
              customCategory={customCategory}
              onCategoryChange={handleCategoryChange}
              onCustomCategoryChange={handleCustomCategoryChange}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Policies Table - Horizontal Scroll on Mobile */}
      <Card className="bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Policy Portfolio
          </CardTitle>
          <CardDescription className="text-sm sm:text-lg">
            {policies.length} policies crafted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <GiLifeBar className="text-6xl text-muted-foreground mx-auto" />
              <p className="text-lg text-muted-foreground">
                No policies found. Create your first policy!
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10">
                    <TableRow>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Policy Title
                      </TableHead>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Category
                      </TableHead>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Coverage Range
                      </TableHead>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Age Range
                      </TableHead>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Premium Rate
                      </TableHead>
                      <TableHead className="font-bold text-primary text-xs sm:text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy, index) => (
                      <TableRow
                        key={policy._id}
                        className={`hover:bg-primary/5 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-muted/20" : ""
                        }`}
                      >
                        <TableCell className="font-semibold text-xs sm:text-sm">
                          <div className="flex items-center space-x-2 min-w-[120px]">
                            <FaShieldAlt className="text-primary flex-shrink-0" />
                            <span className="break-words line-clamp-2">
                              {policy.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <Badge
                            variant="secondary"
                            className={`${getBadgeColor(
                              policy.category
                            )} px-2 py-1 border text-xs max-w-full break-words whitespace-normal text-center`}
                          >
                            {policy.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="font-mono min-w-[140px]">
                            ${policy.coverage?.minAmount?.toLocaleString()} - $
                            {policy.coverage?.maxAmount?.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="flex items-center space-x-1 min-w-[100px]">
                            <span className="font-semibold">
                              {policy.minAge}
                            </span>
                            <span>→</span>
                            <span className="font-semibold">
                              {policy.maxAge}
                            </span>
                            <span className="text-muted-foreground">yrs</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className="font-bold text-green-600 min-w-[60px] inline-block">
                            {policy.premiumDetails?.baseRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="flex gap-1 sm:gap-2 flex-nowrap min-w-[80px]">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(policy)}
                              disabled={deleteMutation.isLoading}
                              className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <FaEdit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(policy)}
                              disabled={deleteMutation.isLoading}
                              className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:scale-105 transition-transform"
                            >
                              {deleteMutation.isLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <FaTrash className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Policy Form Component with Cloudinary Upload
const PolicyForm = ({ 
    register, 
    errors, 
    isSubmitting, 
    editingPolicy, 
    onSubmit, 
    onClose,
    selectedCategory,
    customCategory,
    onCategoryChange,
    onCustomCategoryChange
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [policyImage, setPolicyImage] = useState('');
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (editingPolicy?.image) {
            setPolicyImage(editingPolicy.image);
        } else {
            setPolicyImage('');
        }
    }, [editingPolicy]);

    const handleImageUpload = async (file) => {
        setImageError('');
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        
        if (!validTypes.includes(file.type)) {
            const errorMsg = 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
            setImageError(errorMsg);
            toast.error(`${errorMsg}`);
            return null;
        }
        
        if (file.size > maxSize) {
            const errorMsg = 'Image size too large. Please select an image under 5MB.';
            setImageError(errorMsg);
            toast.error(`${errorMsg}`);
            return null;
        }

        setIsUploading(true);
        
        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            
            if (!cloudName || !uploadPreset) {
                throw new Error('Cloudinary configuration is missing.');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
            const res = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
            });

            if (res.data.secure_url) {
                const imageUrl = res.data.secure_url;
                setPolicyImage(imageUrl);
                toast.success('Policy image uploaded successfully!');
                return imageUrl;
            } else {
                throw new Error('Upload failed: No URL returned');
            }
            
        } catch (err) {
            console.error('Upload error:', err);
            const errorMsg = 'Image upload failed. Please try again.';
            setImageError(errorMsg);
            toast.error(`${errorMsg}`);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        await handleImageUpload(file);
    };

    const removePolicyImage = () => {
        setPolicyImage('');
        setImageError('');
        toast('   Policy image removed', { icon: '  ' });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const finalData = {
            ...data,
            image: policyImage || editingPolicy?.image || '/default-policy.jpg'
        };
        
        console.log('Submitting data with image:', finalData.image);
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Policy Title */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold">
                        Policy Title *
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        defaultValue={editingPolicy?.title || ''}
                        placeholder="e.g., Term Life Insurance Premium"
                        required
                    />
                </div>

                {/* Category */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="category" className="text-sm font-semibold">
                        Category *
                    </Label>
                    <div className="space-y-2">
                        <Select value={selectedCategory} onValueChange={onCategoryChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Term Life">Term Life</SelectItem>
                                <SelectItem value="Whole Life">Whole Life</SelectItem>
                                <SelectItem value="Senior Plan">Senior Plan</SelectItem>
                                <SelectItem value="Family Plan">Family Plan</SelectItem>
                                <SelectItem value="Child Plan">Child Plan</SelectItem>
                                <SelectItem value="other">Other (Custom)</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {selectedCategory === 'other' && (
                            <Input
                                name="customCategory"
                                value={customCategory}
                                onChange={(e) => onCustomCategoryChange(e.target.value)}
                                placeholder="Enter custom category"
                                className="w-full"
                            />
                        )}
                    </div>
                </div>

                {/* Age Range */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="minAge" className="text-sm font-semibold">
                        Minimum Age *
                    </Label>
                    <Input
                        id="minAge"
                        name="minAge"
                        type="number"
                        defaultValue={editingPolicy?.minAge || ''}
                        placeholder="Enter minimum age"
                        min="18"
                        max="65"
                        required
                    />
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="maxAge" className="text-sm font-semibold">
                        Maximum Age *
                    </Label>
                    <Input
                        id="maxAge"
                        name="maxAge"
                        type="number"
                        defaultValue={editingPolicy?.maxAge || ''}
                        placeholder="Enter maximum age"
                        min="18"
                        max="100"
                        required
                    />
                </div>

                {/* Coverage Range */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="minCoverage" className="text-sm font-semibold">
                        Minimum Coverage ($) *
                    </Label>
                    <Input
                        id="minCoverage"
                        name="minCoverage"
                        type="number"
                        defaultValue={editingPolicy?.coverage?.minAmount || ''}
                        placeholder="Enter minimum coverage"
                        min="10000"
                        required
                    />
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="maxCoverage" className="text-sm font-semibold">
                        Maximum Coverage ($) *
                    </Label>
                    <Input
                        id="maxCoverage"
                        name="maxCoverage"
                        type="number"
                        defaultValue={editingPolicy?.coverage?.maxAmount || ''}
                        placeholder="Enter maximum coverage"
                        min="10000"
                        required
                    />
                </div>

                {/* Duration Options */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="durationOptions" className="text-sm font-semibold">
                        Duration Options (years, comma separated) *
                    </Label>
                    <Input
                        id="durationOptions"
                        name="durationOptions"
                        defaultValue={editingPolicy?.duration?.options?.join(', ') || ''}
                        placeholder="e.g., 10, 15, 20, 25, 30"
                        required
                    />
                </div>

                {/* Premium Rate */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="basePremiumRate" className="text-sm font-semibold">
                        Base Premium Rate (%) *
                    </Label>
                    <Input
                        id="basePremiumRate"
                        name="basePremiumRate"
                        type="number"
                        step="0.01"
                        defaultValue={editingPolicy?.premiumDetails?.baseRate || ''}
                        placeholder="Enter premium rate"
                        min="0.1"
                        max="5"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold">
                    Description *
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows="4"
                    defaultValue={editingPolicy?.description || ''}
                    placeholder="Describe the policy benefits, eligibility, and features..."
                    required
                />
            </div>

            {/* Enhanced Image Upload Section */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Policy Image
                </Label>
                
                <div className="flex flex-col sm:flex-row items-start gap-6 p-4 bg-sidebar/30 rounded-xl border border-border/50">
                    {/* Image Preview */}
                    <div className="flex-shrink-0 relative">
                        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center overflow-hidden">
                            {policyImage ? (
                                <img 
                                    src={policyImage} 
                                    alt="Policy preview" 
                                    className="w-full h-full object-cover"
                                />
                            ) : editingPolicy?.image ? (
                                <img 
                                    src={editingPolicy.image} 
                                    alt="Current policy" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <FaCloudUploadAlt className="w-8 h-8 mx-auto mb-2" />
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}
                        </div>
                        
                        {(policyImage || editingPolicy?.image) && (
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={removePolicyImage}
                                className="absolute -top-2 -right-2 rounded-full w-6 h-6 border-2 border-background"
                                disabled={isUploading}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading}
                            />
                            
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                variant="outline"
                                className="w-full sm:w-auto gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload Policy Image
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                Upload a professional image for your policy (JPEG, PNG, GIF, WebP up to 5MB)
                            </p>
                        </div>

                        {imageError && (
                            <p className="text-destructive text-sm flex items-center gap-2">
                                <FaTimes className="w-3 h-3" />
                                {imageError}
                            </p>
                        )}

                        {policyImage && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <FaCheck className="w-3 h-3" />
                                New image ready to be saved!
                            </div>
                        )}

                        {editingPolicy?.image && !policyImage && (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <FaCheck className="w-3 h-3" />
                                Using current image
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Submit Buttons */}
            <div className="flex justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting || isUploading}
                    className="hover:scale-105 transition-transform text-xs sm:text-sm"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSubmitting || isUploading || !!imageError}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                            {editingPolicy ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        <>
                            <FaMagic className="mr-2" />
                            {editingPolicy ? 'Update Policy' : 'Create Policy'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ManagePolicies;
