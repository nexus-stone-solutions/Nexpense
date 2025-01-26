import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    const getMetrics = async (expenses) => {
      if (!isMounted) return;  // Prevents setting state on unmounted component
      
      const months = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"};
      let totalSpent = 0;
      let monthlyTotals = {};
      let thisMonthTotal = 0;
  
      const date = new Date();
      const m = date.getMonth() + 1;
  
      for (let e of expenses) {
        totalSpent += e.total;
        const pDate = new Date(e.purchase_date);
        const monthReadable = months[pDate.getMonth()];
        const pMonth = pDate.getMonth() + 1;
  
        if (pMonth === m) {
          thisMonthTotal += e.total;
        }
  
        monthlyTotals[monthReadable] = (monthlyTotals[monthReadable] || 0) + e.total;
      }
  
      if (isMounted) {
        setMetrics({ totalSpent, monthlyTotals, thisMonthTotal });
      }
    };
  
    const fetchExpenses = async () => {
      try {
        const expenses = await window.api.getExpenses();
        if (!isMounted) return;
        setExpenses(expenses);
        getMetrics(expenses);
      } catch (err) {
        if (!isMounted) return;
        setExpenses([]);
        setError(err.message || "An unknown error occurred.");
        setTimeout(() => setError(""), 5000);
      }
    };
  
    fetchExpenses();
  
    return () => { isMounted = false };  // Cleanup function
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
        <div className="dashboard-container">
        <ul className="metric-item">
          <li className="metric-title">Total Spent</li>
          <li className="metric-info">${metrics.totalSpent}</li>
        </ul>
        <ul className="metric-item">
          <li className="metric-title">Monthly Totals</li>
          {Object.entries(metrics.monthlyTotals).map(([month, total]) => (
            <li key={month} className="metric-info">{month}: ${total.toFixed(2)}</li>
          ))}
        </ul>
        <ul className="metric-item">
          <li className="metric-title">This Month</li>
          <li className="metric-info">${metrics.thisMonthTotal}</li>
        </ul>
        </div>
        </>
      ) : (
        <><p>Add an expense to see dashboard metrics!</p><br/><Link to="/add-exp"><p className="link">Add an expense</p></Link></>
      )}
    </div>
  );
}