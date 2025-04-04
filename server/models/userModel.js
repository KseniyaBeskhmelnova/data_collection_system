const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
let db;

const initializeDatabase = async () => {
    if (!fs.existsSync('./data.db')) {
        fs.writeFileSync('./data.db', '');
    }
    db = new sqlite3.Database('./data.db', err => {
        if (err) {
            console.error('Database connection error:', err.message);
            throw err;
        }
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                data TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);
    });
};

const getDb = () => db;

module.exports = { initializeDatabase, getDb };
