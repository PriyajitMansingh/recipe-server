import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // wait if all connections are busy
  connectionLimit: 10, // max 10 connections at a time
  queueLimit: 0,
});
console.log("connected");

export default pool.promise();
