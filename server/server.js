const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); 
const passport = require('./config/passport');
const session = require('express-session'); 


//Import Middleware
const verifyToken = require('./middleware/auth'); // Import middleware

//Import Routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const homeRoutes = require('./routes/homeRoutes'); // Import auth routes
const mealPlannerRoutes = require('./routes/mealPlannerRoutes');
const exercisePlannerRoutes = require('./routes/exercisePlannerRoutes');
const ingredientsRoutes = require('./routes/ingredientsRoutes'); 
const personalizationRoutes = require('./routes/personalizationRoutes');

dotenv.config(); // Loads environment variables from a .env file into process.env
const app = express(); 
const port = process.env.PORT || 5000;

// Google Auth session middleware
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // This mounts the authRoutes router under the /auth path.
app.use('/', homeRoutes); // This mounts the authRoutes router under the /auth path.
app.use('/meal-planner', verifyToken, mealPlannerRoutes);
app.use('/exercise-planner', verifyToken, exercisePlannerRoutes);
app.use('/ingredients', verifyToken, ingredientsRoutes); 
app.use('/personalization', verifyToken, personalizationRoutes);
/* For example: A route defined in authRoutes as POST /login becomes POST /auth/login */

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});