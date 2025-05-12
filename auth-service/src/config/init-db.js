const { sequelize } = require("./database");
const User = require("../models/user.model");

async function initializeDatabase() {
  try {
    // Force sync will drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log("Database tables have been recreated successfully.");

    // Create an admin user
    await User.create({
      email: "admin@example.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    });
    console.log("Admin user created successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
