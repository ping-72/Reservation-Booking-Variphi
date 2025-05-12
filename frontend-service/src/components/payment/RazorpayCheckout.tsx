import React, { useEffect, useRef } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { loadScript } from "../../utils/scripts";
import { paymentService } from "../../services/payment.service";

// Define Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

// Add Razorpay to window object
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayCheckoutProps {
  reservationId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  reservationId,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const razorpayInstance = useRef<RazorpayInstance | null>(null);

  useEffect(() => {
    const initializeRazorpay = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Razorpay script
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
          setError(
            "Razorpay SDK failed to load. Please check your internet connection."
          );
          setLoading(false);
          return;
        }

        // Create payment order
        const orderData = await paymentService.createPaymentOrder({
          reservationId,
        });

        // Configure Razorpay options
        const options: RazorpayOptions = {
          key: "rzp_test_DBN8MnMAPEImKD", // Your Razorpay Key ID
          amount: orderData.amount * 100, // Amount in smallest currency unit (paise for INR)
          currency: orderData.currency,
          name: "Flight Reservation",
          description: "Payment for flight reservation",
          order_id: orderData.id,
          handler: function (response: RazorpayResponse) {
            // Handle successful payment
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;

            // Verify payment with backend
            paymentService
              .verifyPayment({
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
                reservationId: reservationId,
              })
              .then(() => {
                onSuccess(paymentId);
              })
              .catch((error) => {
                onError(
                  error instanceof Error
                    ? error.message
                    : "Payment verification failed"
                );
              });
          },
          prefill: orderData.prefill || {
            name: "",
            email: "",
            contact: "",
          },
          notes: orderData.notes || {},
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              onError("Payment cancelled by user");
            },
          },
        };

        // Create Razorpay instance
        razorpayInstance.current = new window.Razorpay(options);

        // Open Razorpay checkout
        setTimeout(() => {
          razorpayInstance.current?.open();
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error("Razorpay initialization error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize payment. Please try again."
        );
        setLoading(false);
      }
    };

    initializeRazorpay();

    // Cleanup
    return () => {
      if (razorpayInstance.current) {
        // No explicit close method, it will auto-clean when component unmounts
      }
    };
  }, [reservationId, onSuccess, onError]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2">
          Please try again or contact customer support.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="body1">
        Razorpay checkout should open in a popup. If it doesn't appear, please
        click the button below.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <button
          onClick={() => razorpayInstance.current?.open()}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Pay Now
        </button>
      </Box>
    </Box>
  );
};

export default RazorpayCheckout;
