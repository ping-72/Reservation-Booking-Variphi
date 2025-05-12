import axios from "axios";

interface CreatePaymentOrderRequest {
  reservationId: string;
}

interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  reservationId: string;
}

interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  key_id?: string;
}

interface PaymentConfirmationRequest {
  orderId: string;
  paymentMethodId: string;
}

interface PaymentVerificationResponse {
  status: string;
  reservationStatus: string;
}

interface PaymentOrder {
  id: string;
  userId: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentIntentId?: string;
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:5004";

const paymentService = {
  async createPaymentOrder(
    data: CreatePaymentOrderRequest
  ): Promise<PaymentOrderResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post(
      `${API_URL}/api/payments/create-order`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.order;
  },

  async verifyPayment(
    data: VerifyPaymentRequest
  ): Promise<PaymentVerificationResponse> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post(`${API_URL}/api/payments/verify`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async confirmPayment(
    data: PaymentConfirmationRequest
  ): Promise<PaymentOrder> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.post(`${API_URL}/api/payments/confirm`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payment;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentOrder> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/payments/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payment;
  },

  async getPaymentsByReservation(
    reservationId: string
  ): Promise<PaymentOrder[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/payments/reservation/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.payments;
    } catch (error) {
      console.error(
        `Error fetching payments for reservation ${reservationId}:`,
        error
      );
      return []; // Return empty array on error
    }
  },

  async getUserPayments(): Promise<PaymentOrder[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/api/payments/my-payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payments;
  },
};

export {
  paymentService,
  type CreatePaymentOrderRequest,
  type PaymentOrder,
  type PaymentOrderResponse,
  type PaymentConfirmationRequest,
  type VerifyPaymentRequest,
  type PaymentVerificationResponse,
};
