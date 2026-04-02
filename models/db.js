"use strict";
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgresql://localhost/jokebook";

const poolConfig = { connectionString };
if (connectionString && connectionString.includes("sslmode=require")) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);
module.exports = pool;
