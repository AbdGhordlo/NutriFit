const express = require('express');
const {
  getUserIngredients,
  toggleIngredientStock,
  addIngredient,
} = require('../controllers/ingredientsController');
const router = express.Router();

router.get('/:userId', getUserIngredients);

router.put('/:userId/:ingredientId', toggleIngredientStock);

router.post('/', addIngredient);

module.exports = router;