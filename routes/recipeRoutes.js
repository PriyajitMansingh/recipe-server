import express from 'express';
import {
  getPersonalizedRecipes,
  getRecipeById,searchRecipes
} from '../controllers/recipeController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// ⚠️ /personalized MUST come before /:id
router.get('/personalized', verifyToken, getPersonalizedRecipes);
router.get('/search', verifyToken, searchRecipes);
router.get('/:id', verifyToken, getRecipeById);

export default router;