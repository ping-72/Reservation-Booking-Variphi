require("dotenv").config();

module.exports = {
  development: {
    url: "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
