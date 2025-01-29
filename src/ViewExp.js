import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import download from "./logos/download.png";
import ex from "./logos/ex.png";

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
        setTimeout(() => setError(""), 5000);
      }
    };

    fetchExpenses();
  }, []);

  const exportExpenses = async () => {
    try {
      const data = []
      const headers = Object.keys(expenses[0]);
      data.push(headers.join(','));
      for (let e of expenses) {
        data.push(Object.values(e).join(','))
      }
      const csvData = data.join('\n')
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `expenses_${new Date().toLocaleDateString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric"}).replace(", ","_")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      setError(err.message || "An error occurred.")
      setTimeout(() => setError(""), 5000);
    }
  }

  const deleteExpense = async (id) => {
    try {
      await window.api.removeExpense(id);
      window.location.reload();
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
    }
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
        <div id="export-title-container">
        <span onClick={() => exportExpenses()}>Export</span><img src={download} alt=""/>
        </div>
        <div id="expenses-container">
        <table style={{ whiteSpace: "nowrap"}} id="expenses-table">
            <thead>
                <tr>
                    <th>Purchase Date</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>#</th>
                    <th>Total</th>
                    <th>Frequency</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                  <td>{expense.purchase_date}</td>
                  <td>{expense.item_name}</td>
                  <td>{expense.item_description}</td>
                  <td><span>$ </span>{expense.item_price}</td>
                  <td>{expense.num_purchased}</td>
                  <td><span>$ </span>{expense.total}</td>
                  <td>{expense.frequency}</td>
                  <td onClick={() => deleteExpense(expense.id)}><img className="del-expense-img" src={ex} alt=" X "></img></td>
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