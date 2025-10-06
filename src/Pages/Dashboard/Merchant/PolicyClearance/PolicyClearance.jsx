import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { ClaimLoading } from "@/Components/Loading/Loading";

const PolicyClearance = () => {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: claims = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-claims"],
    queryFn: async () => {
      const response = await axiosSecure.get("/claims");
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (claimId) => {
      const response = await axiosSecure.patch(`/claims/${claimId}/approve`);
      return response.data;
    },
    onSuccess: (data, claimId) => {
      Swal.fire({
        title: "Claim Approved!",
        text: `Claim #${claimId.substring(
          0,
          8
        )} has been successfully approved.`,
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#10b981",
        background: "oklch(0.9914 0.0098 87.4695)",
        color: "oklch(0.3760 0.0225 64.3434)",
      });
      queryClient.invalidateQueries(["all-claims"]);
    },
    onError: (error) => {
      toast.error("Failed to approve claim: " + error.message);
    },
  });

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleApprove = (claimId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this claim. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
      background: "oklch(0.9914 0.0098 87.4695)",
      color: "oklch(0.3760 0.0225 64.3434)",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(claimId);
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClaim(null);
  };

  const handleDownload = async (documentUrl, fileName) => {
    try {
      const fullUrl = documentUrl.startsWith("http")
        ? documentUrl
        : `https://assignment-12-server-sooty.vercel.app${documentUrl}`;

      // Open in new tab for viewing
      window.open(fullUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const pendingClaims = claims.filter((claim) => claim.status === "pending");
  const approvedClaims = claims.filter((claim) => claim.status === "approved");
  const rejectedClaims = claims.filter((claim) => claim.status === "rejected");

  if (isLoading) {
    return <ClaimLoading></ClaimLoading>;
  }

  if (error) {
    return (
      <div className="alert alert-error bg-destructive text-destructive-foreground">
        <span>Error loading claims: {error.message}</span>
      </div>
    );
  }

  const ClaimTable = ({ claims, status, title, description }) => (
    <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-6 border-b border-border bg-sidebar/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground font-sans mt-1">
              {description}
            </p>
          </div>
          <div
            className={`badge badge-lg font-sans px-4 py-3 ${
              status === "pending"
                ? "bg-warning/20 text-warning border-warning/30"
                : status === "approved"
                ? "bg-success/20 text-success border-success/30"
                : "bg-error/20 text-error border-error/30"
            }`}
          >
            {claims.length} {status}
          </div>
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            No {status} Claims
          </h3>
          <p className="text-muted-foreground font-sans">
            {status === "pending"
              ? "All claims have been processed and reviewed"
              : `No claims have been ${status} yet`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-sidebar/50 border-b border-border">
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Policy Details
                </th>
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Customer
                </th>
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Application
                </th>
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Submitted
                </th>
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Document
                </th>
                <th className="font-serif font-semibold text-foreground p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, index) => (
                <tr
                  key={claim._id}
                  className={`border-b border-border transition-colors ${
                    index % 2 === 0
                      ? "bg-card hover:bg-sidebar/30"
                      : "bg-sidebar/10 hover:bg-sidebar/40"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-serif font-semibold text-foreground">
                      {claim.policyName}
                    </div>
                    <div
                      className={`badge badge-outline badge-sm font-sans mt-2 px-3 py-2 ${
                        claim.status === "pending"
                          ? "bg-warning/10 text-warning border-warning/30"
                          : claim.status === "approved"
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-error/10 text-error border-error/30"
                      }`}
                    >
                      {claim.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-sans text-foreground">
                      {claim.userEmail}
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="font-mono text-xs bg-muted text-foreground px-3 py-2 rounded-lg border border-border">
                      {claim.applicationId}
                    </code>
                  </td>
                  <td className="p-4">
                    <div className="font-sans text-sm text-foreground">
                      {new Date(claim.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="font-sans text-xs text-muted-foreground">
                      {new Date(claim.submittedAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        handleDownload(
                          claim.documentUrl,
                          claim.originalFileName
                        )
                      }
                      className="btn btn-ghost btn-sm font-sans text-primary hover:text-primary/80 hover:bg-primary/10 border border-transparent hover:border-primary/20 px-3"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <button
                        onClick={() => handleViewDetails(claim)}
                        className="btn btn-outline btn-sm font-sans text-foreground border-border hover:bg-accent hover:border-accent px-3"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Details
                      </button>

                      {claim.status === "pending" && (
                        <button
                          onClick={() => handleApprove(claim._id)}
                          disabled={approveMutation.isLoading}
                          className="btn btn-sm font-sans bg-success text-success-foreground hover:bg-success/90 border-success hover:border-success/90 px-3"
                        >
                          {approveMutation.isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                      )}

                      {claim.status === "approved" && (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Claim Approved!",
                              text: `This claim was approved on ${
                                claim.approvedAt
                                  ? new Date(
                                      claim.approvedAt
                                    ).toLocaleDateString()
                                  : "recently"
                              }.`,
                              icon: "success",
                              confirmButtonText: "OK",
                              confirmButtonColor: "#10b981",
                              background: "oklch(0.9914 0.0098 87.4695)",
                              color: "oklch(0.3760 0.0225 64.3434)",
                            });
                          }}
                          className="btn btn-sm font-sans bg-success text-success-foreground border-success opacity-80 px-3"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Approved
                        </button>
                      )}

                      {claim.status === "rejected" && (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Claim Rejected",
                              text: `This claim was rejected. Please contact admin for more details.`,
                              icon: "error",
                              confirmButtonText: "OK",
                              confirmButtonColor: "#6b7280",
                              background: "oklch(0.9914 0.0098 87.4695)",
                              color: "oklch(0.3760 0.0225 64.3434)",
                            });
                          }}
                          className="btn btn-sm font-sans bg-error text-error-foreground border-error opacity-80 px-3"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Rejected
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Policy Clearance - Agent Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
          Policy Clearance
        </h1>
        <p className="text-muted-foreground font-sans mt-3 text-lg">
          Review and manage insurance claims with comprehensive oversight
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Total Claims
              </p>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">
                {claims.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Pending Review
              </p>
              <p className="text-3xl font-serif font-bold text-warning mt-2">
                {pendingClaims.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Approved
              </p>
              <p className="text-3xl font-serif font-bold text-success mt-2">
                {approvedClaims.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Rejected
              </p>
              <p className="text-3xl font-serif font-bold text-destructive mt-2">
                {rejectedClaims.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Tables */}
      <ClaimTable
        claims={pendingClaims}
        status="pending"
        title="Pending Claims"
        description="Claims awaiting your review and approval"
      />

      <ClaimTable
        claims={approvedClaims}
        status="approved"
        title="Approved Claims"
        description="Successfully processed and approved claims"
      />

      <ClaimTable
        claims={rejectedClaims}
        status="rejected"
        title="Rejected Claims"
        description="Claims that have been declined or rejected"
      />

      {/* Claim Details Modal */}
      {isModalOpen && selectedClaim && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl bg-card border border-border shadow-2xl p-0 overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-sidebar border-b border-border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    Claim Review
                  </h3>
                  <p className="text-muted-foreground font-sans mt-1">
                    Detailed information for policy claim
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="btn btn-ghost btn-sm btn-circle text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Policy Information */}
                <div className="space-y-4">
                  <h4 className="font-serif font-semibold text-lg text-foreground border-b border-border pb-2">
                    Policy Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="label font-sans text-sm text-muted-foreground">
                        Policy Name
                      </label>
                      <div className="font-serif text-foreground text-lg">
                        {selectedClaim.policyName}
                      </div>
                    </div>

                    <div>
                      <label className="label font-sans text-sm text-muted-foreground">
                        Application ID :
                      </label>
                      <code className="font-mono text-sm bg-muted text-foreground ml-2 sm:ml-4 px-3 py-2 rounded-lg border border-border">
                        {selectedClaim.applicationId}
                      </code>
                    </div>

                    <div>
                      <label className="label font-sans text-sm text-muted-foreground">
                        Status :
                      </label>
                      <div
                        className={`badge badge-lg font-sans px-4 py-3 ml-2 sm:ml-3  ${
                          selectedClaim.status === "pending"
                            ? "bg-warning/20 text-warning border-warning/30"
                            : selectedClaim.status === "approved"
                            ? "bg-success/20 text-success border-success/30"
                            : "bg-error/20 text-error border-error/30"
                        }`}
                      >
                        {selectedClaim.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="font-serif font-semibold text-lg text-foreground border-b border-border pb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="label font-sans text-sm text-muted-foreground">
                        Email Address
                      </label>
                      <div className="font-sans text-foreground text-lg">
                        {selectedClaim.userEmail}
                      </div>
                    </div>

                    <div>
                      <label className="label font-sans text-sm text-muted-foreground">
                        Submitted Date
                      </label>
                      <div className="font-sans text-foreground">
                        {new Date(
                          selectedClaim.submittedAt
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          selectedClaim.submittedAt
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Reason */}
              <div>
                <label className="label font-sans text-sm text-muted-foreground">
                  Reason for Claim
                </label>
                <div className="bg-sidebar border border-border rounded-lg p-4 min-h-24">
                  <p className="font-sans text-foreground leading-relaxed">
                    {selectedClaim.reason}
                  </p>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <label className="label font-sans text-sm text-muted-foreground">
                  Supporting Document
                </label>
                <div className="bg-sidebar border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-serif font-semibold text-foreground text-lg">
                        {selectedClaim.originalFileName}
                      </div>
                      <div className="font-sans text-sm text-muted-foreground mt-1">
                        Size:{" "}
                        {(selectedClaim.fileSize / 1024 / 1024).toFixed(2)} MB •
                        Type: {selectedClaim.fileType}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleDownload(
                          selectedClaim.documentUrl,
                          selectedClaim.originalFileName
                        )
                      }
                      className="btn btn-primary font-sans bg-primary hover:bg-primary/90 border-primary hover:border-primary/90"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Document
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action p-6 border-t border-border bg-sidebar">
              <button
                onClick={handleCloseModal}
                className="btn btn-ghost font-sans text-foreground border-border hover:bg-accent"
              >
                Close Review
              </button>
              {selectedClaim.status === "pending" && (
                <button
                  onClick={() => {
                    handleApprove(selectedClaim._id);
                    handleCloseModal();
                  }}
                  disabled={approveMutation.isLoading}
                  className="btn btn-success font-sans text-success-foreground bg-success hover:bg-success/90 border-success hover:border-success/90"
                >
                  {approveMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Processing Approval...
                    </>
                  ) : (
                    "Approve Claim"
                  )}
                </button>
              )}
              {selectedClaim.status === "approved" && (
                <button
                  onClick={() => {
                    Swal.fire({
                      title: "Claim Already Approved",
                      text: `This claim was approved on ${
                        selectedClaim.approvedAt
                          ? new Date(
                              selectedClaim.approvedAt
                            ).toLocaleDateString()
                          : "recently"
                      }.`,
                      icon: "info",
                      confirmButtonText: "OK",
                      confirmButtonColor: "#10b981",
                      background: "oklch(0.9914 0.0098 87.4695)",
                      color: "oklch(0.3760 0.0225 64.3434)",
                    });
                  }}
                  className="btn btn-success font-sans text-success-foreground bg-success border-success opacity-80"
                >
                  View Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyClearance;
