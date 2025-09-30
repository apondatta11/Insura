// src/pages/dashboard/customer/PaymentSuccess.jsx
// import React from 'react';
// import { useLocation, useNavigate, Link } from 'react-router';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { CheckCircle, Download, Home, FileText } from 'lucide-react';

// const PaymentSuccess = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { paymentData, policy } = location.state || {};

//     return (
//         <div className="min-h-screen bg-background p-6 flex items-center justify-center">
//             <div className="max-w-md w-full">
//                 <Card className="border-green-200 bg-green-50/50">
//                     <CardContent className="p-6 text-center">
//                         <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//                         <h2 className="text-2xl font-bold text-foreground mb-2">
//                             Payment Successful!
//                         </h2>
//                         <p className="text-muted-foreground mb-6">
//                             Your payment has been processed successfully. Your policy is now active.
//                         </p>

//                         {paymentData && (
//                             <div className="bg-white p-4 rounded-lg border border-green-200 mb-6 text-left">
//                                 <div className="space-y-2 text-sm">
//                                     <div className="flex justify-between">
//                                         <span className="text-muted-foreground">Amount Paid:</span>
//                                         <span className="font-semibold">${paymentData.amount}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-muted-foreground">Payment ID:</span>
//                                         <span className="font-mono text-xs">{paymentData.paymentIntentId}</span>
//                                     </div>
//                                     {policy && (
//                                         <div className="flex justify-between">
//                                             <span className="text-muted-foreground">Policy:</span>
//                                             <span className="font-semibold">{policy.policyName}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         <div className="flex flex-col gap-3">
//                             <Button asChild className="w-full">
//                                 <Link to="/dashboard/my-policies">
//                                     <FileText className="h-4 w-4 mr-2" />
//                                     View My Policies
//                                 </Link>
//                             </Button>
//                             <Button variant="outline" asChild className="w-full">
//                                 <Link to="/dashboard">
//                                     <Home className="h-4 w-4 mr-2" />
//                                     Go to Dashboard
//                                 </Link>
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default PaymentSuccess;

// src/pages/dashboard/customer/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate, Link } from "react-router";
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
  CheckCircle,
  Download,
  Home,
  FileText,
  Shield,
  Calendar,
  DollarSign,
  User,
  Mail,
} from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentData, policy } = location.state || {};

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your insurance policy is now active and protected
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Success Card */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-foreground flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Policy Activated
              </CardTitle>
              <CardDescription>
                Your coverage starts immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Policy Details */}
              {policy && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {policy.policyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Insurance Policy
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-primary text-primary-foreground"
                    >
                      Active
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Coverage Amount</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(policy.coverageAmount || 0)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Policy Duration</p>
                      <p className="font-semibold text-foreground">
                        {policy.duration} years
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Premium</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(policy.premiumAmount || 0)}/month
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-semibold text-foreground">
                        {formatDate()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Confirmation */}
              {paymentData && (
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Payment Confirmation
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(paymentData.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Transaction ID
                      </span>
                      <span className="font-mono text-xs text-foreground">
                        {paymentData.transactionId?.slice(-8) ||
                          paymentData.paymentIntentId?.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment Date
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatDate(paymentData.paymentDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="default"
                        className="bg-green-500 text-white"
                      >
                        Completed
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Sidebar */}
<Card className="bg-card border-border h-fit min-w-0">
    <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-lg">
            Next Steps
        </CardTitle>
        <CardDescription className="break-words">
            What would you like to do next?
        </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start h-auto min-h-12 py-3" size="lg">
            <Link to="/dashboard/my-policies" className="flex items-center gap-3 w-full">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold text-sm whitespace-normal break-words">View Policies</div>
                    <div className="text-xs opacity-80 whitespace-normal break-words leading-tight mt-1">Manage your insurance policies</div>
                </div>
            </Link>
        </Button>

        <Button variant="outline" asChild className="w-full justify-start h-auto min-h-12 py-3" size="lg">
            <Link to="/dashboard" className="flex items-center gap-3 w-full">
                <Home className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold text-sm whitespace-normal break-words">Dashboard</div>
                    <div className="text-xs opacity-80 whitespace-normal break-words leading-tight mt-1">Return to main dashboard</div>
                </div>
            </Link>
        </Button>

        <Button variant="outline" asChild className="w-full justify-start h-auto min-h-12 py-3" size="lg">
            <Link to="/policies" className="flex items-center gap-3 w-full">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                    <div className="font-semibold text-sm whitespace-normal break-words">Browse More</div>
                    <div className="text-xs opacity-80 whitespace-normal break-words leading-tight mt-1">Explore additional coverage</div>
                </div>
            </Link>
        </Button>
              {/* Download Option */}
              {/* <div className="pt-4 border-t border-border">
                                <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Receipt
                                </Button>
                            </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="bg-card border-border mt-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-blue-900/20">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  24/7 Protection
                </h4>
                <p className="text-muted-foreground">
                  Your coverage starts immediately and is active round the clock
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-green-900/20">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  Digital Policy
                </h4>
                <p className="text-muted-foreground">
                  Access your policy documents anytime in your dashboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-purple-900/20">
                  <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  Support Ready
                </h4>
                <p className="text-muted-foreground">
                  Our team is available to assist you with any questions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
