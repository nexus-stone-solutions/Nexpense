import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ShowExp() {
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
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.item_name}</strong>: {expense.item_amount}
            </li>
          ))}
        </ul>
      ) : (
        <><p>Let's get some expenses in here!</p><br/><Link to="/add-exp"><p className="link">Add an expense</p></Link></>
      )}
    </div>
  );
}