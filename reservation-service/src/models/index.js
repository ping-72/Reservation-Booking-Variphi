const { sequelize } = require("../config/database");
const Reservation = require("./reservation.model");
const Ticket = require("./ticket.model");

module.exports = {
  sequelize,
  Reservation,
  Ticket,
};
