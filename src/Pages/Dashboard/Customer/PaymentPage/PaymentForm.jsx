import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, CreditCard, CheckCircle } from 'lucide-react';

const PaymentForm = ({ amount, clientSecret, onSuccess, isConfirming }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            setError('Payment system not ready. Please try again.');
            return;
        }

        setProcessing(true);
        setError('');

        const card = elements.getElement(CardElement);

        if (!card) {
            setError('Card element not found');
            setProcessing(false);
            return;
        }

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
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment succeeded!');
                    setError('');
                    // Call the success callback with payment intent data
                    onSuccess(result.paymentIntent);
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError('An unexpected error occurred. Please try again.');
            setProcessing(false);
        }
    };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "var(--stripe-text)",
        backgroundColor: "var(--stripe-background)",
        fontFamily: "var(--font-sans), sans-serif",
        "::placeholder": {
          color: "var(--stripe-placeholder)",
        },
        iconColor: "var(--stripe-focus)",
        padding: "12px 14px",
        border: "1px solid var(--stripe-border)",
        borderRadius: "6px",
      },
      invalid: {
        color: "var(--stripe-error)",
        iconColor: "var(--stripe-error)",
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
                {(processing || isConfirming) ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isConfirming ? 'Processing...' : 'Processing...'}
                    </>
                ) : (
                    <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Pay ${amount}
                    </>
                )}
            </Button>

            {/* Security Footer */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Powered by Stripe • PCI DSS compliant</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Test Card: 4242 4242 4242 4242 • Any future date • Any CVC • Any ZIP
                </p>
            </div>
        </form>
    );
};

export default PaymentForm;