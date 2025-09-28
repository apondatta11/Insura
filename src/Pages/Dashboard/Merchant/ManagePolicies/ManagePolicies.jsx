
// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-hot-toast';
// import { useForm } from 'react-hook-form';
// import Swal from 'sweetalert2';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
// import { Button } from "@/Components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
// import { Input } from "@/Components/ui/input";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
// import { Label } from '@/Components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
// import { Textarea } from '@/Components/ui/textarea';
// import { FaEdit, FaTrash, FaPlus, FaMagic, FaShieldAlt } from 'react-icons/fa';
// import { GiLifeBar } from 'react-icons/gi';
// import useAxiosSecure from '@/Hooks/useAxiosSecure';

// const ManagePolicies = () => {
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingPolicy, setEditingPolicy] = useState(null);
//     const queryClient = useQueryClient();
//     const axiosSecure = useAxiosSecure();

//     // Form handling with react-hook-form
//     const { 
//         register, 
//         handleSubmit, 
//         reset, 
//         setValue,
//         watch,
//         formState: { errors, isSubmitting } 
//     } = useForm();

//     // Watch form values to persist them
//     const formValues = watch();

//     // Persist form data in localStorage
//     useEffect(() => {
//         if (isDialogOpen && !editingPolicy) {
//             const savedForm = localStorage.getItem('policyFormData');
//             if (savedForm) {
//                 const formData = JSON.parse(savedForm);
//                 Object.keys(formData).forEach(key => {
//                     setValue(key, formData[key]);
//                 });
//             }
//         }
//     }, [isDialogOpen, editingPolicy, setValue]);

//     // Save form data to localStorage on change
//     useEffect(() => {
//         if (isDialogOpen && !editingPolicy && formValues) {
//             const timeoutId = setTimeout(() => {
//                 localStorage.setItem('policyFormData', JSON.stringify(formValues));
//             }, 500);
//             return () => clearTimeout(timeoutId);
//         }
//     }, [formValues, isDialogOpen, editingPolicy]);

//     // Fetch all policies
//     const { data: policies = [], isLoading } = useQuery({
//         queryKey: ['policies'],
//         queryFn: async () => {
//             const res = await axiosSecure.get('/policies');
//             return res.data;
//         }
//     });

//     // Set form values when editing
//     useEffect(() => {
//         if (editingPolicy && isDialogOpen) {
//             setValue('title', editingPolicy.title);
//             setValue('category', editingPolicy.category);
//             setValue('description', editingPolicy.description);
//             setValue('minAge', editingPolicy.minAge);
//             setValue('maxAge', editingPolicy.maxAge);
//             setValue('minCoverage', editingPolicy.coverage?.minAmount);
//             setValue('maxCoverage', editingPolicy.coverage?.maxAmount);
//             setValue('durationOptions', editingPolicy.duration?.options?.join(', '));
//             setValue('basePremiumRate', editingPolicy.premiumDetails?.baseRate);
//             setValue('image', editingPolicy.image);
//         } else if (!editingPolicy && isDialogOpen) {
//             // Set default values for new policy
//             setValue('minAge', 18);
//             setValue('maxAge', 65);
//             setValue('minCoverage', 100000);
//             setValue('maxCoverage', 5000000);
//             setValue('durationOptions', '10, 15, 20, 25, 30');
//             setValue('basePremiumRate', 0.5);
//             setValue('category', 'Term Life');
//         }
//     }, [editingPolicy, isDialogOpen, setValue]);

//     // Delete policy mutation
//     const deleteMutation = useMutation({
//         mutationFn: async (policyId) => {
//             const res = await axiosSecure.delete(`/policies/${policyId}`);
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['policies']);
//             toast.success('Policy deleted successfully');
//         },
//         onError: (error) => {
//             console.error('Delete error:', error);
//             toast.error('Failed to delete policy');
//         }
//     });

//     // Add/Edit policy mutation
//     const policyMutation = useMutation({
//         mutationFn: async (formData) => {
//             if (editingPolicy) {
//                 const res = await axiosSecure.put(`/policies/${editingPolicy._id}`, formData);
//                 return res.data;
//             } else {
//                 const res = await axiosSecure.post('/policies', formData);
//                 return res.data;
//             }
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['policies']);
//             if (!editingPolicy) {
//                 // Clear localStorage only after successful submission for new policies
//                 localStorage.removeItem('policyFormData');
//                 reset(); // Reset form for new entries
//             }
//             setIsDialogOpen(false);
//             setEditingPolicy(null);
//             toast.success(editingPolicy ? 'Policy updated successfully' : 'Policy added successfully');
//         },
//         onError: (error) => {
//             console.error('Policy mutation error:', error);
//             toast.error('Operation failed');
//         }
//     });

//     const handleDelete = async (policy) => {
//         const result = await Swal.fire({
//             title: 'Are you sure?',
//             text: `You are about to delete "${policy.title}". This action cannot be undone!`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'Cancel',
//             background: '#1f2937',
//             color: '#fff',
//             customClass: {
//                 popup: 'rounded-2xl shadow-2xl'
//             }
//         });

//         if (result.isConfirmed) {
//             deleteMutation.mutate(policy._id);
//         }
//     };

//     const handleEdit = (policy) => {
//         setEditingPolicy(policy);
//         setIsDialogOpen(true);
//     };

//     const openAddDialog = () => {
//         setEditingPolicy(null);
//         setIsDialogOpen(true);
//     };

//     const onFormSubmit = (data) => {
//         const policyData = {
//             title: data.title,
//             category: data.category,
//             description: data.description,
//             minAge: parseInt(data.minAge),
//             maxAge: parseInt(data.maxAge),
//             coverage: {
//                 minAmount: parseInt(data.minCoverage),
//                 maxAmount: parseInt(data.maxCoverage)
//             },
//             duration: {
//                 options: data.durationOptions.split(',').map(d => parseInt(d.trim()))
//             },
//             premiumDetails: {
//                 baseRate: parseFloat(data.basePremiumRate)
//             },
//             image: data.image || '/default-policy.jpg',
//             benefits: ['Death Benefit', 'Tax Free', 'Critical Illness Cover'],
//             status: 'active'
//         };

//         policyMutation.mutate(policyData);
//     };

//     const closeDialog = () => {
//         setIsDialogOpen(false);
//         setEditingPolicy(null);
//         if (!editingPolicy) {
//             // Don't clear form data for new policy to allow continuous adding
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 p-4">
//             {/* Header with Magic UI inspired design */}
//             <div className="text-center space-y-4 mb-8">
//                 <div className="flex justify-center items-center space-x-3">
//                     <GiLifeBar className="text-4xl text-primary animate-pulse" />
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                         Policy Management
//                     </h1>
//                     <FaShieldAlt className="text-4xl text-purple-600 animate-bounce" />
//                 </div>
//                 <p className="text-muted-foreground text-lg">
//                     Craft exceptional insurance experiences with magical precision
//                 </p>
//             </div>

