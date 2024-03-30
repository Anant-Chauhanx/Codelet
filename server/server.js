const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const redisGet = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    console.error('Redis get error:', error);
    throw error;
  }
};

const redisSet = async (key, value, mode = 'EX', duration = 600) => {
  try {
    await redisClient.set(key, value, mode, duration);
  } catch (error) {
    console.error('Redis set error:', error);
    throw error;
  }
};

const verifyDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database.');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

verifyDbConnection();

app.get('/api/submissions', async (req, res) => {
  try {
    const cacheKey = 'submissions';
    const cachedSubmissions = await redisGet(cacheKey);
    if (cachedSubmissions) {
      // console.log('Serving from cache');
      return res.json(JSON.parse(cachedSubmissions));
    }

    const [submissions] = await pool.query("SELECT * FROM submissions ORDER BY submission_time DESC");
    await redisSet(cacheKey, JSON.stringify(submissions), 'EX', 600);
    // console.log('Serving from database');
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('Server error');
  }
});


app.post('/api/submit', async (req, res) => {
  const { username, language, stdin, source_code, submission_time } = req.body;

  const query = `
    INSERT INTO submissions (username, language, stdin, source_code, submission_time)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(query, [username, language, stdin, source_code, new Date(submission_time)]);
    connection.release();

    await redisClient.del('submissions');

    res.status(200).json({
      message: "Submission successful",
      submissionId: result.insertId,
    });
  } catch (error) {
    console.error('Error on submission:', error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
