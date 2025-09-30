// src/Pages/Dashboard/Customer/PaymentForm.jsx
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, CreditCard, CheckCircle } from "lucide-react";

const PaymentForm = ({ amount, clientSecret, onSuccess, isConfirming }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!stripe || !elements) {
  //         setError('Payment system not ready. Please try again.');
  //         return;
  //     }

  //     setProcessing(true);
  //     setError('');

  //     const card = elements.getElement(CardElement);

  //     if (!card) {
  //         setError('Card element not found');
  //         setProcessing(false);
  //         return;
  //     }

  //     try {
  //         // Step 1: Create payment method
  //         const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
  //             type: 'card',
  //             card,
  //         });

  //         if (paymentMethodError) {
  //             setError(paymentMethodError.message);
  //             setProcessing(false);
  //             return;
  //         }

  //         console.log('Payment method created:', paymentMethod);

  //         // Step 2: Confirm card payment
  //         const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
  //             clientSecret,
  //             {
  //                 payment_method: {
  //                     card: elements.getElement(CardElement),
  //                 },
  //             }
  //         );

  //         if (confirmError) {
  //             setError(confirmError.message);
  //             setProcessing(false);
  //         } else {
  //             if (paymentIntent.status === 'succeeded') {
  //                 console.log('Payment succeeded!');
  //                 setError('');
  //                 // Call the success callback with payment intent data
  //                 onSuccess(paymentIntent);
  //             }
  //         }
  //     } catch (err) {
  //         console.error('Payment error:', err);
  //         setError('An unexpected error occurred. Please try again.');
  //         setProcessing(false);
  //     }
  // };

  // In your handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      // Step 1: Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");

          // Step 2: Record payment in your database
          const paymentResponse = await axiosSecure.post("/payments", {
            applicationId: policy._id,
            userEmail: user?.email,
            amount: policy.premiumAmount,
            transactionId: result.paymentIntent.id,
          });

          if (paymentResponse.data.paymentId) {
            // Success! Redirect or show success message
            queryClient.invalidateQueries(["approvedApplicationsWithPayments"]);
            onSuccess(result.paymentIntent);
          }
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#30313d",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 12px",
      },
      invalid: {
        color: "#fa755a",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Header */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Your payment is secure</p>
          <p>All transactions are encrypted and secure</p>
        </div>
      </div>

      {/* Card Element */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Information
          </label>
          <div className="p-3 border border-input rounded-md bg-background">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || processing || isConfirming}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        {processing || isConfirming ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isConfirming ? "Confirming Payment..." : "Processing..."}
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Pay ${amount}
          </>
        )}
      </Button>

      {/* Security Footer */}
      {/* <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Powered by Stripe • PCI DSS compliant</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Test Card: 4242 4242 4242 4242 • Any future date • Any CVC • Any ZIP
                </p>
            </div> */}
    </form>
  );
};

export default PaymentForm;
