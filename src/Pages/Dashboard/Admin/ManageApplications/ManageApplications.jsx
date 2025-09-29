// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { 
//     Search, 
//     FileText,
//     User,
//     Mail,
//     Calendar,
//     Shield,
//     CheckCircle,
//     XCircle,
//     Eye,
//     UserCog,
//     Loader2,
//     AlertCircle,
//     Users
// } from 'lucide-react';
// import useAxios from '@/Hooks/useAxios';
// import Swal from 'sweetalert2';

// const ManageApplications = () => {
//     const axiosInstance = useAxios();
//     const queryClient = useQueryClient();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [selectedApplication, setSelectedApplication] = useState(null);
//     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//     const [assignAgentData, setAssignAgentData] = useState({ applicationId: '', agentId: '' });

//     // Fetch applications
// const { data: applicationsData = {}, isLoading, error } = useQuery({
//     queryKey: ['applications', searchTerm, statusFilter],
//     queryFn: async () => {
//         const res = await axiosInstance.get('/applications', {
//             params: { 
//                 search: searchTerm, 
//                 status: statusFilter,
//                 page: 1, 
//                 limit: 50 
//             }
//         });
//         return res.data;
//     }
// });

//     // Fetch agents for assignment
//     const { data: agents = [] } = useQuery({
//         queryKey: ['agents'],
//         queryFn: async () => {
//             const res = await axiosInstance.get('/users', {
//                 params: { role: 'agent' }
//             });
//             return res.data.users || [];
//         }
//     });

//     const applications = applicationsData.applications || [];
//     const totalApplications = applicationsData.totalApplications || 0;

//     // Update application status mutation
//     const updateApplicationStatus = useMutation({
//         mutationFn: async ({ applicationId, status, adminNotes }) => {
//             const res = await axiosInstance.put(`/applications/${applicationId}/status`, {
//                 status,
//                 adminNotes
//             });
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['applications']);
//             Swal.fire({
//                 title: 'Success!',
//                 text: 'Application status updated successfully',
//                 icon: 'success',
//                 confirmButtonColor: '#3085d6',
//             });
//         },
//         onError: (error) => {
//             Swal.fire({
//                 title: 'Error!',
//                 text: 'Failed to update application status',
//                 icon: 'error',
//                 confirmButtonText: 'OK'
//             });
//         }
//     });

//     // Assign agent mutation
//     const assignAgent = useMutation({
//         mutationFn: async ({ applicationId, agentId }) => {
//             const res = await axiosInstance.patch(`/applications/${applicationId}/assign-agent`, {
//                 agentId
//             });
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(['applications']);
//             setAssignAgentData({ applicationId: '', agentId: '' });
//             Swal.fire({
//                 title: 'Success!',
//                 text: 'Agent assigned successfully',
//                 icon: 'success',
//                 confirmButtonColor: '#3085d6',
//             });
//         },
//         onError: (error) => {
//             Swal.fire({
//                 title: 'Error!',
//                 text: 'Failed to assign agent',
//                 icon: 'error',
//                 confirmButtonText: 'OK'
//             });
//         }
//     });

//     const handleStatusChange = (applicationId, newStatus, applicantName) => {
//         const actionText = newStatus === 'approved' ? 'approve' : 'reject';
        
//         Swal.fire({
//             title: `${newStatus === 'approved' ? 'Approve' : 'Reject'} Application?`,
//             text: `Are you sure you want to ${actionText} ${applicantName}'s application?`,
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonColor: newStatus === 'approved' ? '#3085d6' : '#d33',
//             cancelButtonColor: '#6b7280',
//             confirmButtonText: `Yes, ${actionText} it!`,
//             cancelButtonText: 'Cancel'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 let adminNotes = '';
//                 if (newStatus === 'rejected') {
//                     Swal.fire({
//                         title: 'Reason for Rejection',
//                         input: 'textarea',
//                         inputLabel: 'Please provide a reason for rejection',
//                         inputPlaceholder: 'Enter the reason...',
//                         showCancelButton: true,
//                         confirmButtonColor: '#d33',
//                         cancelButtonColor: '#6b7280',
//                         confirmButtonText: 'Submit Rejection',
//                         cancelButtonText: 'Cancel',
//                         inputValidator: (value) => {
//                             if (!value) {
//                                 return 'Please provide a reason for rejection';
//                             }
//                         }
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             adminNotes = result.value;
//                             updateApplicationStatus.mutate({ 
//                                 applicationId, 
//                                 status: newStatus,
//                                 adminNotes
//                             });
//                         }
//                     });
//                 } else {
//                     updateApplicationStatus.mutate({ 
//                         applicationId, 
//                         status: newStatus 
//                     });
//                 }
//             }
//         });
//     };

