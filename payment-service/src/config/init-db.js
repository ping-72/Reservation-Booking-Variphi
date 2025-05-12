const { sequelize } = require("./database");
const Payment = require("../models/payment.model");

async function initializeDatabase() {
  try {
    // Force sync will drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log("Database tables have been recreated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
