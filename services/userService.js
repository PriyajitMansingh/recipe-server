import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const safeParseJSON = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const createUser = async (userData) => {
  const { name, email, password, favoriteCuisine, dietaryPreferences, allergies, availableIngredients, avoidedIngredients, preferredIngredients } = userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    const userId = userResult.insertId;

    await connection.query(
      'INSERT INTO user_preferences (user_id, favorite_cuisine, dietary_prefs, allergies, available_ingredients, avoided_ingredients, preferred_ingredients) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, favoriteCuisine, JSON.stringify(dietaryPreferences || []), JSON.stringify(allergies || []), JSON.stringify(availableIngredients || []), JSON.stringify(avoidedIngredients || []), JSON.stringify(preferredIngredients || [])]
    );

    await connection.commit();
    return { userId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findUserByEmail = async (email) => {
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return users[0] || null;
};

export const findUserById = async (id) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return users[0] || null;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const getUserProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
      u.id,
      u.name,
      u.email,
      u.created_at,
      up.favorite_cuisine,
      up.dietary_prefs,
      up.allergies,
      up.available_ingredients,
      up.avoided_ingredients,
      up.preferred_ingredients,
      up.updated_at
    FROM users u
    LEFT JOIN user_preferences up ON u.id = up.user_id
    WHERE u.id = ?`,
    [userId]
  );
  
  if (!rows[0]) return null;
  
  const user = rows[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    favoriteCuisine: user.favorite_cuisine,
    dietaryPreferences: safeParseJSON(user.dietary_prefs),
    allergies: safeParseJSON(user.allergies),
    availableIngredients: safeParseJSON(user.available_ingredients),
    avoidedIngredients: safeParseJSON(user.avoided_ingredients),
    preferredIngredients: safeParseJSON(user.preferred_ingredients)
  };
};

export const updateUserProfile = async (userId, data) => {
  const { name } = data;
  
  if (name) {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
  }
};

export const updateUserPreferences = async (userId, data) => {
  const { favoriteCuisine, dietaryPreferences, allergies, availableIngredients, avoidedIngredients, preferredIngredients } = data;
  
  await pool.query(
    `UPDATE user_preferences SET
      favorite_cuisine = ?,
      dietary_prefs = ?,
      allergies = ?,
      available_ingredients = ?,
      avoided_ingredients = ?,
      preferred_ingredients = ?
    WHERE user_id = ?`,
    [
      favoriteCuisine || null,
      JSON.stringify(dietaryPreferences || []),
      JSON.stringify(allergies || []),
      JSON.stringify(availableIngredients || []),
      JSON.stringify(avoidedIngredients || []),
      JSON.stringify(preferredIngredients || []),
      userId
    ]
  );
};