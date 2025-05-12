"use strict";

const { v4: uuidv4 } = require("uuid");

const airlines = ["Delta", "United", "American", "Southwest", "JetBlue"];
const airports = {
  origins: [
    "JFK",
    "LAX",
    "ORD",
    "ATL",
    "DFW",
    "SFO",
    "SEA",
    "MIA",
    "BOS",
    "DEN",
  ],
  destinations: [
    "LHR",
    "CDG",
    "FRA",
    "AMS",
    "SIN",
    "HKG",
    "NRT",
    "SYD",
    "DXB",
    "DEL",
  ],
};

const flightClasses = ["Economy", "Business", "First"];

function generateRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateRandomTime() {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function generateRandomPrice(flightClass) {
  const basePrice = {
    Economy: 200,
    Business: 800,
    First: 1500,
  }[flightClass];

  return (basePrice + Math.random() * 300).toFixed(2);
}

function generateRandomSeats() {
  return Math.floor(Math.random() * 50) + 10;
}

function generateFlightNumber(airline) {
  const airlineCode = airline.substring(0, 2).toUpperCase();
  const number = Math.floor(Math.random() * 9999) + 1000;
  return `${airlineCode}${number}`;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tickets = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // Generate flights for next 3 months

    for (let i = 0; i < 100; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const origin =
        airports.origins[Math.floor(Math.random() * airports.origins.length)];
      const destination =
        airports.destinations[
          Math.floor(Math.random() * airports.destinations.length)
        ];
      const flightClass =
        flightClasses[Math.floor(Math.random() * flightClasses.length)];

      const departureDate = generateRandomDate(startDate, endDate);
      const arrivalDate = new Date(departureDate);
      arrivalDate.setHours(
        arrivalDate.getHours() + Math.floor(Math.random() * 12) + 1
      );

      tickets.push({
        id: uuidv4(),
        flightNumber: generateFlightNumber(airline),
        origin,
        destination,
        departureDate: departureDate.toISOString().split("T")[0],
        departureTime: generateRandomTime(),
        arrivalDate: arrivalDate.toISOString().split("T")[0],
        arrivalTime: generateRandomTime(),
        price: generateRandomPrice(flightClass),
        class: flightClass,
        airline,
        seatsAvailable: generateRandomSeats(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Tickets", tickets, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tickets", null, {});
  },
};
