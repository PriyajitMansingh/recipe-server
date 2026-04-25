import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";
const API_KEY = process.env.SPOONACULAR_API_KEY;

// ── 1. DIET MAPPING ─────────────────────────────
const mapDiet = (dietaryPreferences) => {
  if (!dietaryPreferences || dietaryPreferences.length === 0) return null;

  const dietMap = {
    vegan: "vegan",
    vegetarian: "vegetarian",
    "gluten-free": "gluten free",
    "gluten free": "gluten free",
    keto: "ketogenic",
    ketogenic: "ketogenic",
    halal: null,
    other: null,
  };

  const priority = [
    "vegan",
    "vegetarian",
    "gluten-free",
    "gluten free",
    "keto",
    "ketogenic",
  ];

  for (const p of priority) {
    const found = dietaryPreferences.find((d) => d.toLowerCase() === p);
    if (found && dietMap[found.toLowerCase()]) {
      return dietMap[found.toLowerCase()];
    }
  }

  return null;
};

// ── 2. INTOLERANCES MAPPING ──────────────────────
const mapIntolerances = (allergies) => {
  if (!allergies || allergies.length === 0) return null;

  const intoleranceMap = {
    peanuts: "peanut",
    peanut: "peanut",
    dairy: "dairy",
    eggs: "egg",
    egg: "egg",
    seafood: "seafood",
    soy: "soy",
    gluten: "gluten",
    wheat: "wheat",
    other: null,
  };

  const mapped = allergies
    .map((a) => intoleranceMap[a.toLowerCase()])
    .filter(Boolean);

  return mapped.length > 0 ? mapped.join(",") : null;
};

// ── 3. CUISINE MAPPING ───────────────────────────
const mapCuisine = (cuisine) => {
  if (!cuisine) return null;
  return cuisine.toLowerCase();
};

// ── 4. INGREDIENTS MAPPING ───────────────────────
const mapIngredients = (ingredients) => {
  if (!ingredients || ingredients.length === 0) return null;
  return ingredients.join(",");
};

// ── FETCH PERSONALIZED RECIPES ───────────────────
export const fetchPersonalizedRecipes = async (preferences) => {
  const {
    favoriteCuisine,
    dietaryPreferences,
    number = 12,
    offset = 0,
  } = preferences;

  const params = {
    apiKey: API_KEY,
    addRecipeInformation: true,
    number,
    offset,
  };

  // Only send cuisine and diet for now
  const cuisine = mapCuisine(favoriteCuisine);
  if (cuisine) params.cuisine = cuisine;

  const diet = mapDiet(dietaryPreferences);
  if (diet) params.diet = diet;

  console.log("Spoonacular params:", params);

  const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
    params,
  });

  return response.data;
};

// ── FETCH SINGLE RECIPE BY ID ────────────────────
export const fetchRecipeById = async (recipeId) => {
  const response = await axios.get(
    `${SPOONACULAR_BASE_URL}/${recipeId}/information`,
    {
      params: {
        apiKey: API_KEY,
        includeNutrition: false,
      },
    },
  );

  return response.data;
};

// ── SEARCH RECIPES ───────────────────────────────
export const searchRecipes = async (searchParams) => {
  const {
    query,
    cuisine,
    diet,
    type,
    maxReadyTime,
    number = 12,
    offset = 0,
  } = searchParams;

  const params = {
    apiKey: API_KEY,
    addRecipeInformation: true,
    number,
    offset,
  };

  if (query) params.query = query;
  if (cuisine) params.cuisine = cuisine.toLowerCase();
  if (diet) params.diet = diet.toLowerCase();
  if (type) params.type = type.toLowerCase();
  if (maxReadyTime) params.maxReadyTime = maxReadyTime;

  console.log("Search params:", params);

  const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
    params,
  });

  return response.data;
};
