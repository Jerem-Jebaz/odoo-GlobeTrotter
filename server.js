import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'globetrotter',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        additionalInfo TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create states table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        country VARCHAR(100) DEFAULT 'India'
      )
    `);

    // Create cities table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) DEFAULT 'India',
        FOREIGN KEY (state) REFERENCES states(name) ON DELETE CASCADE
      )
    `);

    // Create trips table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        tripName VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        startDate DATE,
        endDate DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create itinerary_sections table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS itinerary_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tripId INT NOT NULL,
        sectionDate DATE,
        budget DECIMAL(10, 2),
        details TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    // Populate states if empty
    const [existingStates] = await connection.query('SELECT COUNT(*) as count FROM states');
    if (existingStates[0].count === 0) {
      const statesData = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
        'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
      ];
      for (const state of statesData) {
        await connection.query('INSERT INTO states (name, country) VALUES (?, ?)', [state, 'India']);
      }
      console.log('States populated');
    }

    // Populate cities if empty
    const [existingCities] = await connection.query('SELECT COUNT(*) as count FROM cities');
    if (existingCities[0].count === 0) {
      const citiesData = [
        { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
        { city: 'Vijayawada', state: 'Andhra Pradesh' },
        { city: 'Tirupati', state: 'Andhra Pradesh' },
        { city: 'Araku Valley', state: 'Andhra Pradesh' },
        { city: 'Lambasingi', state: 'Andhra Pradesh' },
        { city: 'Tawang', state: 'Arunachal Pradesh' },
        { city: 'Ziro', state: 'Arunachal Pradesh' },
        { city: 'Bomdila', state: 'Arunachal Pradesh' },
        { city: 'Itanagar', state: 'Arunachal Pradesh' },
        { city: 'Guwahati', state: 'Assam' },
        { city: 'Kaziranga', state: 'Assam' },
        { city: 'Jorhat', state: 'Assam' },
        { city: 'Majuli', state: 'Assam' },
        { city: 'Tezpur', state: 'Assam' },
        { city: 'Patna', state: 'Bihar' },
        { city: 'Gaya', state: 'Bihar' },
        { city: 'Nalanda', state: 'Bihar' },
        { city: 'Rajgir', state: 'Bihar' },
        { city: 'Raipur', state: 'Chhattisgarh' },
        { city: 'Jagdalpur', state: 'Chhattisgarh' },
        { city: 'Chitrakote', state: 'Chhattisgarh' },
        { city: 'Panaji', state: 'Goa' },
        { city: 'Calangute', state: 'Goa' },
        { city: 'Palolem', state: 'Goa' },
        { city: 'Baga', state: 'Goa' },
        { city: 'Candolim', state: 'Goa' },
        { city: 'Ahmedabad', state: 'Gujarat' },
        { city: 'Surat', state: 'Gujarat' },
        { city: 'Vadodara', state: 'Gujarat' },
        { city: 'Dwarka', state: 'Gujarat' },
        { city: 'Gir National Park', state: 'Gujarat' },
        { city: 'Somnath', state: 'Gujarat' },
        { city: 'Gurugram', state: 'Haryana' },
        { city: 'Kurukshetra', state: 'Haryana' },
        { city: 'Karnal', state: 'Haryana' },
        { city: 'Shimla', state: 'Himachal Pradesh' },
        { city: 'Manali', state: 'Himachal Pradesh' },
        { city: 'Dharamshala', state: 'Himachal Pradesh' },
        { city: 'McLeod Ganj', state: 'Himachal Pradesh' },
        { city: 'Kasol', state: 'Himachal Pradesh' },
        { city: 'Kasauli', state: 'Himachal Pradesh' },
        { city: 'Kufri', state: 'Himachal Pradesh' },
        { city: 'Spiti Valley', state: 'Himachal Pradesh' },
        { city: 'Ranchi', state: 'Jharkhand' },
        { city: 'Jamshedpur', state: 'Jharkhand' },
        { city: 'Deoghar', state: 'Jharkhand' },
        { city: 'Bengaluru', state: 'Karnataka' },
        { city: 'Mysuru', state: 'Karnataka' },
        { city: 'Hampi', state: 'Karnataka' },
        { city: 'Coorg', state: 'Karnataka' },
        { city: 'Chikmagalur', state: 'Karnataka' },
        { city: 'Gokarna', state: 'Karnataka' },
        { city: 'Udupi', state: 'Karnataka' },
        { city: 'Badami', state: 'Karnataka' },
        { city: 'Kochi', state: 'Kerala' },
        { city: 'Thiruvananthapuram', state: 'Kerala' },
        { city: 'Munnar', state: 'Kerala' },
        { city: 'Alappuzha', state: 'Kerala' },
        { city: 'Kumarakom', state: 'Kerala' },
        { city: 'Wayanad', state: 'Kerala' },
        { city: 'Varkala', state: 'Kerala' },
        { city: 'Bhopal', state: 'Madhya Pradesh' },
        { city: 'Indore', state: 'Madhya Pradesh' },
        { city: 'Khajuraho', state: 'Madhya Pradesh' },
        { city: 'Gwalior', state: 'Madhya Pradesh' },
        { city: 'Ujjain', state: 'Madhya Pradesh' },
        { city: 'Pachmarhi', state: 'Madhya Pradesh' },
        { city: 'Bandhavgarh', state: 'Madhya Pradesh' },
        { city: 'Mumbai', state: 'Maharashtra' },
        { city: 'Pune', state: 'Maharashtra' },
        { city: 'Aurangabad', state: 'Maharashtra' },
        { city: 'Nashik', state: 'Maharashtra' },
        { city: 'Lonavala', state: 'Maharashtra' },
        { city: 'Mahabaleshwar', state: 'Maharashtra' },
        { city: 'Alibaug', state: 'Maharashtra' },
        { city: 'Igatpuri', state: 'Maharashtra' },
        { city: 'Matheran', state: 'Maharashtra' },
        { city: 'Imphal', state: 'Manipur' },
        { city: 'Ukhrul', state: 'Manipur' },
        { city: 'Shillong', state: 'Meghalaya' },
        { city: 'Cherrapunji', state: 'Meghalaya' },
        { city: 'Mawlynnong', state: 'Meghalaya' },
        { city: 'Aizawl', state: 'Mizoram' },
        { city: 'Lunglei', state: 'Mizoram' },
        { city: 'Kohima', state: 'Nagaland' },
        { city: 'Dimapur', state: 'Nagaland' },
        { city: 'Mokokchung', state: 'Nagaland' },
        { city: 'Bhubaneswar', state: 'Odisha' },
        { city: 'Puri', state: 'Odisha' },
        { city: 'Cuttack', state: 'Odisha' },
        { city: 'Konark', state: 'Odisha' },
        { city: 'Amritsar', state: 'Punjab' },
        { city: 'Chandigarh', state: 'Chandigarh' },
        { city: 'Ludhiana', state: 'Punjab' },
        { city: 'Patiala', state: 'Punjab' },
        { city: 'Jaipur', state: 'Rajasthan' },
        { city: 'Udaipur', state: 'Rajasthan' },
        { city: 'Jaisalmer', state: 'Rajasthan' },
        { city: 'Jodhpur', state: 'Rajasthan' },
        { city: 'Mount Abu', state: 'Rajasthan' },
        { city: 'Pushkar', state: 'Rajasthan' },
        { city: 'Gangtok', state: 'Sikkim' },
        { city: 'Pelling', state: 'Sikkim' },
        { city: 'Lachung', state: 'Sikkim' },
        { city: 'Yuksom', state: 'Sikkim' },
        { city: 'Chennai', state: 'Tamil Nadu' },
        { city: 'Coimbatore', state: 'Tamil Nadu' },
        { city: 'Madurai', state: 'Tamil Nadu' },
        { city: 'Ooty', state: 'Tamil Nadu' },
        { city: 'Kodaikanal', state: 'Tamil Nadu' },
        { city: 'Kanyakumari', state: 'Tamil Nadu' },
        { city: 'Mahabalipuram', state: 'Tamil Nadu' },
        { city: 'Hyderabad', state: 'Telangana' },
        { city: 'Warangal', state: 'Telangana' },
        { city: 'Nizamabad', state: 'Telangana' },
        { city: 'Agartala', state: 'Tripura' },
        { city: 'Udaipur (Tripura)', state: 'Tripura' },
        { city: 'Lucknow', state: 'Uttar Pradesh' },
        { city: 'Varanasi', state: 'Uttar Pradesh' },
        { city: 'Agra', state: 'Uttar Pradesh' },
        { city: 'Prayagraj', state: 'Uttar Pradesh' },
        { city: 'Mathura', state: 'Uttar Pradesh' },
        { city: 'Ayodhya', state: 'Uttar Pradesh' },
        { city: 'Dehradun', state: 'Uttarakhand' },
        { city: 'Rishikesh', state: 'Uttarakhand' },
        { city: 'Nainital', state: 'Uttarakhand' },
        { city: 'Mussoorie', state: 'Uttarakhand' },
        { city: 'Haridwar', state: 'Uttarakhand' },
        { city: 'Auli', state: 'Uttarakhand' },
        { city: 'Kolkata', state: 'West Bengal' },
        { city: 'Darjeeling', state: 'West Bengal' },
        { city: 'Siliguri', state: 'West Bengal' },
        { city: 'Digha', state: 'West Bengal' },
        { city: 'Delhi', state: 'Delhi' },
        { city: 'Puducherry', state: 'Puducherry' },
        { city: 'Auroville', state: 'Puducherry' },
        { city: 'Port Blair', state: 'Andaman and Nicobar Islands' },
        { city: 'Havelock Island', state: 'Andaman and Nicobar Islands' },
        { city: 'Neil Island', state: 'Andaman and Nicobar Islands' },
        { city: 'Leh', state: 'Ladakh' },
        { city: 'Kargil', state: 'Ladakh' },
      ];
      for (const cityData of citiesData) {
        await connection.query('INSERT INTO cities (name, state, country) VALUES (?, ?, ?)', 
          [cityData.city, cityData.state, 'India']);
      }
      console.log('Cities populated');
    }

    // Check if admin user exists, if not create one
    const [adminUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@globetrotter.com']
    );

    if (adminUser.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await connection.query(
        'INSERT INTO users (firstName, lastName, email, password, phone, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Admin', 'User', 'admin@globetrotter.com', hashedPassword, '+91-0000000000', 'Delhi', 'India']
      );
      console.log('Admin user created: admin@globetrotter.com / password: admin');
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, city, country, additionalInfo } = req.body;

    // Validate input
    if (!email || !password || !firstName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    // Check if email already exists
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await connection.query(
      'INSERT INTO users (firstName, lastName, email, password, phone, city, country, additionalInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, phone || null, city || null, country || 'India', additionalInfo || null]
    );

    connection.release();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();

    // Find user by email
    const [users] = await connection.query(
      'SELECT id, firstName, lastName, email, password, phone, city, country FROM users WHERE email = ?',
      [email]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        country: user.country
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
// Get States
app.get('/api/states', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [states] = await connection.query('SELECT name FROM states ORDER BY name');
    connection.release();
    
    res.json({ states: states.map(s => s.name) });
  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Get Cities by State
app.get('/api/cities/:state', async (req, res) => {
  try {
    const { state } = req.params;
    const connection = await pool.getConnection();
    const [cities] = await connection.query(
      'SELECT name FROM cities WHERE state = ? ORDER BY name',
      [state]
    );
    connection.release();
    
    res.json({ cities: cities.map(c => c.name) });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT id, firstName, lastName, email, phone, city, country FROM users WHERE id = ?',
      [req.userId]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user trips
app.get('/api/trips', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [trips] = await connection.query(
      'SELECT id, tripName, city, state, country, startDate, endDate, createdAt FROM trips WHERE userId = ? ORDER BY createdAt DESC',
      [req.userId]
    );

    connection.release();

    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// Create trip
app.post('/api/trips', verifyToken, async (req, res) => {
  try {
    const { tripName, city, state, country, startDate, endDate } = req.body;

    if (!tripName || !city || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO trips (userId, tripName, city, state, country, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, tripName, city, state, country || 'India', startDate, endDate]
    );

    connection.release();

    res.status(201).json({ 
      id: result.insertId,
      message: 'Trip created successfully'
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Delete trip
app.delete('/api/trips/:tripId', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;

    const connection = await pool.getConnection();

    // Verify trip belongs to user
    const [trips] = await connection.query(
      'SELECT id FROM trips WHERE id = ? AND userId = ?',
      [tripId, req.userId]
    );

    if (trips.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Delete trip and related sections
    await connection.query('DELETE FROM trips WHERE id = ?', [tripId]);

    connection.release();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Get itinerary sections
app.get('/api/trips/:tripId/sections', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;

    const connection = await pool.getConnection();

    // Verify trip belongs to user
    const [trips] = await connection.query(
      'SELECT id FROM trips WHERE id = ? AND userId = ?',
      [tripId, req.userId]
    );

    if (trips.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Trip not found' });
    }

    const [sections] = await connection.query(
      'SELECT id, sectionDate, budget, details FROM itinerary_sections WHERE tripId = ? ORDER BY sectionDate',
      [tripId]
    );

    connection.release();

    res.json({ sections });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Save itinerary sections
app.post('/api/trips/:tripId/sections', verifyToken, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { sections } = req.body;

    const connection = await pool.getConnection();

    // Verify trip belongs to user
    const [trips] = await connection.query(
      'SELECT id FROM trips WHERE id = ? AND userId = ?',
      [tripId, req.userId]
    );

    if (trips.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Delete existing sections
    await connection.query('DELETE FROM itinerary_sections WHERE tripId = ?', [tripId]);

    // Insert new sections
    if (sections && sections.length > 0) {
      for (const section of sections) {
        await connection.query(
          'INSERT INTO itinerary_sections (tripId, sectionDate, budget, details) VALUES (?, ?, ?, ?)',
          [tripId, section.date, section.budget || null, section.details || null]
        );
      }
    }

    connection.release();

    res.json({ message: 'Sections saved successfully' });
  } catch (error) {
    console.error('Save sections error:', error);
    res.status(500).json({ error: 'Failed to save sections' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  initializeDatabase();
});
