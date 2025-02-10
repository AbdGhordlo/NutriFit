const express = require('express');
const { getMealPlanByUser } = require('../controllers/mealPlannerController');
const router = express.Router();

router.get('/:userId', getMealPlanByUser);

module.exports = router;
