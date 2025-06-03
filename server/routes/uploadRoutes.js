//uploadRoutes.js

const express = require("express");
const { uploadProfilePicture, deleteProfilePicture } = require("../controllers/uploadController");
const router = express.Router();

// POST ⇒ upload a new picture (multer + auto‐delete old file)
router.post("/:userId/profile-picture", uploadProfilePicture);

// DELETE ⇒ remove the existing picture (delete file + clear DB fields)
router.delete("/:userId/profile-picture", deleteProfilePicture);

module.exports = router;
