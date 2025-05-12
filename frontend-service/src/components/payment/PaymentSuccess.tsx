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

interface PaymentSuccessProps {
  open: boolean;
  onClose: () => void;
  paymentId: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  open,
  onClose,
  paymentId,
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
            Payment Successful!
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Your flight has been booked and payment has been processed
            successfully.
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
              Payment Reference
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {paymentId}
            </Typography>
          </Paper>

          <Typography variant="body2" color="text.secondary" align="center">
            A confirmation email with your e-ticket has been sent to your email
            address. You can also view your bookings in your profile.
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

export default PaymentSuccess;
