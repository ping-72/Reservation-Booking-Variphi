const { sequelize } = require("../config/database");
const Reservation = require("../models/reservation.model");

async function seedReservations() {
  try {
    // Sync the database
    await sequelize.sync({ force: true });

    // Create sample reservations
    const reservations = [
      {
        userId: "bb28a22f-3d13-4840-9598-5a52e7b729b2", // Replace with actual user ID
        ticketId: "02516ef3-05d7-4fc3-a48b-85b23a0bfd3b", // Sydney to Auckland
        passengerName: "John Smith",
        passengerEmail: "john.smith@example.com",
        passengerPhone: "+1-555-123-4567",
        seatNumber: "12A",
        status: "confirmed",
        notes: "Vegetarian meal requested",
      },
      {
        userId: "bb28a22f-3d13-4840-9598-5a52e7b729b2", // Replace with actual user ID
        ticketId: "08186502-728b-476f-a1a7-b1e1f26c4b3d", // Paris to Rome
        passengerName: "Sarah Johnson",
        passengerEmail: "sarah.johnson@example.com",
        passengerPhone: "+1-555-987-6543",
        seatNumber: "15C",
        status: "confirmed",
        notes: "Window seat preferred",
      },
      {
        userId: "a9c52825-5d35-4735-9a5c-b598063c9a7e", // Replace with actual user ID
        ticketId: "0bf35734-7658-45de-9d7e-d3b8f3e48a51", // Singapore to Tokyo
        passengerName: "Michael Wong",
        passengerEmail: "michael.wong@example.com",
        passengerPhone: "+65-9876-5432",
        seatNumber: "3B",
        status: "pending",
        notes: "Business class upgrade requested",
      },
      {
        userId: "a9c52825-5d35-4735-9a5c-b598063c9a7e", // Replace with actual user ID
        ticketId: "10d018c5-3121-4561-9a68-789fe0ce0d42", // Dubai to Singapore
        passengerName: "Lisa Chen",
        passengerEmail: "lisa.chen@example.com",
        passengerPhone: "+65-8765-4321",
        seatNumber: "1A",
        status: "confirmed",
        notes: "Special assistance needed",
      },
    ];

    // Insert reservations
    await Reservation.bulkCreate(reservations);
    console.log("Reservation database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedReservations();
