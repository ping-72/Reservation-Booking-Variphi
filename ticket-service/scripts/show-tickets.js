const { Client } = require("pg");

const connectionString =
  "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require";

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function showTickets() {
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM "Tickets"');
    console.log("Tickets:");
    console.table(res.rows);
  } catch (err) {
    console.error("Error querying Tickets:", err);
  } finally {
    await client.end();
  }
}

showTickets();
