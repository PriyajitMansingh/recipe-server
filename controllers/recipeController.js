import * as recipeService from "../services/recipeService.js";
import * as userService from "../services/userService.js";

// ── GET PERSONALIZED RECIPES ─────────────────────
export const getPersonalizedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await userService.getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const preferences = {
      favoriteCuisine: userProfile.favoriteCuisine,
      dietaryPreferences: userProfile.dietaryPreferences,
      allergies: userProfile.allergies,
      availableIngredients: userProfile.availableIngredients,
      avoidedIngredients: userProfile.avoidedIngredients,
      number: parseInt(req.query.number) || 12,
      offset: parseInt(req.query.offset) || 0,
    };

    const data = await recipeService.fetchPersonalizedRecipes(preferences);

    res.status(200).json({
      recipes: data.results,
      totalResults: data.totalResults,
      offset: preferences.offset,
      number: preferences.number,
    });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 402) {
      return res
        .status(402)
        .json({ message: "Spoonacular API daily limit reached." });
    }
    res.status(500).json({ message: "Server error while fetching recipes." });
  }
};

// ── SEARCH RECIPES ───────────────────────────────
export const searchRecipes = async (req, res) => {
  try {
    const {
      query,
      cuisine,
      diet,
      type,
      maxReadyTime,
      number = 12,
      offset = 0,
    } = req.query;

    const searchParams = {
      query,
      cuisine,
      diet,
      type,
      maxReadyTime: maxReadyTime ? parseInt(maxReadyTime) : null,
      number: parseInt(number),
      offset: parseInt(offset),
    };

    const data = await recipeService.searchRecipes(searchParams);

    res.status(200).json({
      recipes: data.results,
      totalResults: data.totalResults,
      offset: parseInt(offset),
      number: parseInt(number),
    });
  } catch (err) {
    console.error(err.message);
    if (err.response?.status === 402) {
      return res
        .status(402)
        .json({ message: "Spoonacular API daily limit reached." });
    }
    res.status(500).json({ message: "Server error while searching recipes." });
  }
};

// ── GET SINGLE RECIPE BY ID ──────────────────────
export const getRecipeById = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await recipeService.fetchRecipeById(recipeId);
    res.status(200).json({ recipe });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 404) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.status(500).json({ message: "Server error while fetching recipe." });
  }
};