//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-semibold">Manage Policies</h2>
//                     <p className="text-muted-foreground">Create, edit, and manage insurance policies</p>
//                 </div>
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                     <DialogTrigger asChild>
//                         <Button 
//                             onClick={openAddDialog}
//                             className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                         >
//                             <FaPlus className="mr-2" />
//                             <FaMagic className="mr-2 animate-pulse" />
//                             Add New Policy
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-muted/30 border-primary/20">
//                         <DialogHeader>
//                             <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                                 {editingPolicy ? '✨ Edit Policy' : '🚀 Create New Policy'}
//                             </DialogTitle>
//                             <DialogDescription className="text-muted-foreground">
//                                 {editingPolicy ? 'Refine and update policy details' : 'Craft a new insurance masterpiece'}
//                             </DialogDescription>
//                         </DialogHeader>
                        
//                         <PolicyForm 
//                             register={register}
//                             errors={errors}
//                             isSubmitting={isSubmitting || policyMutation.isLoading}
//                             editingPolicy={editingPolicy}
//                             onSubmit={handleSubmit(onFormSubmit)}
//                             onClose={closeDialog}
//                         />
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             {/* Enhanced Card with Aceternity UI inspired design */}
//             <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-2xl">
//                 <CardHeader className="text-center">
//                     <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                         Policy Portfolio
//                     </CardTitle>
//                     <CardDescription className="text-lg">
//                         {policies.length} magical policies crafted
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {policies.length === 0 ? (
//                         <div className="text-center py-12 space-y-4">
//                             <GiLifeBar className="text-6xl text-muted-foreground mx-auto" />
//                             <p className="text-xl text-muted-foreground">
//                                 No policies found. Create your first magical policy!
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="rounded-2xl overflow-hidden border border-border/50">
//                             <Table>
//                                 <TableHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10">
//                                     <TableRow>
//                                         <TableHead className="font-bold text-primary">Policy Title</TableHead>
//                                         <TableHead className="font-bold text-primary">Category</TableHead>
//                                         <TableHead className="font-bold text-primary">Coverage Range</TableHead>
//                                         <TableHead className="font-bold text-primary">Age Range</TableHead>
//                                         <TableHead className="font-bold text-primary">Premium Rate</TableHead>
//                                         <TableHead className="font-bold text-primary">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {policies.map((policy, index) => (
//                                         <TableRow 
//                                             key={policy._id} 
//                                             className={`hover:bg-primary/5 transition-colors duration-200 ${
//                                                 index % 2 === 0 ? 'bg-muted/20' : ''
//                                             }`}
//                                         >
//                                             <TableCell className="font-semibold">
//                                                 <div className="flex items-center space-x-2">
//                                                     <FaShieldAlt className="text-primary" />
//                                                     <span>{policy.title}</span>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                                     policy.category === 'Term Life' 
//                                                         ? 'bg-blue-100 text-blue-800' 
//                                                         : policy.category === 'Whole Life'
//                                                         ? 'bg-green-100 text-green-800'
//                                                         : policy.category === 'Senior Plan'
//                                                         ? 'bg-purple-100 text-purple-800'
//                                                         : policy.category === 'Family Plan'
//                                                         ? 'bg-pink-100 text-pink-800'
//                                                         : 'bg-orange-100 text-orange-800'
//                                                 }`}>
//                                                     {policy.category}
//                                                 </span>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="font-mono">
//                                                     ${policy.coverage?.minAmount?.toLocaleString()} - ${policy.coverage?.maxAmount?.toLocaleString()}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex items-center space-x-1">
//                                                     <span className="font-semibold">{policy.minAge}</span>
//                                                     <span>→</span>
//                                                     <span className="font-semibold">{policy.maxAge}</span>
//                                                     <span className="text-muted-foreground">years</span>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <span className="font-bold text-green-600">
//                                                     {policy.premiumDetails?.baseRate}%
//                                                 </span>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex gap-2">
//                                                     <Button 
//                                                         variant="outline" 
//                                                         size="sm"
//                                                         onClick={() => handleEdit(policy)}
//                                                         disabled={deleteMutation.isLoading}
//                                                         className="hover:bg-primary hover:text-primary-foreground transition-colors"
//                                                     >
//                                                         <FaEdit className="w-4 h-4" />
//                                                     </Button>
//                                                     <Button 
//                                                         variant="destructive" 
//                                                         size="sm"
//                                                         onClick={() => handleDelete(policy)}
//                                                         disabled={deleteMutation.isLoading}
//                                                         className="hover:scale-105 transition-transform"
//                                                     >
//                                                         {deleteMutation.isLoading ? (
//                                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                                         ) : (
//                                                             <FaTrash className="w-4 h-4" />
//                                                         )}
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// // Enhanced Policy Form Component
// const PolicyForm = ({ register, errors, isSubmitting, editingPolicy, onSubmit, onClose }) => {
//     return (
//         <form onSubmit={onSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Policy Title */}
//                 <div className="space-y-3">
//                     <Label htmlFor="title" className="text-sm font-semibold">
//                         Policy Title *
//                     </Label>
//                     <Input
//                         id="title"
//                         {...register("title", { required: "Policy title is required" })}
//                         placeholder="e.g., Term Life Insurance Premium"
//                         className={`w-full ${errors.title ? 'border-destructive' : ''}`}
//                     />
//                     {errors.title && (
//                         <p className="text-destructive text-sm">{errors.title.message}</p>
//                     )}
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-3">
//                     <Label htmlFor="category" className="text-sm font-semibold">
//                         Category *
//                     </Label>
//                     <select
//                         id="category"
//                         {...register("category", { required: "Category is required" })}
//                         className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
//                     >
//                         <option value="Term Life">Term Life</option>
//                         <option value="Whole Life">Whole Life</option>
//                         <option value="Senior Plan">Senior Plan</option>
//                         <option value="Family Plan">Family Plan</option>
//                         <option value="Child Plan">Child Plan</option>
//                     </select>
//                     {errors.category && (
//                         <p className="text-destructive text-sm">{errors.category.message}</p>
//                     )}
//                 </div>

//                 {/* Age Range */}
//                 <div className="space-y-3">
//                     <Label htmlFor="minAge" className="text-sm font-semibold">
//                         Minimum Age *
//                     </Label>
//                     <Input
//                         id="minAge"
//                         type="number"
//                         {...register("minAge", { 
//                             required: "Minimum age is required",
//                             min: { value: 18, message: "Minimum age must be at least 18" }
//                         })}
//                         min="18"
//                         max="65"
//                         className={`w-full ${errors.minAge ? 'border-destructive' : ''}`}
//                     />
//                     {errors.minAge && (
//                         <p className="text-destructive text-sm">{errors.minAge.message}</p>
//                     )}
//                 </div>

//                 <div className="space-y-3">
//                     <Label htmlFor="maxAge" className="text-sm font-semibold">
//                         Maximum Age *
//                     </Label>
//                     <Input
//                         id="maxAge"
//                         type="number"
//                         {...register("maxAge", { 
//                             required: "Maximum age is required",
//                             min: { value: 18, message: "Maximum age must be at least 18" }
//                         })}
//                         min="18"
//                         max="100"
//                         className={`w-full ${errors.maxAge ? 'border-destructive' : ''}`}
//                     />
//                     {errors.maxAge && (
//                         <p className="text-destructive text-sm">{errors.maxAge.message}</p>
//                     )}
//                 </div>

//                 {/* Coverage Range */}
//                 <div className="space-y-3">
//                     <Label htmlFor="minCoverage" className="text-sm font-semibold">
//                         Minimum Coverage ($) *
//                     </Label>
//                     <Input
//                         id="minCoverage"
//                         type="number"
//                         {...register("minCoverage", { 
//                             required: "Minimum coverage is required",
//                             min: { value: 10000, message: "Minimum coverage must be at least $10,000" }
//                         })}
//                         min="10000"
//                         className={`w-full ${errors.minCoverage ? 'border-destructive' : ''}`}
//                     />
//                     {errors.minCoverage && (
//                         <p className="text-destructive text-sm">{errors.minCoverage.message}</p>
//                     )}
//                 </div>

//                 <div className="space-y-3">
//                     <Label htmlFor="maxCoverage" className="text-sm font-semibold">
//                         Maximum Coverage ($) *
//                     </Label>
//                     <Input
//                         id="maxCoverage"
//                         type="number"
//                         {...register("maxCoverage", { 
//                             required: "Maximum coverage is required",
//                             min: { value: 10000, message: "Maximum coverage must be at least $10,000" }
//                         })}
//                         min="10000"
//                         className={`w-full ${errors.maxCoverage ? 'border-destructive' : ''}`}
//                     />
//                     {errors.maxCoverage && (
//                         <p className="text-destructive text-sm">{errors.maxCoverage.message}</p>
//                     )}
//                 </div>

//                 {/* Duration Options */}
//                 <div className="space-y-3">
//                     <Label htmlFor="durationOptions" className="text-sm font-semibold">
//                         Duration Options (years, comma separated) *
//                     </Label>
//                     <Input
//                         id="durationOptions"
//                         {...register("durationOptions", { 
//                             required: "Duration options are required",
//                             pattern: {
//                                 value: /^(\d+\s*,\s*)*\d+$/,
//                                 message: "Please enter valid duration options (e.g., 10, 15, 20)"
//                             }
//                         })}
//                         placeholder="e.g., 10, 15, 20, 25, 30"
//                         className={`w-full ${errors.durationOptions ? 'border-destructive' : ''}`}
//                     />
//                     {errors.durationOptions && (
//                         <p className="text-destructive text-sm">{errors.durationOptions.message}</p>
//                     )}
//                 </div>

//                 {/* Premium Rate */}
//                 <div className="space-y-3">
//                     <Label htmlFor="basePremiumRate" className="text-sm font-semibold">
//                         Base Premium Rate (%) *
//                     </Label>
//                     <Input
//                         id="basePremiumRate"
//                         type="number"
//                         step="0.01"
//                         {...register("basePremiumRate", { 
//                             required: "Premium rate is required",
//                             min: { value: 0.1, message: "Premium rate must be at least 0.1%" },
//                             max: { value: 5, message: "Premium rate cannot exceed 5%" }
//                         })}
//                         min="0.1"
//                         max="5"
//                         className={`w-full ${errors.basePremiumRate ? 'border-destructive' : ''}`}
//                     />
//                     {errors.basePremiumRate && (
//                         <p className="text-destructive text-sm">{errors.basePremiumRate.message}</p>
//                     )}
//                 </div>
//             </div>

//             {/* Description */}
//             <div className="space-y-3">
//                 <Label htmlFor="description" className="text-sm font-semibold">
//                     Description *
//                 </Label>
//                 <Textarea
//                     id="description"
//                     rows="4"
//                     {...register("description", { required: "Description is required" })}
//                     placeholder="Describe the policy benefits, eligibility, and features..."
//                     className={`w-full ${errors.description ? 'border-destructive' : ''}`}
//                 />
//                 {errors.description && (
//                     <p className="text-destructive text-sm">{errors.description.message}</p>
//                 )}
//             </div>

//             {/* Image Upload */}
//             <div className="space-y-3">
//                 <Label htmlFor="image" className="text-sm font-semibold">
//                     Policy Image URL
//                 </Label>
//                 <Input
//                     id="image"
//                     {...register("image")}
//                     placeholder="https://example.com/image.jpg"
//                     className="w-full"
//                 />
//             </div>

//             {/* Enhanced Submit Buttons */}
//             <div className="flex justify-end gap-4 pt-6 border-t border-border">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onClose}
//                     disabled={isSubmitting}
//                     className="hover:scale-105 transition-transform"
//                 >
//                     Cancel
//                 </Button>
//                 <Button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
//                 >
//                     {isSubmitting ? (
//                         <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             {editingPolicy ? 'Updating...' : 'Creating...'}
//                         </>
//                     ) : (
//                         <>
//                             <FaMagic className="mr-2" />
//                             {editingPolicy ? 'Update Policy' : 'Create Policy'}
//                         </>
//                     )}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default ManagePolicies;

// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'react-hot-toast';
// import { useForm } from 'react-hook-form';
// import Swal from 'sweetalert2';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { FaEdit, FaTrash, FaPlus, FaMagic, FaShieldAlt } from 'react-icons/fa';
// import { GiLifeBar } from 'react-icons/gi';
// import useAxiosSecure from '@/Hooks/useAxiosSecure';

// const ManagePolicies = () => {
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [editingPolicy, setEditingPolicy] = useState(null);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [customCategory, setCustomCategory] = useState('');
//     const queryClient = useQueryClient();
//     const axiosSecure = useAxiosSecure();

//     // Form handling with react-hook-form
//     const { 
//         register, 
//         handleSubmit, 
//         reset, 
//         setValue,
//         watch,
//         formState: { errors, isSubmitting } 
//     } = useForm();

//     // Watch form values
//     const formValues = watch();

//     // Reset form when opening for new policy
//     useEffect(() => {
//         if (isDialogOpen && !editingPolicy) {
//             reset({
//                 title: '',
//                 category: '',
//                 description: '',
//                 minAge: 18,
//                 maxAge: 65,
//                 minCoverage: 100000,
//                 maxCoverage: 5000000,
//                 durationOptions: '10, 15, 20, 25, 30',
//                 basePremiumRate: 0.5,
//                 image: ''
//             });
//             setSelectedCategory('');
//             setCustomCategory('');
//         }
//     }, [isDialogOpen, editingPolicy, reset]);

//     // Set form values when editing
//     useEffect(() => {
//         if (editingPolicy && isDialogOpen) {
//             setValue('title', editingPolicy.title);
//             setValue('description', editingPolicy.description);
//             setValue('minAge', editingPolicy.minAge);
//             setValue('maxAge', editingPolicy.maxAge);
//             setValue('minCoverage', editingPolicy.coverage?.minAmount);
//             setValue('maxCoverage', editingPolicy.coverage?.maxAmount);
//             setValue('durationOptions', editingPolicy.duration?.options?.join(', '));
//             setValue('basePremiumRate', editingPolicy.premiumDetails?.baseRate);
//             setValue('image', editingPolicy.image);
            
//             // Handle category for editing
//             const predefinedCategories = ['Term Life', 'Whole Life', 'Senior Plan', 'Family Plan', 'Child Plan'];
//             if (predefinedCategories.includes(editingPolicy.category)) {
//                 setSelectedCategory(editingPolicy.category);
//                 setCustomCategory('');
//                 setValue('category', editingPolicy.category);
//             } else {
//                 setSelectedCategory('other');
//                 setCustomCategory(editingPolicy.category);
//                 setValue('category', editingPolicy.category);
//             }
//         }
//     }, [editingPolicy, isDialogOpen, setValue]);

//     // Handle category selection
//     const handleCategoryChange = (value) => {
//         setSelectedCategory(value);
//         if (value === 'other') {
//             setValue('category', customCategory);
//         } else {
//             setCustomCategory('');
//             setValue('category', value);
//         }
//     };

//     // Handle custom category input
//     const handleCustomCategoryChange = (value) => {
//         setCustomCategory(value);
//         if (selectedCategory === 'other') {
//             setValue('category', value);
//         }
//     };

//     // Fetch all policies
//     const { data: policies = [], isLoading } = useQuery({
//         queryKey: ['policies'],
//         queryFn: async () => {
//             const res = await axiosSecure.get('/policies');
//             return res.data;
//         }
//     });

//     // Delete policy mutation
//     const deleteMutation = useMutation({
//         mutationFn: async (policyId) => {
//             const res = await axiosSecure.delete(`/policies/${policyId}`);
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['policies']);
//             toast.success('Policy deleted successfully');
//         },
//         onError: (error) => {
//             console.error('Delete error:', error);
//             toast.error('Failed to delete policy');
//         }
//     });

//     // Add/Edit policy mutation
//     const policyMutation = useMutation({
//         mutationFn: async (formData) => {
//             if (editingPolicy) {
//                 const res = await axiosSecure.put(`/policies/${editingPolicy._id}`, formData);
//                 return res.data;
//             } else {
//                 const res = await axiosSecure.post('/policies', formData);
//                 return res.data;
//             }
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['policies']);
//             setIsDialogOpen(false);
//             setEditingPolicy(null);
//             setSelectedCategory('');
//             setCustomCategory('');
//             toast.success(editingPolicy ? 'Policy updated successfully' : 'Policy added successfully');
//         },
//         onError: (error) => {
//             console.error('Policy mutation error:', error);
//             toast.error('Operation failed');
//         }
//     });

