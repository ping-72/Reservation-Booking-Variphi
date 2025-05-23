const { sequelize } = require("../config/database");
const Ticket = require("../models/ticket.model");

async function seedTickets() {
  try {
    // Sync the database
    await sequelize.sync({ force: true });

    // Create sample tickets based on the screenshot data
    const tickets = [
      {
        id: "02516ef3-05d7-4fc3-a48b-85b23a0bfd3b",
        flightNumber: "QF0123",
        origin: "Sydney (SYD)",
        destination: "Auckland (AKL)",
        departureDate: "2024-06-22",
        departureTime: "07:30:00",
        arrivalDate: "2024-06-22",
        arrivalTime: "13:00:00",
        price: 450.0,
        class: "Economy",
        airline: "Qantas",
        seatsAvailable: 45,
      },
      {
        id: "08186502-728b-476f-a1a7-b1e1f26c4b3d",
        flightNumber: "AF4567",
        origin: "Paris (CDG)",
        destination: "Rome (FCO)",
        departureDate: "2024-06-23",
        departureTime: "11:00:00",
        arrivalDate: "2024-06-23",
        arrivalTime: "13:20:00",
        price: 320.0,
        class: "Economy",
        airline: "Air France",
        seatsAvailable: 65,
      },
      {
        id: "0bf35734-7658-45de-9d7e-d3b8f3e48a51",
        flightNumber: "SQ6789",
        origin: "Singapore (SIN)",
        destination: "Tokyo (HND)",
        departureDate: "2024-06-21",
        departureTime: "10:45:00",
        arrivalDate: "2024-06-21",
        arrivalTime: "18:30:00",
        price: 780.0,
        class: "Business",
        airline: "Singapore Airlines",
        seatsAvailable: 32,
      },
      {
        id: "10d018c5-3121-4561-9a68-789fe0ce0d42",
        flightNumber: "EK2345",
        origin: "Dubai (DXB)",
        destination: "Singapore (SIN)",
        departureDate: "2024-06-20",
        departureTime: "01:15:00",
        arrivalDate: "2024-06-20",
        arrivalTime: "13:30:00",
        price: 920.0,
        class: "Business",
        airline: "Emirates",
        seatsAvailable: 28,
      },
      {
        id: "86630661-3c54-4152-9fa8-e0d7c82b5f14",
        flightNumber: "LH7890",
        origin: "Berlin (BER)",
        destination: "Munich (MUC)",
        departureDate: "2024-06-19",
        departureTime: "14:20:00",
        arrivalDate: "2024-06-19",
        arrivalTime: "15:30:00",
        price: 180.0,
        class: "Economy",
        airline: "Lufthansa",
        seatsAvailable: 85,
      },
      {
        id: "a50b4b72-c8a3-475a-88f4-3e95f2c0d789",
        flightNumber: "CX8901",
        origin: "Hong Kong (HKG)",
        destination: "Bangkok (BKK)",
        departureDate: "2024-06-24",
        departureTime: "15:40:00",
        arrivalDate: "2024-06-24",
        arrivalTime: "17:30:00",
        price: 420.0,
        class: "Premium Economy",
        airline: "Cathay Pacific",
        seatsAvailable: 52,
      },
      {
        id: "b4216041-c8fe-41ff-8de4-f59a7e3b0a62",
        flightNumber: "BA3456",
        origin: "London (LHR)",
        destination: "Paris (CDG)",
        departureDate: "2024-06-18",
        departureTime: "09:30:00",
        arrivalDate: "2024-06-18",
        arrivalTime: "11:45:00",
        price: 280.0,
        class: "Economy",
        airline: "British Airways",
        seatsAvailable: 78,
      },
      {
        id: "ce8f359c-0be2-4610-b98d-a7f619c2e807",
        flightNumber: "UA9012",
        origin: "San Francisco (SFO)",
        destination: "Seattle (SEA)",
        departureDate: "2024-06-17",
        departureTime: "13:45:00",
        arrivalDate: "2024-06-17",
        arrivalTime: "16:00:00",
        price: 340.0,
        class: "Economy",
        airline: "United Airlines",
        seatsAvailable: 92,
      },
      {
        id: "ea9dd436-bc47-4af6-8704-1e2d93f5a6c8",
        flightNumber: "AA7531",
        origin: "New York (JFK)",
        destination: "London (LHR)",
        departureDate: "2024-06-25",
        departureTime: "19:30:00",
        arrivalDate: "2024-06-26",
        arrivalTime: "07:45:00",
        price: 850.0,
        class: "Premium Economy",
        airline: "American Airlines",
        seatsAvailable: 38,
      },
      {
        id: "f9877f19-7f0b-4e1d-839e-c67a9db20d35",
        flightNumber: "AA1234",
        origin: "New York (JFK)",
        destination: "Los Angeles (LAX)",
        departureDate: "2024-06-15",
        departureTime: "08:00:00",
        arrivalDate: "2024-06-15",
        arrivalTime: "11:30:00",
        price: 520.0,
        class: "Economy",
        airline: "American Airlines",
        seatsAvailable: 56,
      },
      {
        id: "fb8c23b3-d474-4612-8f4b-9e0fd7b51c9a",
        flightNumber: "DL5678",
        origin: "Chicago (ORD)",
        destination: "Miami (MIA)",
        departureDate: "2024-06-16",
        departureTime: "10:15:00",
        arrivalDate: "2024-06-16",
        arrivalTime: "14:00:00",
        price: 410.0,
        class: "Economy",
        airline: "Delta Air Lines",
        seatsAvailable: 72,
      },
      {
        id: "fd5bd32b-ab73-4f6e-8b14-2d9c84e7f510",
        flightNumber: "SQ2468",
        origin: "Singapore (SIN)",
        destination: "Dubai (DXB)",
        departureDate: "2024-06-26",
        departureTime: "23:45:00",
        arrivalDate: "2024-06-27",
        arrivalTime: "04:30:00",
        price: 960.0,
        class: "Business",
        airline: "Singapore Airlines",
        seatsAvailable: 30,
      },
    ];

    // Insert tickets
    await Ticket.bulkCreate(tickets);
    console.log("Ticket database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedTickets();
