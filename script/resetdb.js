import pool from "../config/db.js";

const resetDatabase = async () => {
  try {
    console.log("Starting database reset...");

    console.log("Dropping tables if exist...");
    await pool.query(`DROP TABLE IF EXISTS recipe_reviews`);
    await pool.query(`DROP TABLE IF EXISTS user_preferences`);
    await pool.query(`DROP TABLE IF EXISTS users`);
    console.log("✓ All tables dropped");

    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ users table created");

    console.log("Creating user_preferences table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        favorite_cuisine VARCHAR(50),
        dietary_prefs JSON,
        allergies JSON,
        available_ingredients JSON,
        avoided_ingredients JSON,
        preferred_ingredients JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✓ user_preferences table created");

    console.log("Creating recipe_reviews table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipe_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        recipe_id VARCHAR(100) NOT NULL,
        recipe_source VARCHAR(50) NOT NULL,
        rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_recipe (user_id, recipe_id, recipe_source)
      )
    `);
    console.log("✓ recipe_reviews table created");

    console.log("Database reset completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database reset failed:", error.message);
    process.exit(1);
  }
};

resetDatabase();