//     const handleDelete = async (policy) => {
//         const result = await Swal.fire({
//             title: 'Are you sure?',
//             text: `You are about to delete "${policy.title}". This action cannot be undone!`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'Cancel',
//             background: '#1f2937',
//             color: '#fff',
//             customClass: {
//                 popup: 'rounded-2xl shadow-2xl'
//             }
//         });

//         if (result.isConfirmed) {
//             deleteMutation.mutate(policy._id);
//         }
//     };

//     const handleEdit = (policy) => {
//         setEditingPolicy(policy);
//         setIsDialogOpen(true);
//     };

//     const openAddDialog = () => {
//         setEditingPolicy(null);
//         setIsDialogOpen(true);
//     };

//     const confirmUpdate = async (data) => {
//         if (editingPolicy) {
//             const result = await Swal.fire({
//                 title: 'Confirm Update',
//                 text: `Are you sure you want to update "${editingPolicy.title}"?`,
//                 icon: 'question',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, update it!',
//                 cancelButtonText: 'Cancel',
//                 background: '#1f2937',
//                 color: '#fff',
//                 customClass: {
//                     popup: 'rounded-2xl shadow-2xl'
//                 }
//             });

//             if (result.isConfirmed) {
//                 submitFormData(data);
//             }
//         } else {
//             submitFormData(data);
//         }
//     };

//     const submitFormData = (data) => {
//         const finalCategory = selectedCategory === 'other' ? customCategory : data.category;
        
//         const policyData = {
//             title: data.title,
//             category: finalCategory,
//             description: data.description,
//             minAge: parseInt(data.minAge),
//             maxAge: parseInt(data.maxAge),
//             coverage: {
//                 minAmount: parseInt(data.minCoverage),
//                 maxAmount: parseInt(data.maxCoverage)
//             },
//             duration: {
//                 options: data.durationOptions.split(',').map(d => parseInt(d.trim()))
//             },
//             premiumDetails: {
//                 baseRate: parseFloat(data.basePremiumRate)
//             },
//             image: data.image || '/default-policy.jpg',
//             benefits: ['Death Benefit', 'Tax Free', 'Critical Illness Cover'],
//             status: 'active'
//         };

//         policyMutation.mutate(policyData);
//     };

//     const closeDialog = () => {
//         setIsDialogOpen(false);
//         setEditingPolicy(null);
//         setSelectedCategory('');
//         setCustomCategory('');
//     };

//     // Get badge color based on category
//     const getBadgeColor = (category) => {
//         const colorMap = {
//             'Term Life': 'bg-blue-100 text-blue-800 border-blue-200',
//             'Whole Life': 'bg-green-100 text-green-800 border-green-200',
//             'Senior Plan': 'bg-purple-100 text-purple-800 border-purple-200',
//             'Family Plan': 'bg-pink-100 text-pink-800 border-pink-200',
//             'Child Plan': 'bg-orange-100 text-orange-800 border-orange-200'
//         };
        
//         return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 p-4">
//             {/* Header */}
//             <div className="text-center space-y-4 mb-8">
//                 <div className="flex justify-center items-center space-x-3">
//                     <GiLifeBar className="text-4xl text-primary animate-pulse" />
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                         Policy Management
//                     </h1>
//                     <FaShieldAlt className="text-4xl text-purple-600 animate-bounce" />
//                 </div>
//                 <p className="text-muted-foreground text-lg">
//                     Craft exceptional insurance experiences with magical precision
//                 </p>
//             </div>

//             <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-semibold">Manage Policies</h2>
//                     <p className="text-muted-foreground">Create, edit, and manage insurance policies</p>
//                 </div>
//                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                     <DialogTrigger asChild>
//                         <Button 
//                             onClick={openAddDialog}
//                             className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                         >
//                             <FaPlus className="mr-2" />
//                             <FaMagic className="mr-2 animate-pulse" />
//                             Add New Policy
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-2 border-border shadow-2xl backdrop-blur-0">
//                         <DialogHeader>
//                             <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                                 {editingPolicy ? '✨ Edit Policy' : '🚀 Create New Policy'}
//                             </DialogTitle>
//                             <DialogDescription className="text-muted-foreground">
//                                 {editingPolicy ? 'Refine and update policy details' : 'Craft a new insurance masterpiece'}
//                             </DialogDescription>
//                         </DialogHeader>
                        
