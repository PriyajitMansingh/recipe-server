import express from 'express';
import {
  submitReview,
  getReviews,
  getReviewSummary,
  deleteReview,
  checkUserReview
} from '../controllers/reviewController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// ⚠️ specific routes must come before /:id
router.post('/', verifyToken, submitReview);
router.get('/:recipeId/summary', verifyToken, getReviewSummary);
router.get('/:recipeId/check', verifyToken, checkUserReview);
router.get('/:recipeId', verifyToken, getReviews);
router.delete('/:id', verifyToken, deleteReview);

export default router;