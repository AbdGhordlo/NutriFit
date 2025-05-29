const express = require('express');
const {
  getAdoptedMealPlanByUser,
  getAllMealPlansByUser,
  getTodaysMealsByUser,
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
} = require('../controllers/mealPlannerController');

const router = express.Router();

// Fetch the adopted meal plan for a user
router.get('/:userId/adopted', getAdoptedMealPlanByUser);

// Fetch all meal plans for a user (only plan info, no meals)
router.get('/:userId/all', getAllMealPlansByUser);

// Fetch today's meals for a user from their adopted meal plan
router.get('/users/:userId/meals/today', getTodaysMealsByUser);

// Save a meal plan
router.post('/save-meal-plan', saveMealPlan);

// Save and adopt a meal plan
router.post('/save-and-adopt-meal-plan', saveAndAdoptMealPlan);

// Adopt a specific meal plan (by ID)
router.post('/adopt-meal-plan', adoptMealPlan);

// Generate a meal plan using AI
router.post('/:userId/generate-meal-plan', getMealPlan);


// ------------------- Edit Plan

// Favorite meals routes
router.get('/favorites/:userId', getFavoriteMeals);
router.post('/favorites/:userId', addFavoriteMeal);
router.delete('/favorites/:userId/:mealId', removeFavoriteMeal);

// Meal plan editing routes
router.post('/regenerate-day/:userId/:dayNumber', regenerateDay);
router.post('/regenerate-meal/:userId/:mealPlanMealId', regenerateMeal);
router.post('/replace-with-favorite/:userId', replaceMealWithFavorite);

module.exports = router;