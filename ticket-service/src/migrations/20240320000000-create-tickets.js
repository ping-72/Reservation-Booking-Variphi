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
        type: Sequelize.ENUM("Economy", "Business", "First"),
        allowNull: false,
      },
      airline: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seatsAvailable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create indexes
    await queryInterface.addIndex("Tickets", ["flightNumber"]);
    await queryInterface.addIndex("Tickets", ["origin", "destination"]);
    await queryInterface.addIndex("Tickets", ["departureDate"]);
    await queryInterface.addIndex("Tickets", ["airline"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Tickets");
  },
};
