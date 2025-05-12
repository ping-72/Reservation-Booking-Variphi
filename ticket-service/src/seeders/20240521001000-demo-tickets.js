"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const airlines = [
      "American Airlines",
      "Delta Airlines",
      "United Airlines",
      "British Airways",
      "Lufthansa",
      "Emirates",
      "Singapore Airlines",
      "Qantas",
      "Air France",
      "Cathay Pacific",
    ];

    const airports = [
      ["New York (JFK)", "US"],
      ["Los Angeles (LAX)", "US"],
      ["Chicago (ORD)", "US"],
      ["Miami (MIA)", "US"],
      ["San Francisco (SFO)", "US"],
      ["Seattle (SEA)", "US"],
      ["London (LHR)", "UK"],
      ["Paris (CDG)", "FR"],
      ["Berlin (BER)", "DE"],
      ["Munich (MUC)", "DE"],
      ["Dubai (DXB)", "AE"],
      ["Singapore (SIN)", "SG"],
      ["Tokyo (HND)", "JP"],
      ["Sydney (SYD)", "AU"],
      ["Auckland (AKL)", "NZ"],
      ["Rome (FCO)", "IT"],
      ["Hong Kong (HKG)", "HK"],
      ["Bangkok (BKK)", "TH"],
      ["Toronto (YYZ)", "CA"],
      ["Vancouver (YVR)", "CA"],
    ];

    const classes = ["Economy", "Premium Economy", "Business", "First"];

    const tickets = [];
    const startDate = new Date("2024-06-15");

    // Generate 100 random tickets
    for (let i = 0; i < 100; i++) {
      // Pick random origin and destination
      let originIdx = Math.floor(Math.random() * airports.length);
      let destIdx;
      do {
        destIdx = Math.floor(Math.random() * airports.length);
      } while (destIdx === originIdx);

      // Calculate random flight duration between 1-15 hours
      const flightHours = Math.floor(Math.random() * 14) + 1;

      // Generate departure date/time
      const depDate = new Date(startDate);
      depDate.setDate(depDate.getDate() + Math.floor(i / 5)); // Spread flights across days
      const depHour = Math.floor(Math.random() * 24);
      const depMin = Math.floor(Math.random() * 60);

      // Calculate arrival date/time
      const arrDate = new Date(depDate);
      let arrHour = depHour + flightHours;
      if (arrHour >= 24) {
        arrDate.setDate(arrDate.getDate() + 1);
        arrHour = arrHour - 24;
      }

      // Generate price based on class and duration
      const classIdx = Math.floor(Math.random() * classes.length);
      const basePrice = 200 + flightHours * 50;
      const classMultiplier = Math.pow(2, classIdx); // Economy=1x, Premium=2x, Business=4x, First=8x
      const price = basePrice * classMultiplier;

      tickets.push({
        id: uuidv4(),
        flightNumber: `${airlines[Math.floor(Math.random() * airlines.length)]
          .substring(0, 2)
          .toUpperCase()}${1000 + i}`,
        origin: airports[originIdx][0],
        destination: airports[destIdx][0],
        departureDate: depDate.toISOString().split("T")[0],
        departureTime: `${depHour.toString().padStart(2, "0")}:${depMin
          .toString()
          .padStart(2, "0")}:00`,
        arrivalDate: arrDate.toISOString().split("T")[0],
        arrivalTime: `${arrHour.toString().padStart(2, "0")}:${depMin
          .toString()
          .padStart(2, "0")}:00`,
        price: parseFloat(price.toFixed(2)),
        class: classes[classIdx],
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        seatsAvailable: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert("Tickets", tickets);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tickets", null, {});
  },
};
