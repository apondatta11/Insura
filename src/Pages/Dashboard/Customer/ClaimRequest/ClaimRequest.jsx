// src/Pages/Dashboard/Customer/ClaimRequest.jsx
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Download,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const ClaimRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [reason, setReason] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch approved policies (applications)
  const {
    data: approvedApplications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approvedApplicationsForClaims", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/applications?email=${user?.email}&status=approved`
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Fetch existing claims
  const { data: existingClaims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ["userClaims", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/claims?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });
  // Combine applications with claim status - all logic on frontend
  const applicationsWithClaimStatus = approvedApplications.map(
    (application) => {
      const existingClaim = existingClaims.find(
        (claim) => claim.applicationId === application._id
      );

      return {
        ...application,
        claimStatus: existingClaim ? existingClaim.status : "not_claimed",
        existingClaim: existingClaim,
      };
    }
  );

  // Policies eligible for new claims (not_claimed status)
  const eligiblePolicies = applicationsWithClaimStatus.filter(
    (app) => app.claimStatus === "not_claimed"
  );

  // Submit claim mutation
  const submitClaim = useMutation({
    mutationFn: async (claimData) => {
      const response = await axiosSecure.post("/claims", claimData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Claim submitted successfully!");
      queryClient.invalidateQueries(["userClaims"]);
      resetForm();
    },
    onError: (error) => {
      if (
        error.response?.data?.message ===
        "Claim already submitted for this policy"
      ) {
        toast.error("Claim already exists for this policy");
        queryClient.invalidateQueries(["userClaims"]); // Refresh claims data
      } else {
        toast.error("Failed to submit claim");
      }
      console.error("Claim submission error:", error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and size
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or image file (JPEG, PNG, JPG)");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setDocumentFile(file);
    }
  };

  //   const handleSubmitClaim = async () => {
  //     if (!selectedPolicy) {
  //       toast.error("Please select a policy");
  //       return;
  //     }

  //     if (!reason.trim()) {
  //       toast.error("Please provide a reason for the claim");
  //       return;
  //     }

  //     if (!documentFile) {
  //       toast.error("Please upload a supporting document");
  //       return;
  //     }

  //     // Double-check on frontend that policy is still eligible
  //     const currentPolicyStatus = applicationsWithClaimStatus.find(
  //       (app) => app._id === selectedPolicy._id
  //     )?.claimStatus;

  //     if (currentPolicyStatus !== "not_claimed") {
  //       toast.error("This policy already has a claim submitted");
  //       queryClient.invalidateQueries(["userClaims"]); // Refresh data
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     try {
  //       // In a real app, you'd upload the file to cloud storage
  //       // For now, we'll simulate file upload and store file name
  //       const documentUrl = `uploaded/${documentFile.name}`;

  //       const claimData = {
  //         applicationId: selectedPolicy._id,
  //         policyName: getPolicyName(selectedPolicy), // Use the direct function
  //         reason: reason.trim(),
  //         documentUrl: documentUrl,
  //         userEmail: user.email,
  //       };

  //       submitClaim.mutate(claimData);
  //     } catch (error) {
  //       toast.error("Failed to process claim");
  //       console.error("Claim processing error:", error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  // Update the handleSubmitClaim function in ClaimRequest.jsx

  const handleSubmitClaim = async () => {
    if (!selectedPolicy) {
      toast.error("Please select a policy");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for the claim");
      return;
    }

    if (!documentFile) {
      toast.error("Please upload a supporting document");
      return;
    }

    // Double-check on frontend that policy is still eligible
    const currentPolicyStatus = applicationsWithClaimStatus.find(
      (app) => app._id === selectedPolicy._id
    )?.claimStatus;

    if (currentPolicyStatus !== "not_claimed") {
      toast.error("This policy already has a claim submitted");
      queryClient.invalidateQueries(["userClaims"]); // Refresh data
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("document", documentFile);
      formData.append("applicationId", selectedPolicy._id);
      formData.append("policyName", getPolicyName(selectedPolicy));
      formData.append("reason", reason.trim());
      formData.append("userEmail", user.email);

      const response = await axiosSecure.post("/claims", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Claim submitted successfully!");
      queryClient.invalidateQueries(["userClaims"]);
      resetForm();
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Claim already submitted for this policy"
      ) {
        toast.error("Claim already exists for this policy");
        queryClient.invalidateQueries(["userClaims"]);
      } else if (
        error.response?.data?.message?.includes("Only PDF, JPEG, JPG, and PNG")
      ) {
        toast.error(
          "Invalid file type. Please upload PDF, JPEG, JPG, or PNG files only."
        );
      } else if (error.response?.data?.message?.includes("File too large")) {
        toast.error("File size must be less than 5MB");
      } else {
        toast.error("Failed to submit claim");
      }
      console.error("Claim submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedPolicy(null);
    setReason("");
    setDocumentFile(null);
  };

  const getClaimStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending", icon: Clock },
      approved: { variant: "default", label: "Approved", icon: CheckCircle },
      rejected: {
        variant: "destructive",
        label: "Rejected",
        icon: AlertCircle,
      },
      not_claimed: { variant: "outline", label: "Not Claimed", icon: FileText },
    };

    const config = statusConfig[status] || statusConfig.not_claimed;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleApprovedClaimClick = (claim) => {
    Swal.fire({
      title: "Claim Approved!",
      html: `
        <div class="text-left">
          <p><strong>Claim ID:</strong> ${claim.claimId}</p>
          <p><strong>Policy:</strong> ${claim.policyName}</p>
          <p><strong>Submitted:</strong> ${new Date(
            claim.submittedAt
          ).toLocaleDateString()}</p>
          <p class="mt-3 text-green-600">Your claim has been approved and is being processed.</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Download Details",
      showCancelButton: true,
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate download
        toast.success("Claim details downloaded");
      }
    });
  };

  const getCoverageAmount = (application) => {
    return parseInt(application.quoteData?.coverageAmount) || 0;
  };

  const getDuration = (application) => {
    return parseInt(application.quoteData?.duration) || "N/A";
  };

  const getPolicyName = (application) => {
    return application.policyDetails?.title || "Unknown Policy";
  };

  const getPolicyCategory = (application) => {
    return application.policyDetails?.category || "General";
  };

  const getPremiumAmount = (application) => {
    return application.estimatedPremium?.monthly || 0;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <div className="text-destructive mb-4">
              <p>Failed to load policies.</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Claim Request
            </h1>
            <p className="text-muted-foreground text-lg">
              Submit claims for your approved insurance policies
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span>Secure claim processing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claim Form Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Submit New Claim
              </CardTitle>
              <CardDescription>
                Fill out the form below to submit a claim request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Policy Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Policy *
                </label>
                <select
                  value={selectedPolicy?._id || ""}
                  onChange={(e) => {
                    const policyId = e.target.value;
                    const policy = eligiblePolicies.find(
                      (app) => app._id === policyId
                    );
                    setSelectedPolicy(policy);
                  }}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                  disabled={isLoading || claimsLoading}
                >
                  <option value="">Choose a policy...</option>
                  {eligiblePolicies.map((application) => (
                    <option key={application._id} value={application._id}>
                      {getPolicyName(application)} - $
                      {getCoverageAmount(application)?.toLocaleString()}{" "}
                      Coverage
                    </option>
                  ))}
                </select>
                {selectedPolicy && (
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-sm font-medium text-foreground">
                      {getPolicyName(selectedPolicy)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coverage: $
                      {getCoverageAmount(selectedPolicy)?.toLocaleString()} |
                      Duration: {getDuration(selectedPolicy)} years | Premium: $
                      {getPremiumAmount(selectedPolicy)}/month
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Category: {getPolicyCategory(selectedPolicy)}
                    </p>
                  </div>
                )}

                {eligiblePolicies.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground">
                    No policies available for new claims. All approved policies
                    already have claims submitted.
                  </p>
                )}
              </div>

              {/* Reason for Claim */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Reason for Claim *
                </label>
                <Textarea
                  placeholder="Please describe the reason for your claim in detail..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Supporting Document *
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {documentFile
                      ? documentFile.name
                      : "Upload PDF or image file (max 5MB)"}
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("document-upload").click()
                    }
                  >
                    Choose File
                  </Button>
                  {documentFile && (
                    <p className="text-xs text-green-600 mt-2">
                      File selected: {documentFile.name}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitClaim}
                disabled={
                  !selectedPolicy ||
                  !reason.trim() ||
                  !documentFile ||
                  isSubmitting
                }
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Claim...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Claim Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Approved Policies List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                Your Approved Policies
              </CardTitle>
              <CardDescription>
                Policies eligible for claim requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading || claimsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-foreground">
                    Loading policies...
                  </span>
                </div>
              ) : applicationsWithClaimStatus.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-foreground">
                          Policy Name
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Coverage
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Claim Status
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicationsWithClaimStatus.map((application) => (
                        <TableRow
                          key={application._id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="font-medium text-foreground">
                              {getPolicyName(application)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getPolicyCategory(application)}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            ${getCoverageAmount(application)?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getClaimStatusBadge(application.claimStatus)}
                          </TableCell>
                          <TableCell className="text-right">
                            {application.claimStatus === "not_claimed" && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedPolicy(application)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Claim
                              </Button>
                            )}
                            {application.claimStatus === "pending" && (
                              <Button size="sm" variant="outline" disabled>
                                <Clock className="h-4 w-4 mr-1" />
                                Pending
                              </Button>
                            )}
                            {application.claimStatus === "approved" && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  handleApprovedClaimClick(
                                    application.existingClaim
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approved
                              </Button>
                            )}
                            {application.claimStatus === "rejected" && (
                              <Button size="sm" variant="outline" disabled>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Rejected
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No approved policies found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    You don't have any approved policies yet. Once your
                    applications are approved, they will appear here for claim
                    requests.
                  </p>
                  <Button asChild>
                    <a href="/dashboard/my-policies">View My Applications</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Claim Process Information
            </CardTitle>
            <CardDescription>
              How to submit and track your insurance claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Claim Submission
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Only approved policies are eligible for claims</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Provide detailed reason for your claim</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>
                      Upload supporting documents (medical reports, bills, etc.)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Processing Timeline
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>
                      Claims are typically processed within 7-14 business days
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>
                      You'll receive email notifications for status updates
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <span>Contact support for urgent claim inquiries</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClaimRequest;
