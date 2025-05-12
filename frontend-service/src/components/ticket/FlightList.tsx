import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import type { RootState } from "../../store";
import ReservationForm from "../reservation/ReservationForm";
import type { Flight } from "../../types/ticket.types";

const FlightList: React.FC = () => {
  const { flights, loading, error } = useSelector(
    (state: RootState) => state.ticket
  );

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  const handleReserveClick = (flight: Flight) => {
    setSelectedFlight(flight);
    setReservationModalOpen(true);
  };

  const handleCloseReservationModal = () => {
    setReservationModalOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography>Loading flights...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (flights.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography>
            No flights found. Please try different search criteria.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Available Flights
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Flight</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Departure</TableCell>
                <TableCell>Arrival</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Seats</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.flightNumber}</TableCell>
                  <TableCell>{flight.origin}</TableCell>
                  <TableCell>{flight.destination}</TableCell>
                  <TableCell>
                    {flight.departureDate} {flight.departureTime}
                  </TableCell>
                  <TableCell>
                    {flight.arrivalDate} {flight.arrivalTime}
                  </TableCell>
                  <TableCell>${flight.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={flight.class}
                      color={
                        flight.class === "Economy"
                          ? "default"
                          : flight.class === "Business"
                          ? "primary"
                          : "secondary"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {flight.seatsAvailable > 0 ? (
                      flight.seatsAvailable
                    ) : (
                      <Chip label="Sold out" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleReserveClick(flight)}
                      disabled={flight.seatsAvailable <= 0}
                    >
                      Reserve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedFlight && (
        <ReservationForm
          flight={selectedFlight}
          open={reservationModalOpen}
          onClose={handleCloseReservationModal}
        />
      )}
    </Container>
  );
};

export default FlightList;
