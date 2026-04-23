import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userService from "../services/userService.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      favoriteCuisine,
      dietaryPreferences,
      allergies,
      availableIngredients,
      avoidedIngredients,
      preferredIngredients,
    } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const { userId } = await userService.createUser({
      name,
      email,
      password,
      favoriteCuisine,
      dietaryPreferences,
      allergies,
      availableIngredients,
      avoidedIngredients,
      preferredIngredients,
    });

    res.status(201).json({ message: "User registered successfully.", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await userService.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login." });
  }
};
