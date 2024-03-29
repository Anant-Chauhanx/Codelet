const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
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
    const [submissions] = await pool.query("SELECT * FROM submissions ORDER BY submission_time DESC");
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
