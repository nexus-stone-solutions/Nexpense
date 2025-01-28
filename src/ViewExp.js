import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import download from "./logos/download.png";

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

  const exportCurrentMonth = async () => {
    await window.api.export("currentMonth");
  }
  const exportLastMonth = async () => {
    await window.api.export("lastMonth");
  }
  const exportCurrentYear = async () => {
    await window.api.export("currentYear");
  }
  const exportLastYear = async () => {
    await window.api.export("lastYear");
  }
  const exportAllTime = async () => {
    await window.api.export("allTime");
  }

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
        <div id="export-title-container">
        <span>Export</span><img src={download} alt=""/>
        </div>
          <div id="export-drop">
            <ul id="export-list">
              <li onClick={exportCurrentMonth}>Current Month</li>
              <li onClick={exportLastMonth}>Last Month</li>
              <li onClick={exportCurrentYear}>Current Year</li>
              <li onClick={exportLastYear}>Last Year</li>
              <li onClick={exportAllTime}>All Time</li>
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