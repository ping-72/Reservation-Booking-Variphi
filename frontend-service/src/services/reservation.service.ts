import axios from "axios";

interface ReservationRequest {
  ticketId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  seatNumber: string;
  notes?: string;
}

interface Reservation {
  id: string;
  userId: string;
  ticketId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  seatNumber: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  import.meta.env.VITE_RESERVATION_SERVICE_URL || "http://localhost:5002";

const reservationService = {
  async createReservation(data: ReservationRequest): Promise<Reservation> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post(`${API_URL}/api/reservations`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.reservation;
  },

  async getUserReservations(): Promise<Reservation[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/reservations/my-reservations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.reservations;
    } catch (error) {
      console.error("Error fetching user reservations:", error);
      return []; // Return empty array on error
    }
  },

  async getReservationById(id: string): Promise<Reservation> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/reservations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.reservation;
  },

  async cancelReservation(id: string, notes?: string): Promise<Reservation> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.put(
      `${API_URL}/api/reservations/${id}`,
      {
        status: "cancelled",
        notes: notes || "Cancelled by user",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.reservation;
  },

  async getReservationDetails(reservationId: string): Promise<Reservation> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(
      `${API_URL}/api/reservations/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.reservation;
  },
};

export { reservationService, type ReservationRequest, type Reservation };
