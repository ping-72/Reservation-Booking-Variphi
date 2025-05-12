const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departureDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    arrivalTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    class: {
      type: DataTypes.ENUM("Economy", "Premium Economy", "Business", "First"),
      defaultValue: "Economy",
    },
    airline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatsAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        name: "tickets_origin_destination",
        fields: ["origin", "destination"],
      },
      {
        name: "tickets_departure_date",
        fields: ["departureDate"],
      },
    ],
  }
);

module.exports = Ticket;
