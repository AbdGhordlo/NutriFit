const express = require('express');
const {
  getAdoptedMealPlanByUser,
  getAllMealPlansByUser,
  saveMealPlan,
  saveAndAdoptMealPlan,
  adoptMealPlan,
  getMealPlan,
} = require('../controllers/mealPlannerController');

const router = express.Router();

// Fetch the adopted meal plan for a user
router.get('/:userId/adopted', getAdoptedMealPlanByUser);

// Fetch all meal plans for a user (only plan info, no meals)
router.get('/:userId/all', getAllMealPlansByUser);

// Save a meal plan
router.post('/save-meal-plan', saveMealPlan);

// Save and adopt a meal plan
router.post('/save-and-adopt-meal-plan', saveAndAdoptMealPlan);

// Adopt a specific meal plan (by ID)
router.post('/adopt-meal-plan', adoptMealPlan);

// Generate a meal plan using AI
router.post('/:userId/generate-meal-plan', getMealPlan);

module.exports = router;