//     const handleAssignAgent = (applicationId, applicantName) => {
//         Swal.fire({
//             title: `Assign Agent to ${applicantName}`,
//             html: `
//                 <select id="agentSelect" class="swal2-input">
//                     <option value="">Select an agent</option>
//                     ${agents.map(agent => 
//                         `<option value="${agent._id}">${agent.name} (${agent.email})</option>`
//                     ).join('')}
//                 </select>
//             `,
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#6b7280',
//             confirmButtonText: 'Assign Agent',
//             cancelButtonText: 'Cancel',
//             preConfirm: () => {
//                 const agentSelect = Swal.getPopup().querySelector('#agentSelect');
//                 const agentId = agentSelect.value;
//                 if (!agentId) {
//                     Swal.showValidationMessage('Please select an agent');
//                     return false;
//                 }
//                 return { agentId };
//             }
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 assignAgent.mutate({
//                     applicationId,
//                     agentId: result.value.agentId
//                 });
//             }
//         });
//     };

//     const handleViewDetails = (application) => {
//         setSelectedApplication(application);
//         setIsDetailsOpen(true);
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             pending: { variant: 'secondary', label: 'Pending', icon: Loader2 },
//             approved: { variant: 'default', label: 'Approved', icon: CheckCircle },
//             rejected: { variant: 'destructive', label: 'Rejected', icon: XCircle },
//             under_review: { variant: 'outline', label: 'Under Review', icon: Eye }
//         };
        
//         const config = statusConfig[status] || { variant: 'outline', label: status, icon: FileText };
//         const IconComponent = config.icon;
        
//         return (
//             <Badge variant={config.variant} className="flex items-center gap-1 w-fit rounded-full px-3 py-1">
//                 <IconComponent className="h-3 w-3" />
//                 {config.label}
//             </Badge>
//         );
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         try {
//             return new Date(dateString).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });
//         } catch (error) {
//             return 'Invalid Date';
//         }
//     };

//     if (error) {
//         return (
//             <div className="container mx-auto p-6">
//                 <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>
//                         Failed to load applications. Please try again later.
//                     </AlertDescription>
//                 </Alert>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-6 space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Applications</h1>
//                     <p className="text-muted-foreground">
//                         Review and manage all insurance policy applications
//                     </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Badge variant="outline" className="text-sm">
//                         <FileText className="w-4 h-4 mr-1" />
//                         {totalApplications} Applications
//                     </Badge>
//                 </div>
//             </div>

//             {/* Filters */}
//             <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//                 <CardContent className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="search" className="text-foreground font-semibold">Search Applications</Label>
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                                 <Input
//                                     id="search"
//                                     placeholder="Search by name, email, or policy..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="pl-10 border-input bg-background/50"
//                                 />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="status-filter" className="text-foreground font-semibold">Filter by Status</Label>
//                             <Select value={statusFilter} onValueChange={setStatusFilter}>
//                                 <SelectTrigger className="border-input bg-background/50">
//                                     <SelectValue placeholder="All Statuses" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Statuses</SelectItem>
//                                     <SelectItem value="pending">Pending</SelectItem>
//                                     <SelectItem value="approved">Approved</SelectItem>
//                                     <SelectItem value="rejected">Rejected</SelectItem>
//                                     <SelectItem value="under_review">Under Review</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="flex items-end">
//                             <Button
//                                 variant="outline"
//                                 onClick={() => {
//                                     setSearchTerm('');
//                                     setStatusFilter('all');
//                                 }}
//                                 className="w-full border-input hover:bg-accent/20"
//                             >
//                                 Clear Filters
//                             </Button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Applications Table */}
//             <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//                 <CardHeader>
//                     <CardTitle className="text-foreground">Application Management</CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                         Review insurance applications, assign agents, and update application status
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {isLoading ? (
//                         <div className="flex justify-center items-center py-12">
//                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                             <span className="ml-2 text-foreground">Loading applications...</span>
//                         </div>
//                     ) : applications.length === 0 ? (
//                         <div className="text-center py-12">
//                             <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                             <h3 className="text-lg font-semibold text-foreground">No applications found</h3>
//                             <p className="text-muted-foreground">
//                                 {searchTerm || statusFilter !== 'all' 
//                                     ? 'Try adjusting your search filters' 
//                                     : 'No applications submitted yet'
//                                 }
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="rounded-md border border-border/50">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow className="hover:bg-transparent">
//                                         <TableHead className="text-foreground font-semibold">Applicant</TableHead>
//                                         <TableHead className="text-foreground font-semibold text-center">Policy</TableHead>
//                                         <TableHead className="text-foreground font-semibold text-center">Application Date</TableHead>
//                                         <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
//                                         <TableHead className="text-foreground font-semibold text-center">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {applications.map((application) => (
//                                         <TableRow key={application._id} className="hover:bg-accent/10">
//                                             <TableCell>
//                                                 <div className="space-y-1">
//                                                     <div className="flex items-center gap-2">
//                                                         <User className="h-4 w-4 text-muted-foreground" />
//                                                         <span className="font-medium text-foreground">{application.fullName}</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-2">
//                                                         <Mail className="h-3 w-3 text-muted-foreground" />
//                                                         <span className="text-sm text-muted-foreground">{application.email}</span>
//                                                     </div>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell className="text-center text-foreground">
//                                                 {application.policyDetails?.title || 'N/A'}
//                                             </TableCell>
//                                             <TableCell className="text-center text-muted-foreground">
//                                                 <div className="flex items-center justify-center gap-2">
//                                                     <Calendar className="h-3 w-3" />
//                                                     {formatDate(application.appliedAt)}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex justify-center">
//                                                     {getStatusBadge(application.status)}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex justify-center gap-1 flex-wrap">
//                                                     {/* View Details Button */}
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline"
//                                                         onClick={() => handleViewDetails(application)}
//                                                         className="gap-1 text-xs px-2 py-1 h-7 min-w-[85px]"
//                                                     >
//                                                         <Eye className="h-3 w-3" />
//                                                         Details
//                                                     </Button>

//                                                     {/* Assign Agent Button - Only for pending/under_review */}
//                                                     {(application.status === 'pending' || application.status === 'under_review') && (
//                                                         <Button
//                                                             size="sm"
//                                                             variant="outline"
//                                                             onClick={() => handleAssignAgent(application._id, application.fullName)}
//                                                             disabled={assignAgent.isLoading}
//                                                             className="gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1 h-7 min-w-[85px]"
//                                                         >
//                                                             <UserCog className="h-3 w-3" />
//                                                             Assign Agent
//                                                         </Button>
//                                                     )}

//                                                     {/* Approve Button - Only for pending/under_review */}
//                                                     {(application.status === 'pending' || application.status === 'under_review') && (
//                                                         <Button
//                                                             size="sm"
//                                                             variant="outline"
//                                                             onClick={() => handleStatusChange(application._id, 'approved', application.fullName)}
//                                                             disabled={updateApplicationStatus.isLoading}
//                                                             className="gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1 h-7 min-w-[70px]"
//                                                         >
//                                                             <CheckCircle className="h-3 w-3" />
//                                                             Approve
//                                                         </Button>
//                                                     )}

//                                                     {/* Reject Button - Only for pending/under_review */}
//                                                     {(application.status === 'pending' || application.status === 'under_review') && (
//                                                         <Button
//                                                             size="sm"
//                                                             variant="outline"
//                                                             onClick={() => handleStatusChange(application._id, 'rejected', application.fullName)}
//                                                             disabled={updateApplicationStatus.isLoading}
//                                                             className="gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1 h-7 min-w-[70px]"
//                                                         >
//                                                             <XCircle className="h-3 w-3" />
//                                                             Reject
//                                                         </Button>
//                                                     )}
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

//             {/* Application Details Modal */}
//             <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle className="text-foreground">Application Details</DialogTitle>
//                         <DialogDescription className="text-muted-foreground">
//                             Complete information for {selectedApplication?.fullName}'s application
//                         </DialogDescription>
//                     </DialogHeader>
                    
//                     {selectedApplication && (
//                         <div className="space-y-6">
//                             {/* Application Overview */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg flex items-center gap-2">
//                                         <FileText className="h-5 w-5" />
//                                         Application Overview
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <Label className="text-sm font-semibold">Application ID</Label>
//                                         <p className="text-sm text-muted-foreground">{selectedApplication.applicationId}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Status</Label>
//                                         <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Applied On</Label>
//                                         <p className="text-sm text-muted-foreground">{formatDate(selectedApplication.appliedAt)}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Policy</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.policyDetails?.title || 'N/A'}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Personal Information */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg flex items-center gap-2">
//                                         <User className="h-5 w-5" />
//                                         Personal Information
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <Label className="text-sm font-semibold">Full Name</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.fullName}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Email</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.email}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Phone</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.phone}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">NID Number</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.nidNumber}</p>
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <Label className="text-sm font-semibold">Address</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.address}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Nominee Information */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg flex items-center gap-2">
//                                         <Users className="h-5 w-5" />
//                                         Nominee Information
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <Label className="text-sm font-semibold">Nominee Name</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.nomineeName}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Relationship</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.nomineeRelationship}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-sm font-semibold">Nominee Phone</Label>
//                                         <p className="text-sm text-foreground">{selectedApplication.nomineePhone}</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Health & Additional Information */}
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="text-lg flex items-center gap-2">
//                                         <Shield className="h-5 w-5" />
//                                         Health & Additional Information
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-4">
//                                     <div>
//                                         <Label className="text-sm font-semibold">Health Conditions</Label>
//                                         <p className="text-sm text-foreground">
//                                             {selectedApplication.healthConditions?.length > 0 
//                                                 ? selectedApplication.healthConditions.join(', ')
//                                                 : 'None reported'
//                                             }
//                                         </p>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <Label className="text-sm font-semibold">Occupation</Label>
//                                             <p className="text-sm text-foreground">{selectedApplication.occupation}</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm font-semibold">Annual Income</Label>
//                                             <p className="text-sm text-foreground">${selectedApplication.annualIncome}</p>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <Label className="text-sm font-semibold">Height</Label>
//                                             <p className="text-sm text-foreground">{selectedApplication.height || 'N/A'} cm</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm font-semibold">Weight</Label>
//                                             <p className="text-sm text-foreground">{selectedApplication.weight || 'N/A'} kg</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>

