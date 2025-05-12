import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  paymentService,
  type PaymentOrder,
} from "../../services/payment.service";

interface PaymentFormProps {
  reservationId: string;
  onPaymentSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be 16 digits"),
  cardHolder: Yup.string().required("Cardholder name is required"),
  expiryDate: Yup.string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

const PaymentForm: React.FC<PaymentFormProps> = ({
  reservationId,
  onPaymentSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder | null>(null);

  useEffect(() => {
    const createPaymentOrder = async () => {
      try {
        setLoading(true);
        const order = await paymentService.createPaymentOrder({
          reservationId,
        });
        setPaymentOrder(order);
      } catch (err) {
        console.error("Error creating payment order:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create payment order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    createPaymentOrder();
  }, [reservationId]);

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema,
    onSubmit: async () => {
      if (!paymentOrder) return;

      try {
        setLoading(true);
        setError(null);

        // In a real app, we would use a payment processor SDK here
        // For this demo, we'll just simulate a payment method ID
        const paymentMethodId = `pm_${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        const payment = await paymentService.confirmPayment({
          orderId: paymentOrder.id,
          paymentMethodId,
        });

        onPaymentSuccess(payment.id);
      } catch (err) {
        console.error("Payment error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Payment failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading && !paymentOrder) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !paymentOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={onCancel}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {paymentOrder && (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1">{paymentOrder.id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {paymentOrder.currency} {paymentOrder.amount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="cardHolder"
                  name="cardHolder"
                  label="Cardholder Name"
                  value={formik.values.cardHolder}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.cardHolder &&
                    Boolean(formik.errors.cardHolder)
                  }
                  helperText={
                    formik.touched.cardHolder && formik.errors.cardHolder
                  }
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="cardNumber"
                  name="cardNumber"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={formik.values.cardNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.cardNumber &&
                    Boolean(formik.errors.cardNumber)
                  }
                  helperText={
                    formik.touched.cardNumber && formik.errors.cardNumber
                  }
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={formik.values.expiryDate}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.expiryDate &&
                    Boolean(formik.errors.expiryDate)
                  }
                  helperText={
                    formik.touched.expiryDate && formik.errors.expiryDate
                  }
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  type="password"
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                  error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                  helperText={formik.touched.cvv && formik.errors.cvv}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !paymentOrder}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentForm;
