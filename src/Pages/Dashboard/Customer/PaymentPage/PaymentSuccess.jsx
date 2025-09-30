// src/pages/dashboard/customer/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Home, FileText } from 'lucide-react';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentData, policy } = location.state || {};

    return (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
            <div className="max-w-md w-full">
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-6 text-center">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Your payment has been processed successfully. Your policy is now active.
                        </p>

                        {paymentData && (
                            <div className="bg-white p-4 rounded-lg border border-green-200 mb-6 text-left">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount Paid:</span>
                                        <span className="font-semibold">${paymentData.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment ID:</span>
                                        <span className="font-mono text-xs">{paymentData.paymentIntentId}</span>
                                    </div>
                                    {policy && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Policy:</span>
                                            <span className="font-semibold">{policy.policyName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button asChild className="w-full">
                                <Link to="/dashboard/my-policies">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View My Policies
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link to="/dashboard">
                                    <Home className="h-4 w-4 mr-2" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccess;