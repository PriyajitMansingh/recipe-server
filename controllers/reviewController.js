import * as reviewService from '../services/reviewService.js';

// ── SUBMIT REVIEW ────────────────────────────────
export const submitReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId, rating, comment } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: 'Recipe ID is required.' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const reviewId = await reviewService.createReview(
      userId,
      recipeId,
      rating,
      comment || ''
    );

    res.status(201).json({
      message: 'Review submitted successfully.',
      reviewId
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'You have already reviewed this recipe.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error while submitting review.' });
  }
};

// ── GET REVIEWS ──────────────────────────────────
export const getReviews = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const reviews = await reviewService.getReviewsByRecipeId(recipeId);

    res.status(200).json({ reviews });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching reviews.' });
  }
};

// ── GET REVIEW SUMMARY ───────────────────────────
export const getReviewSummary = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const summary = await reviewService.getReviewSummary(recipeId);

    res.status(200).json({ summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching summary.' });
  }
};

// ── DELETE REVIEW ────────────────────────────────
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const deleted = await reviewService.deleteReview(reviewId, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or not authorized.' });
    }

    res.status(200).json({ message: 'Review deleted successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting review.' });
  }
};

// ── CHECK IF USER REVIEWED ───────────────────────
export const checkUserReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const hasReviewed = await reviewService.hasUserReviewed(userId, recipeId);

    res.status(200).json({ hasReviewed });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while checking review.' });
  }
};