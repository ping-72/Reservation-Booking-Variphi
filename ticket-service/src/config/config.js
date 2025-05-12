require("dotenv").config();
const path = require("path");

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
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    url: "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    url: "postgresql://reservation_db_owner:npg_G7AzWPvxEOa9@ep-wispy-dream-a1h2zscq-pooler.ap-southeast-1.aws.neon.tech/reservation_db?sslmode=require",
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
  },
};
