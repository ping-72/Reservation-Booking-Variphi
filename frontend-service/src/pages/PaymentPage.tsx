import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Paper, Typography, Box, Alert } from "@mui/material";
import RazorpayCheckout from "../components/payment/RazorpayCheckout";
import PaymentSuccess from "../components/payment/PaymentSuccess";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Get the reservationId from the location state
  const reservationId = location.state?.reservationId;

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id);
    setPaymentSuccess(true);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const handleDone = () => {
    navigate("/my-bookings");
  };

  // If there's no reservationId, redirect to home
  if (!reservationId) {
    navigate("/");
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {!paymentSuccess ? (
            <>
              <Typography variant="h4" component="h1" gutterBottom>
                Complete Your Booking
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Please complete the payment to confirm your flight booking.
              </Typography>

              {paymentError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {paymentError}
                </Alert>
              )}

              <RazorpayCheckout
                reservationId={reservationId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </>
          ) : (
            <Typography variant="h4" component="h1" gutterBottom>
              Payment Confirmation
            </Typography>
          )}
        </Paper>
      </Box>

      <PaymentSuccess
        open={paymentSuccess}
        onClose={handleDone}
        paymentId={paymentId}
      />
    </Container>
  );
};

export default PaymentPage;
