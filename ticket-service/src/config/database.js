const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require",
  {
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
    logging: false, // Set to console.log for debugging
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = { sequelize };
