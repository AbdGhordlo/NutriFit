const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { OAuth2Client } = require("google-auth-library");
const { createDefaultMealPlan } = require("./mealPlannerController");
const { createDefaultExercisePlan } = require("./exercisePlannerController");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * User signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO "user" (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    
    const userId = result.rows[0].id;
    
    // Create default settings for the user
    await pool.query(
      `INSERT INTO settings 
        (user_id, meal_reminders, exercise_reminders, progress_updates, water_intake_reminder, personalize_completed)
      VALUES 
        ($1, TRUE, TRUE, TRUE, TRUE, FALSE)`,
      [userId]
    );

     // Create default plans
    try {
      await createDefaultMealPlan(userId);
      await createDefaultExercisePlan(userId);
      
      await pool.query(
        `UPDATE meal_plan SET is_adopted_plan = TRUE 
         WHERE user_id = $1 AND name = 'Healthy Starter Meal Plan'`,
        [userId]
      );
      
      await pool.query(
        `UPDATE exercise_plan SET is_adopted_plan = TRUE 
         WHERE user_id = $1 AND name = 'Starter Fitness Plan'`,
        [userId]
      );
    } catch (planError) {
      console.error("Error creating default plans:", planError);
    }

    // Create JWT token
    const token = jwt.sign(
      { id: userId, email: result.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } //24??
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: userId,
        username: result.rows[0].username,
        email: result.rows[0].email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * User login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM "user" WHERE email =  $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } //24hrs??
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  // Verify that the authenticated user is deleting their own account
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Delete the user (cascade will handle related tables)
    await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists in your database
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1 OR google_id = $2',
      [email, googleId]
    );

    let userId;

    if (existingUser.rows.length === 0) {
      // Create a new user if they don't exist
      // Generate a random password for Google users (they'll never use it)
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = await pool.query(
        'INSERT INTO "user" (username, email, password_hash, google_id, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, googleId, picture]
      );
      userId = newUser.rows[0].id;

       // Create default plans for new users
      try {
        await createDefaultMealPlan(userId);
        await createDefaultExercisePlan(userId);
        
        // Adopt the default plans
        await pool.query(
          `UPDATE meal_plan SET is_adopted_plan = TRUE 
           WHERE user_id = $1 AND name = 'Healthy Starter Meal Plan'`,
          [userId]
        );
        
        await pool.query(
          `UPDATE exercise_plan SET is_adopted_plan = TRUE 
           WHERE user_id = $1 AND name = 'Starter Fitness Plan'`,
          [userId]
        );
      } catch (planError) {
        console.error("Error creating default plans:", planError);
        // Don't fail auth if plans fail - just log the error
      }
    } else {
      userId = existingUser.rows[0].id;

      // Update Google ID if it's not set (linking existing account)
      if (!existingUser.rows[0].google_id) {
        await pool.query(
          'UPDATE "user" SET google_id = $1, profile_picture = $2 WHERE id = $3',
          [googleId, picture, userId]
        );
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

module.exports = { signup, login, deleteAccount, googleAuth };
