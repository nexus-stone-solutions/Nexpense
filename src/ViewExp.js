import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ViewExp() {
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await window.api.getExpenses(); // Fetch expenses
        setExpenses(expenses); // Set the expenses state
      } catch (err) {
        setExpenses([])
        setError(err.message || "An unknown error occurred.");
        setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      }
    };

    fetchExpenses();
  }, []);

  if (expenses === null) {
    return <div id="container"><p>Loading...</p></div>
  }

  return (
    <div id="container">
      {error && <p className="error-text">{error}</p>}
      <h1>Expenses</h1>
      {expenses.length > 0 ? (
        <>
        <div id="export-container">
        <div id="export-menu">
        <span>Export</span>
          <div id="export-drop">
            <ul id="export-list">
              <li>Current Month</li>
              <li>Last Month</li>
              <li>Current Year</li>
              <li>Last Year</li>
              <li>All Time</li>
            </ul>
          </div>
        </div>
        </div>
        <div id="expenses-container">
        <table style={{ whiteSpace: "nowrap"}} id="expenses-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Purchase Date</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>#</th>
                    <th>Total</th>
                    <th>Frequency</th>
                    <th>Date Added</th>
                </tr>
            </thead>
            <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.purchase_date}</td>
                  <td>{expense.item_name}</td>
                  <td>{expense.item_description}</td>
                  <td><span>$ </span>{expense.item_price}</td>
                  <td>{expense.num_purchased}</td>
                  <td><span>$ </span>{expense.total}</td>
                  <td>{expense.frequency}</td>
                  <td>{expense.date_created}Z</td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </>
      ) : (
        <><p>Let's get some expenses in here!</p><br/><Link to="/add-exp"><p className="link">Add an expense</p></Link></>
      )}
    </div>
  );
}