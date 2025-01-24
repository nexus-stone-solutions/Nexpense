import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div id="header-container">
    <h2 className="geist-mono-font">Nexpense</h2>
      <ul>
      <Link to="/dashboard"><li>Dashboard</li></Link>
      <Link to="/add-exp"><li>Add an Expense</li></Link>
      <Link to="/view-exp"><li>View Expenses</li></Link>
      </ul>
    </div>
  );
}