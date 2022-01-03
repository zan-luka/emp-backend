const CONFIG = require("./config/db");
const Pool = require("pg").Pool;

const pool = new Pool({
  ...CONFIG,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
