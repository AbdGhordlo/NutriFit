const express = require('express');
const {
  getPersonalizationData,
  createPersonalizationData,
  updatePersonalizationStep
} = require('../controllers/personalizationController');
const router = express.Router();

// Route to get the personalization data for a user
router.get('/:userId', getPersonalizationData);

// Route to create or update personalization data for a user
router.post('/:userId', createPersonalizationData);

// Route to update a specific step of personalization data
router.put('/:userId/step/:stepNumber', updatePersonalizationStep);

module.exports = router;

