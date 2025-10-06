import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import useAuth from "@/Hooks/useAuth";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Star,
  Eye,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  User,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyPolicies = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const pdfRef = useRef();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["applications", statusFilter, user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/applications?email=${user?.email}&status=${statusFilter}`
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

  const filteredApplications = applications.filter(
    (app) =>
      app.policyDetails?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.policyDetails?.category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const submitReview = useMutation({
    mutationFn: async (reviewData) => {
      const response = await axiosSecure.post("/reviews", reviewData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setShowReview(false);
      setRating(0);
      setFeedback("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  const handleViewDetails = (application) => {
    setSelectedPolicy(application);
    setShowDetails(true);
  };

  const handleGiveReview = (application) => {
    setSelectedPolicy(application);
    setShowReview(true);
  };

  const handleViewRejection = (application) => {
    setSelectedPolicy(application);
    setShowRejection(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0 || !feedback.trim()) {
      toast.error("Please provide rating and feedback");
      return;
    }

    submitReview.mutate({
      policyId: selectedPolicy.policyId,
      policyName: selectedPolicy.policyDetails?.title,
      rating: rating,
      feedback: feedback.trim(),
      userEmail: user?.email,
    });
  };

  const generatePolicyPDF = async (application) => {
    setGeneratingPDF(true);
    try {
      // Create PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set background color for header
      pdf.setFillColor(41, 112, 255);
      pdf.rect(0, 0, 210, 40, "F");

      // Header content
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("INSURANCE POLICY DOCUMENT", 105, 20, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Official Policy Certificate", 105, 28, { align: "center" });

      // Policy details section
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, 50, 190, 40, "F");
      pdf.setTextColor(0, 0, 0);
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("POLICY INFORMATION", 20, 60);
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      // Policy details
      const policyDetails = [
        { label: "Policy Number", value: `POL-${application._id?.slice(-8) || 'N/A'}` },
        { label: "Policy Name", value: application.policyDetails?.title || 'N/A' },
        { label: "Category", value: application.policyDetails?.category || 'N/A' },
        { label: "Coverage Amount", value: formatCurrency(getCoverageAmount(application)) },
        { label: "Term Duration", value: getDurationYears(application) },
        { label: "Monthly Premium", value: formatCurrency(getMonthlyPremium(application)) },
      ];

      let yPosition = 70;
      policyDetails.forEach((detail, index) => {
        const x = index % 2 === 0 ? 20 : 110;
        if (index % 2 === 0 && index !== 0) yPosition += 8;
        
        pdf.setFont("helvetica", "bold");
        pdf.text(`${detail.label}:`, x, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.text(detail.value, x + 35, yPosition);
      });

      // Personal information section
      yPosition += 20;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, 190, 35, "F");
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("PERSONAL INFORMATION", 20, yPosition + 10);
      
      pdf.setFontSize(10);
      const personalDetails = [
        { label: "Full Name", value: application.fullName || 'N/A' },
        { label: "Email", value: application.email || 'N/A' },
        { label: "Phone", value: application.phone || 'N/A' },
        { label: "Application Date", value: new Date(application.appliedAt).toLocaleDateString() },
      ];

      yPosition += 20;
      personalDetails.forEach((detail, index) => {
        const x = index % 2 === 0 ? 20 : 110;
        if (index % 2 === 0 && index !== 0) yPosition += 8;
        
        pdf.setFont("helvetica", "bold");
        pdf.text(`${detail.label}:`, x, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.text(detail.value, x + 30, yPosition);
      });

      // Nominee information section
      yPosition += 20;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(10, yPosition, 190, 25, "F");
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("NOMINEE INFORMATION", 20, yPosition + 10);
      
      pdf.setFontSize(10);
      const nomineeDetails = [
        { label: "Nominee Name", value: application.nomineeName || 'N/A' },
        { label: "Relationship", value: application.nomineeRelationship || 'N/A' },
      ];

      yPosition += 20;
      nomineeDetails.forEach((detail, index) => {
        const x = index === 0 ? 20 : 110;
        pdf.setFont("helvetica", "bold");
        pdf.text(`${detail.label}:`, x, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.text(detail.value, x + 35, yPosition);
      });

      // Terms and conditions
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("IMPORTANT TERMS & CONDITIONS", 105, yPosition, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      const terms = [
        "This policy document is proof of your insurance coverage.",
        "Keep this document in a safe and accessible place.",
        "Premium payments must be made on time to maintain coverage.",
        "Contact customer service for any policy modifications or claims.",
        "Policy terms and conditions are subject to the insurance provider's guidelines.",
        "This document is generated electronically and is legally binding."
      ];

      yPosition += 10;
      terms.forEach(term => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`• ${term}`, 20, yPosition);
        yPosition += 6;
      });

      // Footer
      const currentDate = new Date().toLocaleDateString();
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on: ${currentDate}`, 20, 285);
      pdf.text("SecureLife Insurance Ltd.", 190, 285, { align: "right" });

      // Save the PDF
      const fileName = `policy-${application.policyDetails?.title?.replace(/\s+/g, '-').toLowerCase() || 'document'}-${application._id?.slice(-6) || 'unknown'}.pdf`;
      pdf.save(fileName);
      
      toast.success("Policy document downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate policy document");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      under_review: { variant: "secondary", label: "Under Review" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCoverageAmount = (application) => {
    return parseInt(application.quoteData?.coverageAmount) || 0;
  };

  const getDurationYears = (application) => {
    return `${application.quoteData?.duration || "N/A"} years`;
  };

  const getMonthlyPremium = (application) => {
    return (
      application.estimatedPremium?.monthly?.$numberInt ||
      application.estimatedPremium?.monthly ||
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 animate-pulse" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                  >
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-48" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              My Policies
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and track your insurance applications
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
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
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.length}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
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
                      applications.filter((app) => app.status === "approved")
                        .length
                    }
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
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
                      applications.filter((app) => app.status === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-foreground">
                    {
                      applications.filter((app) => app.status === "rejected")
                        .length
                    }
                  </p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5 text-primary" />
              Policy Applications
            </CardTitle>
            <CardDescription>
              {filteredApplications.length} of {applications.length}{" "}
              applications shown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Policy Details
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Coverage
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Applied Date
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
                    {filteredApplications.map((app) => (
                      <TableRow
                        key={app._id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground">
                              {app.policyDetails?.title}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span className="bg-muted px-2 py-1 rounded-md text-xs">
                                {app.policyDetails?.category}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-foreground">
                            {formatCurrency(getCoverageAmount(app))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(app)}
                              className="border-border hover:bg-muted text-foreground"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>

                            {app.status === "approved" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => generatePolicyPDF(app)}
                                disabled={generatingPDF}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {generatingPDF ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1" />
                                ) : (
                                  <Download className="h-4 w-4 mr-1" />
                                )}
                                PDF
                              </Button>
                            )}

                            {app.status === "approved" && !app.hasReview && (
                              <Button
                                size="sm"
                                onClick={() => handleGiveReview(app)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            )}

                            {app.status === "approved" && app.hasReview && (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                className="bg-muted text-muted-foreground"
                              >
                                Reviewed ✓
                              </Button>
                            )}

                            {app.status === "rejected" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleViewRejection(app)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejected
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No applications found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by applying for your first insurance policy"}
                </p>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="/policies">Browse Policies</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Policy Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedPolicy?.policyDetails?.title}
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              Complete policy details and coverage information
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(getCoverageAmount(selectedPolicy))}
                  </div>
                  <div className="text-sm">Coverage Amount</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {getDurationYears(selectedPolicy)}
                  </div>
                  <div className="text-sm">Term Duration</div>
                </div>
              </div>

              {/* Application Status */}
              <div className="bg-muted p-4 rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-3 text-lg">
                  Application Status
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Current Status
                    </div>
                    <div className="text-lg font-semibold">
                      {getStatusBadge(selectedPolicy.status)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Applied On
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {new Date(selectedPolicy.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Download PDF Button in Modal */}
                {selectedPolicy.status === "approved" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      onClick={() => generatePolicyPDF(selectedPolicy)}
                      disabled={generatingPDF}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {generatingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Policy Document
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Download your official policy certificate
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 text-lg">
                    Personal Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-muted-foreground">
                        Full Name
                      </span>
                      <span className="text-foreground">
                        {selectedPolicy.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-muted-foreground">
                        Email
                      </span>
                      <span className="text-foreground">
                        {selectedPolicy.email}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-muted-foreground">
                        Phone
                      </span>
                      <span className="text-foreground">
                        {selectedPolicy.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3 text-lg">
                    Nominee Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-muted-foreground">
                        Nominee Name
                      </span>
                      <span className="text-foreground">
                        {selectedPolicy.nomineeName}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="font-medium text-muted-foreground">
                        Relationship
                      </span>
                      <span className="text-foreground">
                        {selectedPolicy.nomineeRelationship}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog open={showRejection} onOpenChange={setShowRejection}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Application Rejected
                </DialogTitle>
                <DialogDescription className="text-destructive/80">
                  Your policy application was not approved
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-4">
              {/* Policy Info */}
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">
                  {selectedPolicy.policyDetails?.title}
                </h4>
                <div className="text-sm text-muted-foreground">
                  Applied on {new Date(selectedPolicy.appliedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Rejection Reason */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Reason for Rejection
                </Label>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedPolicy.rejectionFeedback || 
                     "Your application did not meet the required criteria for approval. Please review the policy requirements and consider applying again in the future."}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {selectedPolicy.rejectedAt && (
                <div className="text-xs text-muted-foreground text-center">
                  Rejected on: {new Date(selectedPolicy.rejectedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowRejection(false)}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-foreground">
              Share Your Experience
            </DialogTitle>
            <DialogDescription className="text-center text-foreground/70">
              How was your experience with{" "}
              {selectedPolicy?.policyDetails?.title}?
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <Label className="block mb-4 text-lg font-medium text-foreground">
                How would you rate this policy?
              </Label>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400 scale-110"
                          : "text-muted-foreground hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {rating === 0
                  ? "Select your rating"
                  : `${rating} star${rating > 1 ? "s" : ""} - ${
                      ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                        rating - 1
                      ]
                    }`}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <Label
                htmlFor="feedback"
                className="block mb-3 text-lg font-medium text-foreground"
              >
                Your Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us about your experience with this policy. What did you like? Any suggestions for improvement?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none border-border focus:border-primary bg-background"
                required
              />
              <div className="text-sm text-muted-foreground mt-2">
                {feedback.length}/500 characters
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReview(false)}
                disabled={submitReview.isPending}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  submitReview.isPending || rating === 0 || !feedback.trim()
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitReview.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPolicies;
