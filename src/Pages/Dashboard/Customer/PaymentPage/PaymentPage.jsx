// src/Pages/Dashboard/Customer/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Shield,
  CheckCircle,
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "./PaymentForm";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [policy, setPolicy] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  // Get policy data from navigation state
  useEffect(() => {
    if (location.state?.policy) {
      setPolicy(location.state.policy);
      initializePayment(location.state.policy);
    } else {
      navigate("/dashboard/payment-status");
    }
  }, [location, navigate]);

  // Initialize payment with Stripe
  const initializePayment = async (policyData) => {
    try {
      setLoading(true);
      const response = await axiosSecure.post("/create-payment-intent", {
        amount: policyData.premiumAmount,
        applicationId: policyData._id,
        userEmail: user?.email,
      });

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  // Record payment in database
  // const recordPayment = useMutation({
  //   mutationFn: async (paymentIntent) => {
  //     const response = await axiosSecure.post("/payments", {
  //       applicationId: policy._id,
  //       userEmail: user?.email,
  //       amount: policy.premiumAmount,
  //       transactionId: paymentIntent.id,
  //     });
  //     return response.data;
  //   },
  //   onSuccess: (data) => {
  //     toast.success("Payment completed successfully!");
  //     // Refresh the payment status data
  //     queryClient.invalidateQueries(["approvedApplicationsWithPayments"]);
  //     navigate("/dashboard/payment-success", {
  //       state: {
  //         paymentData: data,
  //         policy: policy,
  //       },
  //     });
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to record payment");
  //     console.error("Payment recording error:", error);
  //   },
  // });

  // const handlePaymentSuccess = (paymentIntent) => {
  //   // Record the payment in our database
  //   recordPayment.mutate(paymentIntent);
  // };

  const recordPayment = useMutation({
    mutationFn: async (paymentIntent) => {
        const response = await axiosSecure.post("/payments", {
            applicationId: policy._id,
            userEmail: user?.email,
            amount: policy.premiumAmount,
            transactionId: paymentIntent.id,
        });
        return response.data;
    },
    onSuccess: (data) => {
        toast.success("Payment completed successfully!");
        // Refresh the payment status data
        queryClient.invalidateQueries(["approvedApplicationsWithPayments"]);
        navigate("/dashboard/payment-success", {
            state: {
                paymentData: {
                    ...data,
                    amount: policy.premiumAmount,
                    transactionId: data.paymentId // or use the actual transaction ID
                },
                policy: policy,
            },
        });
    },
    onError: (error) => {
        toast.error("Failed to record payment");
        console.error("Payment recording error:", error);
    },
});

const handlePaymentSuccess = (paymentIntent) => {
    // Record the payment in our database
    recordPayment.mutate(paymentIntent);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg mb-4">
            No policy data found
          </div>
          <Button onClick={() => navigate("/dashboard/payment-status")}>
            Back to Payments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/payment-status")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Complete Payment
            </h1>
            <p className="text-muted-foreground">
              Secure payment for your insurance policy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary Section - NOW ON THE LEFT */}
          <Card className="bg-card border-border h-fit">
            <CardHeader>
              <CardTitle className="text-foreground">Order Summary</CardTitle>
              <CardDescription>
                Review your policy and payment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Policy Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Policy Details
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Policy Name</span>
                    <span className="font-medium text-foreground">
                      {policy.policyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Coverage Amount
                    </span>
                    <span className="font-medium text-foreground">
                      ${policy.coverageAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">
                      {policy.duration} years
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* User Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Billing Information
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {user?.displayName || "Customer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.email}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Payment Summary
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Premium Amount
                    </span>
                    <span className="font-medium text-foreground">
                      ${policy.premiumAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Frequency
                    </span>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-foreground">
                      ${policy.premiumAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Secure payment powered by Stripe
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form Section - NOW ON THE RIGHT */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Enter your card information to complete the payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <PaymentForm
                  amount={policy.premiumAmount}
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  isConfirming={recordPayment.isLoading}
                />
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-foreground">Initializing payment...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;