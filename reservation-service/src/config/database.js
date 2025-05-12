const { Sequelize } = require("sequelize");
require("dotenv").config();

const connectionString =
  "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require";

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = {
  sequelize,
};
