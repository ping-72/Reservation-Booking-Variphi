import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  AirlineSeatReclineNormal,
  AttachMoney,
} from "@mui/icons-material";
import { getFlightById } from "../../store/slices/ticketSlice";
import type { RootState } from "../../store";
import type { AppDispatch } from "../../store";

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedFlight: flight,
    loading,
    error,
  } = useSelector((state: RootState) => state.ticket);

  useEffect(() => {
    if (id) {
      dispatch(getFlightById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading flight details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!flight) {
    return (
      <Container>
        <Typography>Flight not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flight Details
        </Typography>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <img
                    src={flight.airline.logo}
                    alt={flight.airline.name}
                    style={{ height: 60, marginRight: 16 }}
                  />
                  <Box>
                    <Typography variant="h6">{flight.airline.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Flight {flight.flightNumber}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h5">
                      {flight.departureAirport.code}
                    </Typography>
                    <Typography variant="body1">
                      {flight.departureAirport.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departureTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Divider sx={{ width: 200 }} />
                    <FlightTakeoff sx={{ mx: 2 }} />
                    <FlightLand sx={{ mx: 2 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5">
                      {flight.arrivalAirport.code}
                    </Typography>
                    <Typography variant="body1">
                      {flight.arrivalAirport.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.arrivalTime}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AttachMoney sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${flight.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AirlineSeatReclineNormal sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Available Seats
                        </Typography>
                        <Typography variant="h6">
                          {flight.availableSeats}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={flight.status}
                        color={
                          flight.status === "scheduled"
                            ? "success"
                            : flight.status === "delayed"
                            ? "warning"
                            : "error"
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={() => navigate("/flights")}>
            Back to Search
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/reservations/new/${flight.id}`)}
          >
            Book Flight
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FlightDetails;
