import sqlite3 from 'sqlite3';
import fs from "fs";
import path from "path";
import { app } from "electron";

const userDataPath = app.getPath("userData"); // Get writable directory
const dbFolderPath = path.join(userDataPath, "db"); 
const dbFilePath = path.join(dbFolderPath, "db.sqlite");

// Ensure the database folder exists
if (!fs.existsSync(dbFolderPath)) {
	fs.mkdirSync(dbFolderPath, { recursive: true });
}

// Initialize database connection
const database = new sqlite3.Database(dbFilePath, (err) => {
	if (err) {
		console.error("Error opening database:", err.message);
	} else {
		console.log("Connected to SQLite database:", dbFilePath);
	}
});

// Ensure the table exists
database.run(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY,
        purchase_date TEXT,
        item_name TEXT,
        item_description TEXT,
        item_price REAL DEFAULT 0,
        num_purchased REAL DEFAULT 0,
        total REAL DEFAULT 0,
        frequency TEXT,
        date_created TEXT DEFAULT CURRENT_TIMESTAMP
    ) STRICT
`);

// Fetch all expenses
export const getExpenses = () => {
  return new Promise((resolve, reject) => {
    database.all('SELECT * FROM expenses ORDER BY purchase_date DESC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Remove an expense
export const removeExpense = (id) => {
  return new Promise((resolve, reject) => {
    database.run(`DELETE FROM expenses WHERE id=?`, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('success');
      }
    });
  });
};

// Add an expense item
export const addExpense = (expenseData) => {
    let frequency;
    if (expenseData.freq === "other") {
        frequency = expenseData.freqOther;
    } else {
        frequency = expenseData.freq;
    }
    return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO expenses (
          purchase_date, 
          item_name, 
          item_description, 
          item_price, 
          num_purchased, 
          total,
          frequency
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    database.run(
      query,
      [
        expenseData.purchaseDate,
        expenseData.itemName,
        expenseData.itemDesc,
        expenseData.price,
        expenseData.numPurchased,
        expenseData.total,
        frequency,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(`Expense added with ID: ${this.lastID}`);
        }
      }
    );
  });
};