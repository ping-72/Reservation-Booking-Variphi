const { sequelize } = require("../config/database");
const Ticket = require("./ticket.model");

module.exports = {
  sequelize,
  Ticket,
};
