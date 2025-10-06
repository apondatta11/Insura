import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const PaymentStatus = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: approvedApplications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["approvedApplicationsWithPayments", user?.email],
    queryFn: async () => {
      console.log("📋 Fetching approved applications for:", user?.email);
      
      const applicationsResponse = await axiosSecure.get(
        `/applications?email=${user?.email}&status=approved`
      );
      
      const applications = applicationsResponse.data;
      console.log(" Approved applications:", applications);

      const applicationsWithPaymentStatus = await Promise.all(
        applications.map(async (app) => {
          try {
            const paymentResponse = await axiosSecure.get(
              `/payments?applicationId=${app._id}`
            );
            
            const hasPayment = paymentResponse.data && paymentResponse.data.length > 0;
            const paymentStatus = hasPayment ? 'paid' : 'due';
            
            return {
              ...app,
              paymentStatus, 
              hasPayment
            };
          } catch (error) {
            console.error(`Error checking payment for application ${app._id}:`, error);
            return {
              ...app,
              paymentStatus: 'due', 
              hasPayment: false
            };
          }
        })
      );

      return applicationsWithPaymentStatus;
    },
    enabled: !!user?.email,
  });

  const handlePayNow = (application) => {
    const policyData = {
      _id: application._id,
      policyName: application.policyDetails?.title,
      coverageAmount: getCoverageAmount(application),
      premiumAmount: getPremiumAmount(application),
      duration: getDuration(application),
      frequency: "monthly",
      applicationData: application,
    };

    navigate("/dashboard/payment", {
      state: {
        policy: policyData,
      },
    });
  };

  const formatCurrency = (amount) => {
    const numericAmount = typeof amount === "number" ? amount : parseInt(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { variant: "default", label: "Paid", icon: CheckCircle },
      due: { variant: "destructive", label: "Due", icon: AlertCircle },
      pending: { variant: "secondary", label: "Pending", icon: Clock },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
      icon: Clock,
    };
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatus = (application) => {
    return application.paymentStatus || 'due';
  };

  const getNextDueDate = (application) => {
    if (application.paymentStatus === 'paid' && application.lastPaymentDate) {
      const lastPaymentDate = new Date(application.lastPaymentDate);
      const nextDueDate = new Date(lastPaymentDate);
      nextDueDate.setDate(nextDueDate.getDate() + 30);
      return nextDueDate;
    } else {
      const appliedDate = new Date(application.appliedAt);
      const nextDueDate = new Date(appliedDate);
      nextDueDate.setDate(nextDueDate.getDate() + 30);
      return nextDueDate;
    }
  };

  const getPremiumAmount = (application) => {
    return (
      application.estimatedPremium?.monthly?.$numberInt ||
      application.estimatedPremium?.monthly ||
      application.estimatedPremium?.annual?.$numberInt ||
      application.estimatedPremium?.annual ||
      0
    );
  };

  const getCoverageAmount = (application) => {
    return application.quoteData?.coverageAmount || 0;
  };

  const getDuration = (application) => {
    return application.quoteData?.duration || "N/A";
  };

  const totalPolicies = approvedApplications.length;
  const paidPolicies = approvedApplications.filter(
    (app) => getPaymentStatus(app) === 'paid'
  ).length;
  const duePolicies = approvedApplications.filter(
    (app) => getPaymentStatus(app) === 'due'
  ).length;
  const totalMonthlyPremium = approvedApplications.reduce(
    (sum, app) => sum + getPremiumAmount(app),
    0
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <div className="text-destructive mb-4">
              <p>Failed to load payment status.</p>
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
        {/* Header and Stats Cards remain the same */}
        {/* ... */}

        {/* Payment Status Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Policy Payment Status
            </CardTitle>
            <CardDescription>
              {approvedApplications.length} approved policies - {paidPolicies} paid, {duePolicies} due
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-foreground">
                  Loading payment status...
                </span>
              </div>
            ) : approvedApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Policy Details
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Coverage Amount
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Premium Amount
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Payment Frequency
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Next Due Date
                      </TableHead>
                      <TableHead className="font-semibold text-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedApplications.map((application) => {
                      const paymentStatus = getPaymentStatus(application);
                      const premiumAmount = getPremiumAmount(application);
                      const coverageAmount = getCoverageAmount(application);
                      const nextDueDate = getNextDueDate(application);
                      const duration = getDuration(application);

                      return (
                        <TableRow
                          key={application._id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-foreground">
                                {application.policyDetails?.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Category: {application.policyDetails?.category}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Duration: {duration} years
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            {formatCurrency(coverageAmount)}
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              {formatCurrency(premiumAmount)}
                              <span className="text-sm text-muted-foreground">
                                /mo
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Monthly</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              {formatDate(nextDueDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {paymentStatus === "due" && (
                              <Button
                                size="sm"
                                onClick={() => handlePayNow(application)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                            )}
                            {paymentStatus === "paid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="border-border text-muted-foreground"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Paid
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                  applications are approved by our team, they will appear here
                  for payment.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild>
                    <a href="/policies">Browse Policies</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard/my-policies">View My Applications</a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        {/* {approvedApplications.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Payment Instructions
              </CardTitle>
              <CardDescription>
                How to manage your policy payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Payment Process
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        All approved policies start with{" "}
                        <Badge variant="destructive" className="text-xs">
                          Due
                        </Badge>{" "}
                        status
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        Click <strong>Pay Now</strong> to process your payment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        After payment, status changes to{" "}
                        <Badge variant="default" className="text-xs">
                          Paid
                        </Badge>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>Next payment due in 30 days from approval</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Important Notes
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        Payments are required to keep your policy active
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>Late payments may affect policy benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        Contact support for payment issues or questions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>Auto-pay options available upon request</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default PaymentStatus;
