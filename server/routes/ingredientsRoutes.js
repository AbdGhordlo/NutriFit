const express = require("express");
const {
  getUserIngredients,
  toggleIngredientStock,
  addIngredient,
  deleteIngredient,
} = require("../controllers/ingredientsController");
const router = express.Router();

router.get("/:userId", getUserIngredients);

router.patch("/:userIngredientId/toggle-stock", toggleIngredientStock);

router.post("/", addIngredient);

router.delete("/:userIngredientId", deleteIngredient);

module.exports = router;
