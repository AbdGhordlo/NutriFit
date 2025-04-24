const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {

    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered.'});
    }

    // Hash password and insert user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO "user" (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error while registering:', err.message);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const googleAuth = async (req, res) => {
  const { credential } = req.body;
  
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Check if user exists in your database
    const existingUser = await pool.query('SELECT * FROM "user" WHERE email = $1 OR google_id = $2', [email, googleId]);
    
    let userId;
    
    if (existingUser.rows.length === 0) {
      // Create a new user if they don't exist
      // Generate a random password for Google users (they'll never use it)
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      const newUser = await pool.query(
        'INSERT INTO "user" (username, email, password_hash, google_id, profile_image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, googleId, picture]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = existingUser.rows[0].id;
      
      // Update Google ID if it's not set (linking existing account)
      if (!existingUser.rows[0].google_id) {
        await pool.query('UPDATE "user" SET google_id = $1, profile_image = $2 WHERE id = $3', 
          [googleId, picture, userId]);
      }
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = { signup, login, googleAuth };