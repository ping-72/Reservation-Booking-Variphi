"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Tickets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      flightNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      departureDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      departureTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      arrivalTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      class: {
        type: Sequelize.ENUM("Economy", "Premium Economy", "Business", "First"),
        defaultValue: "Economy",
      },
      airline: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seatsAvailable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex("Tickets", ["origin", "destination"], {
      name: "tickets_origin_destination",
    });

    await queryInterface.addIndex("Tickets", ["departureDate"], {
      name: "tickets_departure_date",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Tickets");
  },
};
