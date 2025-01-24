import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.resolve(app.getPath('userData'), 'db.sqlite');
const database = new sqlite3.Database(dbPath);

// Ensure the table exists
database.run(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY NOT NULL,
        purchase_date TEXT NOT NULL,
        item_name TEXT NOT NULL,
        item_description TEXT,
        item_amount INTEGER NOT NULL DEFAULT 0,
        num_purchased INTEGER DEFAULT 0,
        onetime_purchase INTEGER DEFAULT 0,
        recurring_month INTEGER DEFAULT 0,
        recurring_annual INTEGER DEFAULT 0,
        date_created TEXT DEFAULT CURRENT_TIMESTAMP
    ) STRICT
`);

// Fetch all expenses
export const getExpenses = () => {
  return new Promise((resolve, reject) => {
    database.all('SELECT * FROM expenses ORDER BY id', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Remove an expense
export const removeExpense = (item_id) => {
  return new Promise((resolve, reject) => {
    database.run(`DELETE FROM expenses WHERE id=?`, [item_id], function (err) {
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
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO expenses (
          purchase_date, 
          item_name, 
          item_description, 
          item_amount, 
          num_purchased, 
          onetime_purchase, 
          recurring_month, 
          recurring_annual
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    database.run(
      query,
      [
        expenseData.purchase_date,
        expenseData.item_name,
        expenseData.item_description,
        expenseData.item_amount,
        expenseData.num_purchased,
        expenseData.onetime_purchase,
        expenseData.recurring_month,
        expenseData.recurring_annual,
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
