const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  deleteNotification
} = require("../controllers/notificationsController");

// POST /api/notifications/generate-today
router.post("/generate-today", createNotification);

// GET /api/notifications/user/:userId
router.get("/user/:userId", getUserNotifications);

// DELETE /api/notifications/:notificationId
router.delete("/:notificationId", deleteNotification);

module.exports = router;
