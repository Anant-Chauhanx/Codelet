const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { createClient } = require('redis');
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
   ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(process.env.DB_CA_CERT).toString(),
  },
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

    const { data: judgeResponse } = await axios.post(process.env.JUDGE_RESPONSE_URL, {
      source_code,
      language_id: getLanguageId(language),
      stdin,
    }, {
      headers: {
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'content-type': 'application/json',
        'useQueryString': true,
      },
    });

    const { token } = judgeResponse;

    let judgeResult;
    do {
      const { data: resultResponse } = await axios.get(`${process.env.JUDGE_RESPONSE_URL}/${token}?base64_encoded=true`, {
        headers: {
          'x-rapidapi-host': process.env.RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'content-type': 'application/json',
          'useQueryString': true,
        },
      });
      judgeResult = resultResponse;
    } while (judgeResult.status.id <= 2);

    const stdout = judgeResult.stdout;

    const updateQuery = `
      UPDATE submissions
      SET stdout = ?
      WHERE id = ?
    `;

    await connection.query(updateQuery, [stdout, result.insertId]);

    connection.release();

    await redisClient.del('submissions');

    const [submissions] = await pool.query("SELECT * FROM submissions ORDER BY submission_time DESC");

    await redisSet('submissions', JSON.stringify(submissions), 'EX', 600);

    res.status(200).json({
      message: "Submission successful",
      submissionId: result.insertId,
    });
  } catch (error) {
    console.error('Error on submission:', error);
    res.status(500).send('Server error');
  }
});

function getLanguageId(language) {
  const languages = {
    'Python': 71,
    'JavaScript': 63,
    'Java': Main,
    'C++': 54,
  };

  return languages[language];
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
