import * as userService from "../services/userService.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserProfile(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching user." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    await userService.updateUserProfile(userId, { name });
    
    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating user." });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { favoriteCuisine, dietaryPreferences, allergies, availableIngredients, avoidedIngredients, preferredIngredients } = req.body;
    
    await userService.updateUserPreferences(userId, {
      favoriteCuisine,
      dietaryPreferences,
      allergies,
      availableIngredients,
      avoidedIngredients,
      preferredIngredients
    });
    
    res.status(200).json({ message: "Preferences updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating preferences." });
  }
};