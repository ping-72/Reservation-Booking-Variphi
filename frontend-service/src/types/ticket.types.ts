export interface Airline {
  id: string;
  name: string;
  code: string;
  logo: string;
}

export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  class: "Economy" | "Business" | "First";
  airline: string;
  seatsAvailable: number;
}

export interface Ticket {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  price: number;
  class: string;
  airline: string;
  status: string;
}

export interface SearchFlightsRequest {
  origin: string;
  destination: string;
  departureDate?: string | null;
}

export interface TicketState {
  flights: Flight[];
  selectedFlight: Flight | null;
  loading: boolean;
  error: string | null;
  searchParams: SearchFlightsRequest | null;
  airlines: Airline[];
  popularRoutes: PopularRoute[];
}

export interface PopularRoute {
  departureAirport: Airport;
  arrivalAirport: Airport;
  averagePrice: number;
  totalFlights: number;
}
