import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface ReservationSuccessProps {
  open: boolean;
  onClose: () => void;
  reservationId: string;
}

const ReservationSuccess: React.FC<ReservationSuccessProps> = ({
  open,
  onClose,
  reservationId,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
          }}
        >
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 80, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom align="center">
            Reservation Successful!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Your flight has been reserved successfully.
          </Typography>

          <Paper
            elevation={1}
            sx={{
              p: 2,
              width: "100%",
              bgcolor: "background.paper",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Reservation ID
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {reservationId}
            </Typography>
          </Paper>

          <Typography variant="body2" color="text.secondary" align="center">
            Please save this reservation ID for your records. You can view your
            reservations in your profile.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationSuccess;
