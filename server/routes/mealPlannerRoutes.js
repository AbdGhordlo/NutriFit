const express = require('express');
const { getMealPlanByUser, getMealPlan } = require('../controllers/mealPlannerController');
const router = express.Router();

router.get('/:userId', getMealPlanByUser);
router.post("/generate-meal-plan", getMealPlan);

module.exports = router;
