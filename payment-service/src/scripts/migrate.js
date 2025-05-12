#!/usr/bin/env node

// This script explicitly synchronizes the database
// Can be run with: node src/scripts/migrate.js

const { sequelize, syncDatabase } = require("../config/database");
const Payment = require("../models/payment.model");

// Import all models to ensure they're registered before sync
console.log("Starting database migration...");

async function migrate() {
  try {
    // Force: true will drop the table if it already exists
    // Use with caution in production
    const forceSync = process.argv.includes("--force");

    if (forceSync) {
      console.log("WARNING: Performing force sync (will drop tables)");
      await sequelize.sync({ force: true });
      console.log("Database tables dropped and recreated.");
    } else {
      await syncDatabase();
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
