📚 Library Management Website

A full-stack web application that mimics a library management system. It provides functionality for both librarians and users to manage accounts, books, and borrowing records in a streamlined way.

✨ Features
👩‍🏫 Librarians

Create and delete librarian accounts

Add, update, and delete books, magazines, and journals

View all clients and their currently checked-out items

Track overdue returns

👤 Users (Clients)

Register and log in securely

Search for books by title or author

Check out and return books

View personal list of checked-out items

See which items are overdue

🛠️ Tech Stack

Frontend:

Static HTML, CSS, and JavaScript served from an Express app

Backend:

Node.js
 with Express
 for routing and APIs

RESTful API endpoints for authentication, account management, and book operations

Database:

PostgreSQL for relational data storage

Hosted on Neon
, a serverless cloud Postgres provider (free tier)

Tables for librarian, client, book, journal_article, magazine, copy_of_document, and related sequences

ORM/Driver:

pg
 (node-postgres) for database queries

Configuration:

dotenv
 for environment variables

.env file stores DB connection credentials, including the Neon connection string

Deployment:

Ready to deploy on Render
 for hosting the Node.js backend

🚀 Getting Started
Prerequisites

Node.js v18+

npm

PostgreSQL (for local testing, optional if using Neon directly)

Installation
# Clone repository
git clone https://github.com/your-username/Library-Management-Website.git
cd Library-Management-Website

# Install dependencies
npm install

Local Development

Create a .env file with your Neon connection string:

DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require


Start the server:

npm start


Visit http://localhost:3000/login in your browser.

🌐 Live Deployment (Render + Neon)

Deploy this repo as a Web Service on Render.

Add DATABASE_URL in Render’s environment variables.

Neon hosts the Postgres database in the cloud, ensuring the app works without running PostgreSQL locally.

📖 Future Improvements

Add librarian analytics dashboard

Integrate JWT-based authentication

Improve UI with a frontend framework (React or Vue)

Add email notifications for overdue books
