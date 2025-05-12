import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Card,
  Avatar,
  useTheme,
} from "@mui/material";
import { logout } from "../../store/slices/authSlice";
import type { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import { reservationService } from "../../services/reservation.service";
import type { Reservation } from "../../services/reservation.service";
import { paymentService } from "../../services/payment.service";
import type { PaymentOrder } from "../../services/payment.service";
import { ticketService } from "../../services/ticket.service";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import PersonIcon from "@mui/icons-material/Person";

interface ReservationWithDetails extends Reservation {
  flightDetails?: {
    origin: string;
    destination: string;
    departureDate: string;
    flightNumber: string;
    price: number;
    class: string;
  };
  payment?: PaymentOrder;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reservations, setReservations] = useState<ReservationWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userReservations = await reservationService.getUserReservations();

        const reservationsWithDetails = await Promise.all(
          userReservations.map(async (reservation) => {
            let flightDetails = {
              origin: "N/A",
              destination: "N/A",
              departureDate: "",
              flightNumber: "Unknown",
              price: 0,
              class: "Economy",
            };

            let paymentInfo = undefined;

            try {
              // Get ticket details
              const ticket = await ticketService.getTicketById(
                reservation.ticketId
              );

              flightDetails = {
                origin: ticket.origin || "N/A",
                destination: ticket.destination || "N/A",
                departureDate: ticket.departureDate || "",
                flightNumber: ticket.flightNumber || "Unknown",
                price:
                  typeof ticket.price === "number"
                    ? ticket.price
                    : parseFloat(ticket.price) || 0,
                class: ticket.class || "Economy",
              };
            } catch (ticketError) {
              console.error(
                "Error fetching details for reservation:",
                ticketError
              );
              // Keep default flight details
            }

            try {
              // Get payment info
              const payments = await paymentService.getPaymentsByReservation(
                reservation.id
              );
              paymentInfo =
                payments.length > 0
                  ? payments.sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )[0]
                  : undefined;
            } catch (paymentError) {
              console.error(
                "Error fetching payment for reservation:",
                paymentError
              );
              // Keep payment undefined
            }

            return {
              ...reservation,
              flightDetails,
              payment: paymentInfo,
            };
          })
        );

        setReservations(reservationsWithDetails);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleLogout = () => {
    // @ts-expect-error - handling async thunk dispatch type issue
    dispatch(logout());
    navigate("/login");
  };

  const getPaymentStatusChip = (status?: string) => {
    if (!status)
      return <Chip label="No Payment" color="default" size="small" />;

    switch (status) {
      case "completed":
        return <Chip label="Paid" color="success" size="small" />;
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />;
      case "failed":
        return <Chip label="Failed" color="error" size="small" />;
      case "cancelled":
        return <Chip label="Cancelled" color="default" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const getReservationStatusChip = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Chip label="Confirmed" color="success" size="small" />;
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* User Profile Card */}
        <Card elevation={3} sx={{ overflow: "visible", p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 70,
                height: 70,
                mr: 3,
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              <Chip
                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ ml: "auto" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Flight Reservations Section */}
        <Card elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Flight Reservations
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : reservations.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ my: 4 }}>
              You haven't made any reservations yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Flight</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Passenger</TableCell>
                    <TableCell>Seat</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Reservation Status</TableCell>
                    <TableCell>Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <FlightTakeoffIcon
                                fontSize="small"
                                color="primary"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography variant="body2">
                                {reservation.flightDetails?.origin || "N/A"}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <FlightLandIcon
                                fontSize="small"
                                color="secondary"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography variant="body2">
                                {reservation.flightDetails?.destination ||
                                  "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {formatDate(reservation.flightDetails?.departureDate)}
                      </TableCell>
                      <TableCell>{reservation.passengerName}</TableCell>
                      <TableCell>{reservation.seatNumber}</TableCell>
                      <TableCell>
                        {reservation.flightDetails?.class || "N/A"}
                      </TableCell>
                      <TableCell>
                        $
                        {typeof reservation.flightDetails?.price === "number"
                          ? reservation.flightDetails.price.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      <TableCell>
                        {getReservationStatusChip(reservation.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(reservation.payment?.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile;
