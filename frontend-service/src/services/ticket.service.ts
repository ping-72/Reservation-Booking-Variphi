import axios from "axios";
import type {
  Flight,
  SearchFlightsRequest,
  PopularRoute,
  Airline,
  Ticket,
} from "../types/ticket.types";

const API_URL =
  import.meta.env.VITE_TICKET_SERVICE_URL || "http://localhost:3002";

const ticketService = {
  searchFlights: async (params: SearchFlightsRequest): Promise<Flight[]> => {
    const searchParams: {
      origin: string;
      destination: string;
      departureDate?: string;
    } = {
      origin: params.origin,
      destination: params.destination,
    };

    // Only add departureDate to params if it exists
    if (params.departureDate) {
      searchParams.departureDate = params.departureDate;
    }

    const response = await axios.get(`${API_URL}/api/tickets/search`, {
      params: searchParams,
    });

    // Handle both response formats (direct array or object with tickets property)
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.tickets) {
      return response.data.tickets;
    }
    return [];
  },

  getFlightById: async (id: string): Promise<Flight> => {
    const response = await axios.get(`${API_URL}/api/tickets/${id}`);
    return response.data;
  },

  async getPopularRoutes(): Promise<PopularRoute[]> {
    const response = await axios.get(`${API_URL}/api/tickets/popular-routes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  async getAirlines(): Promise<Airline[]> {
    const response = await axios.get(`${API_URL}/api/tickets/airlines`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  async getCities(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/cities`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      // Return default cities if API call fails
      return [
        "ATL",
        "BOS",
        "DEN",
        "DFW",
        "JFK",
        "LAX",
        "MIA",
        "ORD",
        "SEA",
        "SFO",
        "AMS",
        "CDG",
        "DEL",
        "DXB",
        "FRA",
        "HKG",
        "LHR",
        "NRT",
        "SIN",
        "SYD",
        "New York (JFK)",
        "Singapore (SIN)",
        "Rome (FCO)",
        "Auckland (AKL)",
        "Chicago (ORD)",
        "Munich (MUC)",
        "Los Angeles (LAX)",
        "Dubai (DXB)",
        "Tokyo (HND)",
        "Bangkok (BKK)",
        "Paris (CDG)",
        "Sydney (SYD)",
      ];
    }
  },

  async getTicketById(ticketId: string): Promise<Ticket> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.ticket;
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error);

      // Return a fallback ticket object
      return {
        id: ticketId,
        flightNumber: "Unknown",
        origin: "N/A",
        destination: "N/A",
        departureDate: "",
        departureTime: "",
        arrivalDate: "",
        arrivalTime: "",
        price: 0,
        class: "Economy",
        airline: "Unknown",
        status: "unknown",
      };
    }
  },
};

export { ticketService };
