const { Sequelize } = require("sequelize");

// Database configuration
const DB_NAME = process.env.DB_NAME || "reservation_db";
const DB_USER = process.env.DB_USER || "reservation_db_owner";
const DB_PASSWORD = process.env.DB_PASSWORD || "npg_G7AzWPvxEOa9";
const DB_HOST =
  process.env.DB_HOST ||
  "ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech";
const DB_PORT = process.env.DB_PORT || 5432;
const SSL_ENABLED = process.env.SSL_ENABLED === "true" || false; // Make SSL optional

// Configure database connection options
const dbConfig = {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
};

// Add SSL options only if SSL is enabled
if (SSL_ENABLED) {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, dbConfig);

// Function to sync database and create tables
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database tables synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database tables:", error);
    throw error;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

module.exports = { sequelize, testConnection, syncDatabase };
