const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in your database
      const user = await pool.query('SELECT * FROM "user" WHERE google_id = $1 OR email = $2', [profile.id, profile.emails[0].value]);

      if (user.rows.length > 0) {
        // User exists, return the user object
        return done(null, user.rows[0]);
      } else {
        // User doesn't exist, create a new user
        const newUser = await pool.query(
          'INSERT INTO "user" (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
          [profile.displayName, profile.emails[0].value, profile.id]
        );
        return done(null, newUser.rows[0]);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize and deserialize user (required for sessions)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM "user" WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;