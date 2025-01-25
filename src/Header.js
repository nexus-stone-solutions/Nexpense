import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <div id="header-container">
      <h2 className="geist-mono-font"><Link to="/">Nexpense</Link></h2>
      <ul>
        <Link to="/dashboard"><li className={location.pathname === "/dashboard" ? "nav-active" : ""}>Dashboard</li></Link>
        <Link to="/add-exp"><li className={location.pathname === "/add-exp" ? "nav-active" : ""}>Add an Expense</li></Link>
        <Link to="/view-exp"><li className={location.pathname === "/view-exp" ? "nav-active" : ""}>View Expenses</li></Link>
      </ul>
    </div>
  );
}
