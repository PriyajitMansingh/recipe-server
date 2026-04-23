import pool from "../config/db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; // only auth details

    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Also create an empty preferences row for this user
    await pool.query(
      'INSERT INTO user_preferences (user_id) VALUES (?)',
      [result.insertId]
    );

    res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // 3. (Optional but best) Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // later move to .env
      { expiresIn: "1d" }
    );

    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login." });
  }
};