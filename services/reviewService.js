import pool from '../config/db.js';

// ── CREATE REVIEW ────────────────────────────────
export const createReview = async (userId, recipeId, rating, comment) => {
  const [result] = await pool.query(
    `INSERT INTO recipe_reviews 
      (user_id, recipe_id, recipe_source, rating, review_text) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, recipeId, 'spoonacular', rating, comment]
  );

  return result.insertId;
};

// ── GET REVIEWS FOR RECIPE ───────────────────────
export const getReviewsByRecipeId = async (recipeId) => {
  const [rows] = await pool.query(
    `SELECT 
      r.id,
      r.rating,
      r.review_text AS comment,
      r.created_at,
      r.updated_at,
      u.name AS userName
     FROM recipe_reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.recipe_id = ?
     ORDER BY r.created_at DESC`,
    [recipeId]
  );

  return rows;
};

// ── GET REVIEW SUMMARY ───────────────────────────
export const getReviewSummary = async (recipeId) => {
  const [rows] = await pool.query(
    `SELECT 
      COUNT(*) AS totalReviews,
      ROUND(AVG(rating), 1) AS averageRating,
      SUM(rating = 5) AS fiveStar,
      SUM(rating = 4) AS fourStar,
      SUM(rating = 3) AS threeStar,
      SUM(rating = 2) AS twoStar,
      SUM(rating = 1) AS oneStar
     FROM recipe_reviews
     WHERE recipe_id = ?`,
    [recipeId]
  );

  return rows[0];
};

// ── DELETE REVIEW ────────────────────────────────
export const deleteReview = async (reviewId, userId) => {
  const [result] = await pool.query(
    'DELETE FROM recipe_reviews WHERE id = ? AND user_id = ?',
    [reviewId, userId]
  );

  return result.affectedRows > 0;
};

// ── CHECK IF USER REVIEWED ───────────────────────
export const hasUserReviewed = async (userId, recipeId) => {
  const [rows] = await pool.query(
    'SELECT id FROM recipe_reviews WHERE user_id = ? AND recipe_id = ?',
    [userId, recipeId]
  );

  return rows.length > 0;
};