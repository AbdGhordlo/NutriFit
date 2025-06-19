const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import Middleware
const verifyToken = require("./middleware/auth");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const mealPlannerRoutes = require("./routes/mealPlannerRoutes");
const exercisePlannerRoutes = require("./routes/exercisePlannerRoutes");
const ingredientsRoutes = require("./routes/ingredientsRoutes");
const personalizationRoutes = require("./routes/personalizationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const progressRoutes = require("./routes/progressRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");

require("./utils/notificationScheduler");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS Configuration
app.use(cors({
  origin: "https://nutrifit-puce.vercel.app",
  credentials: true
}));

app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
app.use("/meal-planner", verifyToken, mealPlannerRoutes);
app.use("/exercise-planner", verifyToken, exercisePlannerRoutes);
app.use("/ingredients", verifyToken, ingredientsRoutes);
app.use("/personalization", verifyToken, personalizationRoutes);
app.use("/settings", verifyToken, settingsRoutes);
app.use("/upload", verifyToken, uploadRoutes);
app.use("/progress", verifyToken, progressRoutes);
app.use("/api/notifications", notificationsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
