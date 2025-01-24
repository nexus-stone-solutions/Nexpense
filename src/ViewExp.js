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
        <>
        <table style={{ whiteSpace: "nowrap" }} id="expenses-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Occurrence</th>
                    </tr>
                </thead>
                <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                      <td>{expense.item_name}</td>
                      <td>{expense.item_amount}</td>
                      <td>One-Time Purchase</td>
                  </tr>
                ))}
                </tbody>
            </table>
        </>
      ) : (
        <><p>Let's get some expenses in here!</p><br/><Link to="/add-exp"><p className="link">Add an expense</p></Link></>
      )}
    </div>
  );
}