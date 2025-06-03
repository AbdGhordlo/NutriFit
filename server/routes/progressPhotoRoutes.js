const express = require('express');
const router = express.Router();
const { uploadProgressPhoto, listProgressPhotos, deleteProgressPhoto } = require('../controllers/progressPhotoController');

// Upload a progress photo
router.post('/:userId/photos', uploadProgressPhoto);

// List all progress photos for a user
router.get('/:userId/photos', listProgressPhotos);

// Delete a progress photo
router.delete('/:userId/photos/:photoId', deleteProgressPhoto);

module.exports = router;
