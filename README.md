# Codelet

Welcome to the Codelet Repository, a web application designed to empower coders by facilitating the easy submission and display of code snippets. 

## Features

- **Cache with Redis:** Utilizes Redis to cache the information displayed in the table, minimizing database read requests.
- **External API Integration:** Incorporates the Judge0 API to retrieve the output of the code, which is then displayed in a new 'stdout' column.
- **Submit Code Snippets:** Users can submit their code snippets along with details such as the username, preferred code language, and standard input.
- **View Submissions:** All submissions are displayed in a tabular format, featuring the username, code language, stdin, and the timestamp of submission. The source code is limited to the initial 100 characters for quick browsing.

## Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **External API:** Judge0 API
- **Others:** dotenv, CORS





