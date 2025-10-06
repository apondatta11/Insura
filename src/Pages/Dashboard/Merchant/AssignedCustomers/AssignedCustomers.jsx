import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import useAuth from "@/Hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Users,
  FileText,
  CheckCircle,
  Loader2,
  Shield,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@headlessui/react";

const AssignedCustomers = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [customerToReject, setCustomerToReject] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: assignedCustomers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assignedCustomers", statusFilter, user?.email],
    queryFn: async () => {
      console.log("📋 Fetching assigned customers for agent:", user?.email);

      const response = await axiosSecure.get(
        `/applications?agentEmail=${user?.email}&status=${statusFilter}`
      );
      console.log(" Found applications:", response.data);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const response = await axiosSecure.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["assignedCustomers"]);
      toast.success(`Application ${variables.status} successfully`);

      if (variables.status === "approved") {
        toast.success("Policy approved and purchase count updated!");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update application status";
      toast.error(errorMessage);
    },
  });

  const rejectApplication = useMutation({
    mutationFn: async ({ applicationId, feedback }) => {
      const response = await axiosSecure.put(
        `/applications/${applicationId}/reject`,
        {
          feedback,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assignedCustomers"]);
      toast.success("Application rejected with feedback");
      setIsRejectModalOpen(false);
      setRejectionFeedback("");
      setCustomerToReject(null);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to reject application";
      toast.error(errorMessage);
    },
  });

  const filteredCustomers = assignedCustomers.filter(
    (customer) =>
      customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.policyDetails?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (applicationId, newStatus, customerName) => {
    if (newStatus === "rejected") {
      const customer = assignedCustomers.find(
        (app) => app._id === applicationId
      );
      setCustomerToReject(customer);
      setIsRejectModalOpen(true);
    } else {
      updateApplicationStatus.mutate({
        applicationId,
        status: newStatus,
      });
    }
  };

  const handleRejectWithFeedback = () => {
    if (!rejectionFeedback.trim()) {
      toast.error("Please provide rejection feedback");
      return;
    }

    if (customerToReject) {
      rejectApplication.mutate({
        applicationId: customerToReject._id,
        feedback: rejectionFeedback.trim(),
      });
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      under_review: { variant: "outline", label: "Under Review" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCoverageAmount = (customer) => {
    return parseInt(customer.quoteData?.coverageAmount) || 0;
  };

  const getDurationYears = (customer) => {
    return `${customer.quoteData?.duration || "N/A"} years`;
  };

  const getMonthlyPremium = (customer) => {
    return (
      customer.estimatedPremium?.monthly?.$numberInt ||
      customer.estimatedPremium?.monthly ||
      0
    );
  };

  const formatCurrency = (amount) => {
    const numericAmount =
      typeof amount === "number" ? amount : parseInt(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <p>Failed to load assigned customers.</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Assigned Customers
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your assigned customer applications
            </p>
            <div className="text-sm text-muted-foreground">
              Agent: {user?.email}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Assigned
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {assignedCustomers.length}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      assignedCustomers.filter(
                        (app) => app.status === "pending"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Loader2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      assignedCustomers.filter(
                        (app) => app.status === "approved"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Under Review</p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      assignedCustomers.filter(
                        (app) => app.status === "under_review"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Customer Applications
            </CardTitle>
            <CardDescription>
              {filteredCustomers.length} of {assignedCustomers.length} customers
              shown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-foreground">
                  Loading assigned customers...
                </span>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Policy
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Applied Date
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Coverage Amount
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer._id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {customer.fullName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">
                            {customer.policyDetails?.title || "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.policyDetails?.category || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            {formatDate(customer.appliedAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {formatCurrency(getCoverageAmount(customer))}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(customer.status)}
                            <Select
                              value={customer.status}
                              onValueChange={(newStatus) =>
                                handleStatusChange(
                                  customer._id,
                                  newStatus,
                                  customer.fullName
                                )
                              }
                              disabled={updateApplicationStatus.isLoading}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="under_review">
                                  Under Review
                                </SelectItem>
                                <SelectItem value="approved">
                                  Approve
                                </SelectItem>
                                <SelectItem value="rejected">Reject</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(customer)}
                            className="border-border hover:bg-muted text-foreground"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No assigned customers found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You currently have no customers assigned to you"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rejection Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-foreground flex items-center gap-2 justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
              Reject Application
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/70">
              Provide feedback for rejecting {customerToReject?.fullName}'s
              application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col">
              <Label
                htmlFor="rejectionFeedback"
                className="text-sm font-medium text-foreground"
              >
                Rejection Reason *
              </Label>
              <Textarea
                id="rejectionFeedback"
                placeholder="Please provide specific reasons for rejecting this application. This feedback will be visible to the customer."
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                rows={5}
                className="resize-none border-border focus:border-primary bg-background mt-2 p-2"
                required
              />
              <div className="text-sm text-muted-foreground mt-2">
                {rejectionFeedback.length}/500 characters
              </div>
            </div>

            {customerToReject && (
              <div className="bg-muted/50 p-3 rounded-lg border border-border">
                <h4 className="font-semibold text-sm text-foreground mb-2">
                  Application Details:
                </h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Customer:</span>{" "}
                    {customerToReject.fullName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Policy:</span>{" "}
                    {customerToReject.policyDetails?.title}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coverage:</span>{" "}
                    {formatCurrency(getCoverageAmount(customerToReject))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionFeedback("");
                setCustomerToReject(null);
              }}
              disabled={rejectApplication.isLoading}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejectWithFeedback}
              disabled={
                rejectApplication.isLoading || !rejectionFeedback.trim()
              }
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {rejectApplication.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Customer Application Details
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              Complete information for {selectedCustomer?.fullName}'s
              application
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
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
                    <div className="mt-1">
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Applied On</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedCustomer.appliedAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Policy</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.policyDetails?.title || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Category</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.policyDetails?.category || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Full Name</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.fullName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Email</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Phone</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">NID Number</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.nidNumber}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold">Address</Label>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Policy Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(getCoverageAmount(selectedCustomer))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Coverage Amount
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {getDurationYears(selectedCustomer)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Term Duration
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-xl border border-border">
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(getMonthlyPremium(selectedCustomer))}/mo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Monthly Premium
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nominee Information */}
              {selectedCustomer.nomineeName && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Nominee Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">
                        Nominee Name
                      </Label>
                      <p className="text-sm text-foreground">
                        {selectedCustomer.nomineeName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">
                        Relationship
                      </Label>
                      <p className="text-sm text-foreground">
                        {selectedCustomer.nomineeRelationship}
                      </p>
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

export default AssignedCustomers;