//                             {/* Quote Information */}
//                             {selectedApplication.quoteData && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="text-lg">Quote Information</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <Label className="text-sm font-semibold">Coverage Amount</Label>
//                                             <p className="text-sm text-foreground">${selectedApplication.quoteData.coverageAmount}</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm font-semibold">Duration</Label>
//                                             <p className="text-sm text-foreground">{selectedApplication.quoteData.duration} years</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-sm font-semibold">Estimated Monthly Premium</Label>
//                                             <p className="text-sm text-foreground">${selectedApplication.estimatedPremium?.monthly}</p>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ManageApplications;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
    Search, 
    FileText,
    User,
    Mail,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Eye,
    UserCog,
    Loader2,
    AlertCircle,
    Users
} from 'lucide-react';
import useAxios from '@/Hooks/useAxios';
import Swal from 'sweetalert2';

const ManageApplications = () => {
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Fetch applications
    const { data: applicationsData = {}, isLoading, error } = useQuery({
        queryKey: ['applications', searchTerm, statusFilter],
        queryFn: async () => {
            const res = await axiosInstance.get('/applications', {
                params: { 
                    search: searchTerm, 
                    status: statusFilter,
                    page: 1,
                    limit: 50
                }
            });
            return res.data;
        }
    });

    // Fetch agents for assignment
    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const res = await axiosInstance.get('/users', {
                params: { role: 'agent' }
            });
            return res.data.users || [];
        }
    });

    const applications = applicationsData.applications || [];
    const totalApplications = applicationsData.totalApplications || 0;

    // Update application status mutation - ONLY FOR REJECTION NOW
    const updateApplicationStatus = useMutation({
        mutationFn: async ({ applicationId, status, adminNotes }) => {
            const res = await axiosInstance.put(`/applications/${applicationId}/status`, {
                status,
                adminNotes
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            Swal.fire({
                title: 'Success!',
                text: 'Application status updated successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update application status',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // Assign agent mutation
    const assignAgent = useMutation({
        mutationFn: async ({ applicationId, agentId }) => {
            const res = await axiosInstance.patch(`/applications/${applicationId}/assign-agent`, {
                agentId
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            Swal.fire({
                title: 'Success!',
                text: 'Agent assigned successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to assign agent',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    const handleRejectApplication = (applicationId, applicantName) => {
        Swal.fire({
            title: 'Reject Application?',
            text: `Are you sure you want to reject ${applicantName}'s application?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reject it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Reason for Rejection',
                    input: 'textarea',
                    inputLabel: 'Please provide a reason for rejection',
                    inputPlaceholder: 'Enter the reason...',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Submit Rejection',
                    cancelButtonText: 'Cancel',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Please provide a reason for rejection';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const adminNotes = result.value;
                        updateApplicationStatus.mutate({ 
                            applicationId, 
                            status: 'rejected',
                            adminNotes
                        });
                    }
                });
            }
        });
    };

    const handleAssignAgent = (application, applicantName) => {
        // Check if agent is already assigned
        if (application.assignedAgentId) {
            Swal.fire({
                title: 'Agent Already Assigned',
                text: `This application already has an assigned agent (${application.assignedAgentName}). Do you want to change the agent?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, change agent',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    showAgentSelection(application._id, applicantName, application.assignedAgentName);
                }
            });
        } else {
            showAgentSelection(application._id, applicantName);
        }
    };

    const showAgentSelection = (applicationId, applicantName, currentAgent = null) => {
        Swal.fire({
            title: currentAgent ? `Change Agent for ${applicantName}` : `Assign Agent to ${applicantName}`,
            html: `
                <div class="text-left">
                    ${currentAgent ? `<p class="text-sm text-gray-600 mb-3">Current Agent: <strong>${currentAgent}</strong></p>` : ''}
                    <label for="agentSelect" class="block text-sm font-medium text-gray-700 mb-2">Select Agent:</label>
                    <select id="agentSelect" class="swal2-input w-full">
                        <option value="">Select an agent</option>
                        ${agents.map(agent => 
                            `<option value="${agent._id}">${agent.name} (${agent.email})</option>`
                        ).join('')}
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: currentAgent ? 'Change Agent' : 'Assign Agent',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const agentSelect = Swal.getPopup().querySelector('#agentSelect');
                const agentId = agentSelect.value;
                if (!agentId) {
                    Swal.showValidationMessage('Please select an agent');
                    return false;
                }
                return { agentId };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                assignAgent.mutate({
                    applicationId,
                    agentId: result.value.agentId
                });
            }
        });
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDetailsOpen(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: 'secondary', label: 'Pending', icon: Loader2 },
            approved: { variant: 'default', label: 'Approved', icon: CheckCircle },
            rejected: { variant: 'destructive', label: 'Rejected', icon: XCircle },
            under_review: { variant: 'outline', label: 'Under Review', icon: Eye }
        };
        
        const config = statusConfig[status] || { variant: 'outline', label: status, icon: FileText };
        const IconComponent = config.icon;
        
        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit rounded-full px-3 py-1">
                <IconComponent className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load applications. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Applications</h1>
                    <p className="text-muted-foreground">
                        Review and manage all insurance policy applications
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        <FileText className="w-4 h-4 mr-1" />
                        {totalApplications} Applications
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-foreground font-semibold">Search Applications</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="search"
                                    placeholder="Search by name, email, or policy..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-input bg-background/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status-filter" className="text-foreground font-semibold">Filter by Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="border-input bg-background/50">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="w-full border-input hover:bg-accent/20"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Applications Table */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-foreground">Application Management</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Review insurance applications and assign agents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-foreground">Loading applications...</span>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">No applications found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search filters' 
                                    : 'No applications submitted yet'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-border/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-foreground font-semibold">Applicant</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Policy</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Application Date</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Assigned Agent</TableHead>
                                        <TableHead className="text-foreground font-semibold text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow key={application._id} className="hover:bg-accent/10">
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium text-foreground">{application.fullName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">{application.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-foreground">
                                                {application.policyDetails?.title || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(application.appliedAt)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    {getStatusBadge(application.status)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {application.assignedAgentName ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {application.assignedAgentName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {application.assignedAgentEmail}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-1 flex-wrap">
                                                    {/* View Details Button */}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewDetails(application)}
                                                        className="gap-1 text-xs px-2 py-1 h-7 min-w-[85px]"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Details
                                                    </Button>

                                                    {/* Assign Agent Button - Only for pending/under_review */}
                                                    {(application.status === 'pending' || application.status === 'under_review') && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleAssignAgent(application, application.fullName)}
                                                            disabled={assignAgent.isLoading}
                                                            className={`gap-1 text-xs px-2 py-1 h-7 min-w-[85px] ${
                                                                application.assignedAgentId 
                                                                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' 
                                                                    : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                                                            }`}
                                                        >
                                                            <UserCog className="h-3 w-3" />
                                                            {application.assignedAgentId ? 'Change Agent' : 'Assign Agent'}
                                                        </Button>
                                                    )}

                                                    {/* Reject Button - Only for pending/under_review */}
                                                    {(application.status === 'pending' || application.status === 'under_review') && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectApplication(application._id, application.fullName)}
                                                            disabled={updateApplicationStatus.isLoading}
                                                            className="gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1 h-7 min-w-[70px]"
                                                        >
                                                            <XCircle className="h-3 w-3" />
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Application Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Application Details</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Complete information for {selectedApplication?.fullName}'s application
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedApplication && (
                        <div className="space-y-6">
                            {/* Application Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Application Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Applied On</Label>
                                        <p className="text-sm text-muted-foreground">{formatDate(selectedApplication.appliedAt)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Policy</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.policyDetails?.title || 'N/A'}</p>
                                    </div>
                                    {selectedApplication.assignedAgentName && (
                                        <div>
                                            <Label className="text-sm font-semibold">Assigned Agent</Label>
                                            <p className="text-sm text-foreground">{selectedApplication.assignedAgentName}</p>
                                            <p className="text-xs text-muted-foreground">{selectedApplication.assignedAgentEmail}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold">Full Name</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.fullName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Email</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Phone</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">NID Number</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.nidNumber}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-semibold">Address</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.address}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Nominee Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Nominee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold">Nominee Name</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.nomineeName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Relationship</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.nomineeRelationship}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold">Nominee Phone</Label>
                                        <p className="text-sm text-foreground">{selectedApplication.nomineePhone}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Health & Additional Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Health & Additional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-semibold">Health Conditions</Label>
                                        <p className="text-sm text-foreground">
                                            {selectedApplication.healthConditions?.length > 0 
                                                ? selectedApplication.healthConditions.join(', ')
                                                : 'None reported'
                                            }
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-semibold">Occupation</Label>
                                            <p className="text-sm text-foreground">{selectedApplication.occupation}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Annual Income</Label>
                                            <p className="text-sm text-foreground">${selectedApplication.annualIncome}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-semibold">Height</Label>
                                            <p className="text-sm text-foreground">{selectedApplication.height || 'N/A'} cm</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Weight</Label>
                                            <p className="text-sm text-foreground">{selectedApplication.weight || 'N/A'} kg</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quote Information */}
                            {selectedApplication.quoteData && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Quote Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-semibold">Coverage Amount</Label>
                                            <p className="text-sm text-foreground">${selectedApplication.quoteData.coverageAmount}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Duration</Label>
                                            <p className="text-sm text-foreground">{selectedApplication.quoteData.duration} years</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Estimated Monthly Premium</Label>
                                            <p className="text-sm text-foreground">${selectedApplication.estimatedPremium?.monthly}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageApplications;