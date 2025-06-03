const express = require('express');
const {
  getAdoptedMealPlanByUser,
  getAllMealPlansByUser,
  saveMealPlan,
  saveAndAdoptMealPlan,
  adoptMealPlan,
  getMealPlan,
  getFavoriteMeals,
  addFavoriteMeal,
  removeFavoriteMeal,
  regenerateDay,
  regenerateMeal,
  replaceMealWithFavorite,
  removeSavedPlan,
} = require('../controllers/mealPlannerController');

const router = express.Router();

// Fetch the adopted meal plan for a user
router.get('/adopted/:userId', getAdoptedMealPlanByUser);

// Fetch all meal plans for a user (only plan info, no meals)
router.get('/all/:userId', getAllMealPlansByUser);

// Save a meal plan
router.post('/save-meal-plan', saveMealPlan);

// Save and adopt a meal plan
router.post('/save-and-adopt-meal-plan', saveAndAdoptMealPlan);

// Adopt a specific meal plan (by ID)
router.post('/adopt-meal-plan', adoptMealPlan);

// Generate a meal plan using AI
router.post('/generate-meal-plan', getMealPlan);

router.delete('/remove-meal-plan', removeSavedPlan);

// ------------------- Edit Plan

// Favorite meals routes
router.get('/favorites/:userId', getFavoriteMeals);
router.post('/favorites', addFavoriteMeal);
router.delete('/favorites', removeFavoriteMeal);

// Meal plan editing routes
router.post('/regenerate-day', regenerateDay);
router.post('/regenerate-meal', regenerateMeal);
router.post('/replace-with-favorite', replaceMealWithFavorite);

module.exports = router;