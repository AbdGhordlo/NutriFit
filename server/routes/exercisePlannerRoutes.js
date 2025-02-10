const express = require('express');
const { getExercisePlanByUser } = require('../controllers/exercisePlannerController');
const router = express.Router();

router.get('/:userId', getExercisePlanByUser);

module.exports = router;
