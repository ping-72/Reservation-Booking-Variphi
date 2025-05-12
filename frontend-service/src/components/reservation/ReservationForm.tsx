import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import {
  reservationService,
  type ReservationRequest,
} from "../../services/reservation.service";
import type { Flight } from "../../types/ticket.types";

interface ReservationFormProps {
  flight: Flight;
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  passengerName: Yup.string().required("Passenger name is required"),
  passengerEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  passengerPhone: Yup.string().required("Phone number is required"),
  seatNumber: Yup.string().required("Seat number is required"),
});

const ReservationForm: React.FC<ReservationFormProps> = ({
  flight,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<Omit<ReservationRequest, "ticketId">>({
    initialValues: {
      passengerName: "",
      passengerEmail: "",
      passengerPhone: "",
      seatNumber: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const data: ReservationRequest = {
          ...values,
          ticketId: flight.id,
        };

        const reservation = await reservationService.createReservation(data);

        // Navigate to payment page
        navigate("/payment", {
          state: { reservationId: reservation.id },
        });

        // Close the reservation modal
        onClose();
      } catch (err) {
        console.error("Error creating reservation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create reservation"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Reserve Flight</DialogTitle>
      <Divider />

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Flight Details</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Flight
              </Typography>
              <Typography variant="body1">{flight.flightNumber}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                From → To
              </Typography>
              <Typography variant="body1">
                {flight.origin} → {flight.destination}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Departure
              </Typography>
              <Typography variant="body1">
                {flight.departureDate} {flight.departureTime}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1">{flight.class}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Passenger Information
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="passengerName"
                name="passengerName"
                label="Passenger Name"
                value={formik.values.passengerName}
                onChange={formik.handleChange}
                error={
                  formik.touched.passengerName &&
                  Boolean(formik.errors.passengerName)
                }
                helperText={
                  formik.touched.passengerName && formik.errors.passengerName
                }
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="passengerEmail"
                name="passengerEmail"
                label="Email"
                value={formik.values.passengerEmail}
                onChange={formik.handleChange}
                error={
                  formik.touched.passengerEmail &&
                  Boolean(formik.errors.passengerEmail)
                }
                helperText={
                  formik.touched.passengerEmail && formik.errors.passengerEmail
                }
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="passengerPhone"
                name="passengerPhone"
                label="Phone Number"
                value={formik.values.passengerPhone}
                onChange={formik.handleChange}
                error={
                  formik.touched.passengerPhone &&
                  Boolean(formik.errors.passengerPhone)
                }
                helperText={
                  formik.touched.passengerPhone && formik.errors.passengerPhone
                }
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="seatNumber"
                name="seatNumber"
                label="Seat Number"
                placeholder="e.g., 12A"
                value={formik.values.seatNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.seatNumber && Boolean(formik.errors.seatNumber)
                }
                helperText={
                  formik.touched.seatNumber && formik.errors.seatNumber
                }
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Special Requests"
                placeholder="e.g., Meal preferences, assistance needs"
                multiline
                rows={2}
                value={formik.values.notes}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationForm;