//                         <PolicyForm 
//                             register={register}
//                             errors={errors}
//                             isSubmitting={isSubmitting || policyMutation.isLoading}
//                             editingPolicy={editingPolicy}
//                             onSubmit={handleSubmit(confirmUpdate)}
//                             onClose={closeDialog}
//                             selectedCategory={selectedCategory}
//                             customCategory={customCategory}
//                             onCategoryChange={handleCategoryChange}
//                             onCustomCategoryChange={handleCustomCategoryChange}
//                         />
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             {/* Policies Table */}
//             <Card className="bg-card border-border shadow-2xl">
//                 <CardHeader className="text-center">
//                     <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                         Policy Portfolio
//                     </CardTitle>
//                     <CardDescription className="text-lg">
//                         {policies.length} magical policies crafted
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {policies.length === 0 ? (
//                         <div className="text-center py-12 space-y-4">
//                             <GiLifeBar className="text-6xl text-muted-foreground mx-auto" />
//                             <p className="text-xl text-muted-foreground">
//                                 No policies found. Create your first magical policy!
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="rounded-2xl overflow-hidden border border-border/50">
//                             <Table>
//                                 <TableHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10">
//                                     <TableRow>
//                                         <TableHead className="font-bold text-primary">Policy Title</TableHead>
//                                         <TableHead className="font-bold text-primary">Category</TableHead>
//                                         <TableHead className="font-bold text-primary">Coverage Range</TableHead>
//                                         <TableHead className="font-bold text-primary">Age Range</TableHead>
//                                         <TableHead className="font-bold text-primary">Premium Rate</TableHead>
//                                         <TableHead className="font-bold text-primary">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {policies.map((policy, index) => (
//                                         <TableRow 
//                                             key={policy._id} 
//                                             className={`hover:bg-primary/5 transition-colors duration-200 ${
//                                                 index % 2 === 0 ? 'bg-muted/20' : ''
//                                             }`}
//                                         >
//                                             <TableCell className="font-semibold">
//                                                 <div className="flex items-center space-x-2">
//                                                     <FaShieldAlt className="text-primary" />
//                                                     <span className="break-words">{policy.title}</span>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Badge 
//                                                     variant="secondary" 
//                                                     className={`${getBadgeColor(policy.category)} text-xs font-semibold px-2 py-1 border max-w-full break-words whitespace-normal text-center`}
//                                                 >
//                                                     {policy.category}
//                                                 </Badge>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="font-mono text-sm">
//                                                     ${policy.coverage?.minAmount?.toLocaleString()} - ${policy.coverage?.maxAmount?.toLocaleString()}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex items-center space-x-1 text-sm">
//                                                     <span className="font-semibold">{policy.minAge}</span>
//                                                     <span>→</span>
//                                                     <span className="font-semibold">{policy.maxAge}</span>
//                                                     <span className="text-muted-foreground">years</span>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <span className="font-bold text-green-600 text-sm">
//                                                     {policy.premiumDetails?.baseRate}%
//                                                 </span>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex gap-2 flex-wrap">
//                                                     <Button 
//                                                         variant="outline" 
//                                                         size="sm"
//                                                         onClick={() => handleEdit(policy)}
//                                                         disabled={deleteMutation.isLoading}
//                                                         className="hover:bg-primary hover:text-primary-foreground transition-colors"
//                                                     >
//                                                         <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
//                                                     </Button>
//                                                     <Button 
//                                                         variant="destructive" 
//                                                         size="sm"
//                                                         onClick={() => handleDelete(policy)}
//                                                         disabled={deleteMutation.isLoading}
//                                                         className="hover:scale-105 transition-transform"
//                                                     >
//                                                         {deleteMutation.isLoading ? (
//                                                             <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:h-4 border-b-2 border-white"></div>
//                                                         ) : (
//                                                             <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
//                                                         )}
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// // Enhanced Policy Form Component
// const PolicyForm = ({ 
//     register, 
//     errors, 
//     isSubmitting, 
//     editingPolicy, 
//     onSubmit, 
//     onClose,
//     selectedCategory,
//     customCategory,
//     onCategoryChange,
//     onCustomCategoryChange
// }) => {
//     return (
//         <form onSubmit={onSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Policy Title */}
//                 <div className="space-y-3">
//                     <Label htmlFor="title" className="text-sm font-semibold">
//                         Policy Title *
//                     </Label>
//                     <Input
//                         id="title"
//                         {...register("title", { required: "Policy title is required" })}
//                         placeholder="e.g., Term Life Insurance Premium"
//                         className={`w-full ${errors.title ? 'border-destructive' : ''}`}
//                     />
//                     {errors.title && (
//                         <p className="text-destructive text-sm">{errors.title.message}</p>
//                     )}
//                 </div>

//                 {/* Category */}
//                 <div className="space-y-3">
//                     <Label htmlFor="category" className="text-sm font-semibold">
//                         Category *
//                     </Label>
//                     <div className="space-y-2">
//                         <Select value={selectedCategory} onValueChange={onCategoryChange}>
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="Term Life">Term Life</SelectItem>
//                                 <SelectItem value="Whole Life">Whole Life</SelectItem>
//                                 <SelectItem value="Senior Plan">Senior Plan</SelectItem>
//                                 <SelectItem value="Family Plan">Family Plan</SelectItem>
//                                 <SelectItem value="Child Plan">Child Plan</SelectItem>
//                                 <SelectItem value="other">Other (Custom)</SelectItem>
//                             </SelectContent>
//                         </Select>
                        
//                         {selectedCategory === 'other' && (
//                             <Input
//                                 value={customCategory}
//                                 onChange={(e) => onCustomCategoryChange(e.target.value)}
//                                 placeholder="Enter custom category"
//                                 className="w-full"
//                             />
//                         )}
//                     </div>
//                     {errors.category && (
//                         <p className="text-destructive text-sm">{errors.category.message}</p>
//                     )}
//                 </div>

//                 {/* Age Range */}
//                 <div className="space-y-3">
//                     <Label htmlFor="minAge" className="text-sm font-semibold">
//                         Minimum Age *
//                     </Label>
//                     <Input
//                         id="minAge"
//                         type="number"
//                         {...register("minAge", { 
//                             required: "Minimum age is required",
//                             min: { value: 18, message: "Minimum age must be at least 18" }
//                         })}
//                         min="18"
//                         max="65"
//                         className={`w-full ${errors.minAge ? 'border-destructive' : ''}`}
//                     />
//                     {errors.minAge && (
//                         <p className="text-destructive text-sm">{errors.minAge.message}</p>
//                     )}
//                 </div>

//                 <div className="space-y-3">
//                     <Label htmlFor="maxAge" className="text-sm font-semibold">
//                         Maximum Age *
//                     </Label>
//                     <Input
//                         id="maxAge"
//                         type="number"
//                         {...register("maxAge", { 
//                             required: "Maximum age is required",
//                             min: { value: 18, message: "Maximum age must be at least 18" }
//                         })}
//                         min="18"
//                         max="100"
//                         className={`w-full ${errors.maxAge ? 'border-destructive' : ''}`}
//                     />
//                     {errors.maxAge && (
//                         <p className="text-destructive text-sm">{errors.maxAge.message}</p>
//                     )}
//                 </div>

//                 {/* Coverage Range */}
//                 <div className="space-y-3">
//                     <Label htmlFor="minCoverage" className="text-sm font-semibold">
//                         Minimum Coverage ($) *
//                     </Label>
//                     <Input
//                         id="minCoverage"
//                         type="number"
//                         {...register("minCoverage", { 
//                             required: "Minimum coverage is required",
//                             min: { value: 10000, message: "Minimum coverage must be at least $10,000" }
//                         })}
//                         min="10000"
//                         className={`w-full ${errors.minCoverage ? 'border-destructive' : ''}`}
//                     />
//                     {errors.minCoverage && (
//                         <p className="text-destructive text-sm">{errors.minCoverage.message}</p>
//                     )}
//                 </div>

//                 <div className="space-y-3">
//                     <Label htmlFor="maxCoverage" className="text-sm font-semibold">
//                         Maximum Coverage ($) *
//                     </Label>
//                     <Input
//                         id="maxCoverage"
//                         type="number"
//                         {...register("maxCoverage", { 
//                             required: "Maximum coverage is required",
//                             min: { value: 10000, message: "Maximum coverage must be at least $10,000" }
//                         })}
//                         min="10000"
//                         className={`w-full ${errors.maxCoverage ? 'border-destructive' : ''}`}
//                     />
//                     {errors.maxCoverage && (
//                         <p className="text-destructive text-sm">{errors.maxCoverage.message}</p>
//                     )}
//                 </div>

//                 {/* Duration Options */}
//                 <div className="space-y-3">
//                     <Label htmlFor="durationOptions" className="text-sm font-semibold">
//                         Duration Options (years, comma separated) *
//                     </Label>
//                     <Input
//                         id="durationOptions"
//                         {...register("durationOptions", { 
//                             required: "Duration options are required",
//                             pattern: {
//                                 value: /^(\d+\s*,\s*)*\d+$/,
//                                 message: "Please enter valid duration options (e.g., 10, 15, 20)"
//                             }
//                         })}
//                         placeholder="e.g., 10, 15, 20, 25, 30"
//                         className={`w-full ${errors.durationOptions ? 'border-destructive' : ''}`}
//                     />
//                     {errors.durationOptions && (
//                         <p className="text-destructive text-sm">{errors.durationOptions.message}</p>
//                     )}
//                 </div>

//                 {/* Premium Rate */}
//                 <div className="space-y-3">
//                     <Label htmlFor="basePremiumRate" className="text-sm font-semibold">
//                         Base Premium Rate (%) *
//                     </Label>
//                     <Input
//                         id="basePremiumRate"
//                         type="number"
//                         step="0.01"
//                         {...register("basePremiumRate", { 
//                             required: "Premium rate is required",
//                             min: { value: 0.1, message: "Premium rate must be at least 0.1%" },
//                             max: { value: 5, message: "Premium rate cannot exceed 5%" }
//                         })}
//                         min="0.1"
//                         max="5"
//                         className={`w-full ${errors.basePremiumRate ? 'border-destructive' : ''}`}
//                     />
//                     {errors.basePremiumRate && (
//                         <p className="text-destructive text-sm">{errors.basePremiumRate.message}</p>
//                     )}
//                 </div>
//             </div>

//             {/* Description */}
//             <div className="space-y-3">
//                 <Label htmlFor="description" className="text-sm font-semibold">
//                     Description *
//                 </Label>
//                 <Textarea
//                     id="description"
//                     rows="4"
//                     {...register("description", { required: "Description is required" })}
//                     placeholder="Describe the policy benefits, eligibility, and features..."
//                     className={`w-full ${errors.description ? 'border-destructive' : ''}`}
//                 />
//                 {errors.description && (
//                     <p className="text-destructive text-sm">{errors.description.message}</p>
//                 )}
//             </div>

//             {/* Image Upload */}
//             <div className="space-y-3">
//                 <Label htmlFor="image" className="text-sm font-semibold">
//                     Policy Image URL
//                 </Label>
//                 <Input
//                     id="image"
//                     {...register("image")}
//                     placeholder="https://example.com/image.jpg"
//                     className="w-full"
//                 />
//             </div>

//             {/* Enhanced Submit Buttons */}
//             <div className="flex justify-end gap-4 pt-6 border-t border-border">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onClose}
//                     disabled={isSubmitting}
//                     className="hover:scale-105 transition-transform"
//                 >
//                     Cancel
//                 </Button>
//                 <Button 
//                     type="submit" 
//                     disabled={isSubmitting}
//                     className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
//                 >
//                     {isSubmitting ? (
//                         <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             {editingPolicy ? 'Updating...' : 'Creating...'}
//                         </>
//                     ) : (
//                         <>
//                             <FaMagic className="mr-2" />
//                             {editingPolicy ? 'Update Policy' : 'Create Policy'}
//                         </>
//                     )}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default ManagePolicies;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FaEdit, FaTrash, FaPlus, FaMagic, FaShieldAlt } from 'react-icons/fa';
import { GiLifeBar } from 'react-icons/gi';
import useAxiosSecure from '@/Hooks/useAxiosSecure';

const ManagePolicies = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    // Form handling with react-hook-form
    const { 
        register, 
        handleSubmit, 
        reset, 
        setValue,
        watch,
        formState: { errors, isSubmitting } 
    } = useForm();

    // Reset form when opening for new policy - COMPLETELY EMPTY
    useEffect(() => {
        if (isDialogOpen && !editingPolicy) {
            reset({
                title: '',
                category: '',
                description: '',
                minAge: '',
                maxAge: '',
                minCoverage: '',
                maxCoverage: '',
                durationOptions: '',
                basePremiumRate: '',
                image: ''
            });
            setSelectedCategory('');
            setCustomCategory('');
        }
    }, [isDialogOpen, editingPolicy, reset]);

    // Set form values when editing
    useEffect(() => {
        if (editingPolicy && isDialogOpen) {
            setValue('title', editingPolicy.title);
            setValue('description', editingPolicy.description);
            setValue('minAge', editingPolicy.minAge);
            setValue('maxAge', editingPolicy.maxAge);
            setValue('minCoverage', editingPolicy.coverage?.minAmount);
            setValue('maxCoverage', editingPolicy.coverage?.maxAmount);
            setValue('durationOptions', editingPolicy.duration?.options?.join(', '));
            setValue('basePremiumRate', editingPolicy.premiumDetails?.baseRate);
            setValue('image', editingPolicy.image);
            
            // Handle category for editing
            const predefinedCategories = ['Term Life', 'Whole Life', 'Senior Plan', 'Family Plan', 'Child Plan'];
            if (predefinedCategories.includes(editingPolicy.category)) {
                setSelectedCategory(editingPolicy.category);
                setCustomCategory('');
                setValue('category', editingPolicy.category);
            } else {
                setSelectedCategory('other');
                setCustomCategory(editingPolicy.category);
                setValue('category', editingPolicy.category);
            }
        }
    }, [editingPolicy, isDialogOpen, setValue]);

    // Handle category selection
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        if (value === 'other') {
            setValue('category', customCategory);
        } else {
            setCustomCategory('');
            setValue('category', value);
        }
    };

    // Handle custom category input
    const handleCustomCategoryChange = (value) => {
        setCustomCategory(value);
        if (selectedCategory === 'other') {
            setValue('category', value);
        }
    };

    // Fetch all policies
    const { data: policies = [], isLoading } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        }
    });

    // Delete policy mutation
    const deleteMutation = useMutation({
        mutationFn: async (policyId) => {
            const res = await axiosSecure.delete(`/policies/${policyId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
            toast.success('Policy deleted successfully');
        },
        onError: (error) => {
            console.error('Delete error:', error);
            toast.error('Failed to delete policy');
        }
    });

    // Add/Edit policy mutation
    const policyMutation = useMutation({
        mutationFn: async (formData) => {
            if (editingPolicy) {
                const res = await axiosSecure.put(`/policies/${editingPolicy._id}`, formData);
                return res.data;
            } else {
                const res = await axiosSecure.post('/policies', formData);
                return res.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
            setIsDialogOpen(false);
            setEditingPolicy(null);
            setSelectedCategory('');
            setCustomCategory('');
            toast.success(editingPolicy ? 'Policy updated successfully' : 'Policy added successfully');
        },
        onError: (error) => {
            console.error('Policy mutation error:', error);
            toast.error('Operation failed');
        }
    });

    const handleDelete = async (policy) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${policy.title}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#1f2937',
            color: '#fff',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                confirmButton: 'swal2-confirm',
                cancelButton: 'swal2-cancel'
            },
            focusConfirm: false,
            preConfirm: () => {
                return new Promise((resolve) => {
                    resolve();
                });
            }
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
            const result = await Swal.fire({
                title: 'Confirm Update',
                text: `Are you sure you want to update "${editingPolicy.title}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!',
                cancelButtonText: 'Cancel',
                background: '#1f2937',
                color: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    confirmButton: 'swal2-confirm',
                    cancelButton: 'swal2-cancel'
                },
                focusConfirm: false,
                preConfirm: () => {
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
            });

            if (result.isConfirmed) {
                submitFormData(data);
            }
        } else {
            submitFormData(data);
        }
    };

    const submitFormData = (data) => {
        const finalCategory = selectedCategory === 'other' ? customCategory : data.category;
        
        const policyData = {
            title: data.title,
            category: finalCategory,
            description: data.description,
            minAge: parseInt(data.minAge),
            maxAge: parseInt(data.maxAge),
            coverage: {
                minAmount: parseInt(data.minCoverage),
                maxAmount: parseInt(data.maxCoverage)
            },
            duration: {
                options: data.durationOptions.split(',').map(d => parseInt(d.trim()))
            },
            premiumDetails: {
                baseRate: parseFloat(data.basePremiumRate)
            },
            image: data.image || '/default-policy.jpg',
            benefits: ['Death Benefit', 'Tax Free', 'Critical Illness Cover'],
            status: 'active'
        };

        policyMutation.mutate(policyData);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingPolicy(null);
        setSelectedCategory('');
        setCustomCategory('');
    };

    // Get badge color based on category
    const getBadgeColor = (category) => {
        const colorMap = {
            'Term Life': 'bg-blue-100 text-blue-800 border-blue-200',
            'Whole Life': 'bg-green-100 text-green-800 border-green-200',
            'Senior Plan': 'bg-purple-100 text-purple-800 border-purple-200',
            'Family Plan': 'bg-pink-100 text-pink-800 border-pink-200',
            'Child Plan': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        
        return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
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
                    <p className="text-muted-foreground text-sm">Create, edit, and manage insurance policies</p>
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
                                {editingPolicy ? '✨ Edit Policy' : '🚀 Create New Policy'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                {editingPolicy ? 'Refine and update policy details' : 'Craft a new insurance masterpiece'}
                            </DialogDescription>
                        </DialogHeader>
                        
                        <PolicyForm 
                            register={register}
                            errors={errors}
                            isSubmitting={isSubmitting || policyMutation.isLoading}
                            editingPolicy={editingPolicy}
                            onSubmit={handleSubmit(confirmUpdate)}
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
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Policy Title</TableHead>
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Category</TableHead>
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Coverage Range</TableHead>
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Age Range</TableHead>
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Premium Rate</TableHead>
                                            <TableHead className="font-bold text-primary text-xs sm:text-sm">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {policies.map((policy, index) => (
                                            <TableRow 
                                                key={policy._id} 
                                                className={`hover:bg-primary/5 transition-colors duration-200 ${
                                                    index % 2 === 0 ? 'bg-muted/20' : ''
                                                }`}
                                            >
                                                <TableCell className="font-semibold text-xs sm:text-sm">
                                                    <div className="flex items-center space-x-2 min-w-[120px]">
                                                        <FaShieldAlt className="text-primary flex-shrink-0" />
                                                        <span className="break-words line-clamp-2">{policy.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`${getBadgeColor(policy.category)} px-2 py-1 border text-xs max-w-full break-words whitespace-normal text-center`}
                                                    >
                                                        {policy.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    <div className="font-mono min-w-[140px]">
                                                        ${policy.coverage?.minAmount?.toLocaleString()} - ${policy.coverage?.maxAmount?.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    <div className="flex items-center space-x-1 min-w-[100px]">
                                                        <span className="font-semibold">{policy.minAge}</span>
                                                        <span>→</span>
                                                        <span className="font-semibold">{policy.maxAge}</span>
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

// Enhanced Policy Form Component
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
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Policy Title */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold">
                        Policy Title *
                    </Label>
                    <Input
                        id="title"
                        {...register("title", { required: "Policy title is required" })}
                        placeholder="e.g., Term Life Insurance Premium"
                        className={`w-full ${errors.title ? 'border-destructive' : ''}`}
                    />
                    {errors.title && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.title.message}</p>
                    )}
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
                                value={customCategory}
                                onChange={(e) => onCustomCategoryChange(e.target.value)}
                                placeholder="Enter custom category"
                                className="w-full"
                            />
                        )}
                    </div>
                    {errors.category && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.category.message}</p>
                    )}
                </div>

                {/* Age Range */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="minAge" className="text-sm font-semibold">
                        Minimum Age *
                    </Label>
                    <Input
                        id="minAge"
                        type="number"
                        {...register("minAge", { 
                            required: "Minimum age is required",
                            min: { value: 18, message: "Minimum age must be at least 18" }
                        })}
                        placeholder="Enter minimum age"
                        min="18"
                        max="65"
                        className={`w-full ${errors.minAge ? 'border-destructive' : ''}`}
                    />
                    {errors.minAge && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.minAge.message}</p>
                    )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="maxAge" className="text-sm font-semibold">
                        Maximum Age *
                    </Label>
                    <Input
                        id="maxAge"
                        type="number"
                        {...register("maxAge", { 
                            required: "Maximum age is required",
                            min: { value: 18, message: "Maximum age must be at least 18" }
                        })}
                        placeholder="Enter maximum age"
                        min="18"
                        max="100"
                        className={`w-full ${errors.maxAge ? 'border-destructive' : ''}`}
                    />
                    {errors.maxAge && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.maxAge.message}</p>
                    )}
                </div>

                {/* Coverage Range */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="minCoverage" className="text-sm font-semibold">
                        Minimum Coverage ($) *
                    </Label>
                    <Input
                        id="minCoverage"
                        type="number"
                        {...register("minCoverage", { 
                            required: "Minimum coverage is required",
                            min: { value: 10000, message: "Minimum coverage must be at least $10,000" }
                        })}
                        placeholder="Enter minimum coverage"
                        min="10000"
                        className={`w-full ${errors.minCoverage ? 'border-destructive' : ''}`}
                    />
                    {errors.minCoverage && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.minCoverage.message}</p>
                    )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="maxCoverage" className="text-sm font-semibold">
                        Maximum Coverage ($) *
                    </Label>
                    <Input
                        id="maxCoverage"
                        type="number"
                        {...register("maxCoverage", { 
                            required: "Maximum coverage is required",
                            min: { value: 10000, message: "Maximum coverage must be at least $10,000" }
                        })}
                        placeholder="Enter maximum coverage"
                        min="10000"
                        className={`w-full ${errors.maxCoverage ? 'border-destructive' : ''}`}
                    />
                    {errors.maxCoverage && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.maxCoverage.message}</p>
                    )}
                </div>

                {/* Duration Options */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="durationOptions" className="text-sm font-semibold">
                        Duration Options (years, comma separated) *
                    </Label>
                    <Input
                        id="durationOptions"
                        {...register("durationOptions", { 
                            required: "Duration options are required",
                            pattern: {
                                value: /^(\d+\s*,\s*)*\d+$/,
                                message: "Please enter valid duration options (e.g., 10, 15, 20)"
                            }
                        })}
                        placeholder="e.g., 10, 15, 20, 25, 30"
                        className={`w-full ${errors.durationOptions ? 'border-destructive' : ''}`}
                    />
                    {errors.durationOptions && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.durationOptions.message}</p>
                    )}
                </div>

                {/* Premium Rate */}
                <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="basePremiumRate" className="text-sm font-semibold">
                        Base Premium Rate (%) *
                    </Label>
                    <Input
                        id="basePremiumRate"
                        type="number"
                        step="0.01"
                        {...register("basePremiumRate", { 
                            required: "Premium rate is required",
                            min: { value: 0.1, message: "Premium rate must be at least 0.1%" },
                            max: { value: 5, message: "Premium rate cannot exceed 5%" }
                        })}
                        placeholder="Enter premium rate"
                        min="0.1"
                        max="5"
                        className={`w-full ${errors.basePremiumRate ? 'border-destructive' : ''}`}
                    />
                    {errors.basePremiumRate && (
                        <p className="text-destructive text-xs sm:text-sm">{errors.basePremiumRate.message}</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold">
                    Description *
                </Label>
                <Textarea
                    id="description"
                    rows="4"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Describe the policy benefits, eligibility, and features..."
                    className={`w-full ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && (
                    <p className="text-destructive text-xs sm:text-sm">{errors.description.message}</p>
                )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="image" className="text-sm font-semibold">
                    Policy Image URL
                </Label>
                <Input
                    id="image"
                    {...register("image")}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                />
            </div>

            {/* Enhanced Submit Buttons */}
            <div className="flex justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="hover:scale-105 transition-transform text-xs sm:text-sm"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
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