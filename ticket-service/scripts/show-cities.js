const { Ticket } = require("../src/models");
const db = require("../src/config/database");

async function showCities() {
  try {
    // Get all unique origin cities
    const origins = await Ticket.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("origin")), "city"],
      ],
      raw: true,
    });

    // Get all unique destination cities
    const destinations = await Ticket.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("destination")), "city"],
      ],
      raw: true,
    });

    // Combine and remove duplicates
    const allCities = [...origins, ...destinations]
      .map((item) => item.city)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    console.log("Unique cities in the database:");
    console.table(allCities);

    process.exit(0);
  } catch (error) {
    console.error("Error fetching cities:", error);
    process.exit(1);
  }
}

showCities();
