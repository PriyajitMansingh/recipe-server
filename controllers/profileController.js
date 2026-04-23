import pool from "../config/db.js";

// ─── GET PROFILE ─────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware

    const userId = req.user.id; 

    // Get user basic info and preferences together using JOIN
    const [rows] = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        up.skill_level,
        up.dietary_prefs,
        up.allergies,
        up.available_ingredients,
        up.avoided_ingredients,
        up.updated_at
       FROM users u
       LEFT JOIN user_preferences up ON u.id = up.user_id
       WHERE u.id = ?`,
      [userId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];

    // Parse JSON fields before sending
    // MySQL returns JSON columns as strings so we need to parse them
    user.dietary_prefs = user.dietary_prefs
      ? JSON.parse(user.dietary_prefs)
      : [];
    user.allergies = user.allergies ? JSON.parse(user.allergies) : [];
    user.available_ingredients = user.available_ingredients
      ? JSON.parse(user.available_ingredients)
      : [];
    user.avoided_ingredients = user.avoided_ingredients
      ? JSON.parse(user.avoided_ingredients)
      : [];

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      skill_level,
      dietary_prefs,
      allergies,
      available_ingredients,
      avoided_ingredients,
    } = req.body;

    // Update user_preferences table
    await pool.query(
      `UPDATE user_preferences SET
        skill_level = ?,
        dietary_prefs = ?,
        allergies = ?,
        available_ingredients = ?,
        avoided_ingredients = ?
       WHERE user_id = ?`,
      [
        skill_level,
        JSON.stringify(dietary_prefs || []),
        JSON.stringify(allergies || []),
        JSON.stringify(available_ingredients || []),
        JSON.stringify(avoided_ingredients || []),
        userId,
      ],
    );

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};
