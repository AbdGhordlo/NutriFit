const express = require('express');
const { getExercisePlanByUser, generateExercisePlan } = require('../controllers/exercisePlannerController');
const router = express.Router();

router.get('/:userId', getExercisePlanByUser);
router.post("/generate-exercise-plan", generateExercisePlan);

module.exports = router;
