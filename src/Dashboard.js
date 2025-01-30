import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { monthData, monthOptions, yearData, yearOptions, allTimeData, allTimeOptions } from "./Charts.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);

export default function Dashboard() {
  const [expenses, setExpenses] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
  
    const getMetrics = async (expenses) => {
      if (!isMounted) return;  // Prevents setting state on unmounted component
      
      const months = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"};
      let monthlyTotals = {};
      let thisMonthTotal = 0;
      let thisMonthExpenses = [];
      let lastMonthTotal = 0;

      let yearlyTotals = {};
      let thisYearTotal = 0;
      let thisYearExpenses = [];

      let allTimeTotal = 0;
      let allTimeExpenses = [];
  
      const date = new Date();
      const m = date.getMonth() + 1;
      const y = date.getFullYear();
  
      for (let e of expenses) {
        const pDate = new Date(e.purchase_date+"T12:00:00");
        const monthReadable = months[pDate.getMonth()];
        let pMonth;
        if (pDate.getMonth() === 12) {
          pMonth = 1;
        } else {
          pMonth = pDate.getMonth() + 1;
        }
        const pYear = pDate.getFullYear();

        if (pMonth === m) {
          thisMonthTotal += e.total;
          thisMonthExpenses.push(e);
        }
        if (pMonth === (m-1) || (pMonth === 12 && m === 1)) {
          lastMonthTotal += e.total;
        }
        if (pYear === y) {
          thisYearTotal += e.total;
          thisYearExpenses.push(e);
        }

        allTimeTotal += e.total;
        allTimeExpenses.push(e);
  
        monthlyTotals[monthReadable] = (monthlyTotals[monthReadable] || 0) + e.total;
        yearlyTotals[pYear] = (yearlyTotals[pYear] || 0) + e.total;
      }

      thisMonthExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
      thisYearExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
      allTimeExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
  
      if (isMounted) {
        setMetrics({ thisYearTotal, thisYearExpenses, yearlyTotals, monthlyTotals, thisMonthTotal, thisMonthExpenses, lastMonthTotal, allTimeTotal, allTimeExpenses });
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
      <h1>Dashboard</h1>
      {expenses.length > 0 ? (
        <>
        <div className="dashboard-divider">Monthly Expenses</div>
        <div className="dashboard-container">
        <ul className="metric-item metric-small">
          <li className="metric-title">This Month</li>
          <div className="metric-info-container">
          <li className="metric-info">${metrics.thisMonthTotal}</li>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Last Month vs This Month</li>
          <div className="metric-info-container">
            <li className="metric-info"><span style={{color: "white"}}>Last Month: </span>${metrics.lastMonthTotal.toFixed(2)}</li>
            <li className="metric-info"><span style={{color: "white"}}>This Month: </span>${metrics.thisMonthTotal.toFixed(2)}</li>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Top Expenses, This Month</li>
          <div className="metric-info-container">
          <table className="dash-table">
          <tbody>
          {metrics.thisMonthExpenses.slice(0,5).map((e) => (
            <tr key={e.id}>
            <td className="metric-info"><span style={{color: "white"}}>{e.item_name}</span></td>
            <td className="metric-info">${e.total.toFixed(2)}</td>
            </tr>
          ))}
          </tbody>
          </table>
          </div>
        </ul>
        </div>

        <div className="dashboard-container">
        <ul className="metric-item metric-full">
          <li className="metric-title">Spending This Month, By Day</li>
          <div className="metric-graph">
          <Line options={monthOptions} data={monthData} />
          </div>
        </ul>
        </div>

        <div className="dashboard-divider">Yearly Expenses</div>
        <div className="dashboard-container">
        <ul className="metric-item metric-small">
          <li className="metric-title">This Year</li>
          <div className="metric-info-container">
          <li className="metric-info">${metrics.thisYearTotal}</li>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Totals By Month, Last 12 Months</li>
          <div className="metric-info-container">
          <table className="dash-table">
          <tbody>
          {Object.entries(metrics.monthlyTotals).slice(0,13).map(([month, total]) => (
            <tr key={month}>
            <td className="metric-info"><span style={{color: "white"}}>{month}</span></td>
            <td className="metric-info">${total.toFixed(2)}</td>
            </tr>
          ))}
          </tbody>
          </table>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Top Expenses, This Year</li>
          <div className="metric-info-container">
          <table className="dash-table">
          <tbody>
          {metrics.thisYearExpenses.slice(0,10).map((e) => (
            <tr key={e.id}>
            <td className="metric-info"><span style={{color: "white"}}>{e.item_name}</span></td>
            <td className="metric-info">${e.total.toFixed(2)}</td>
            </tr>
          ))}
            </tbody>
          </table>
          </div>
        </ul>
        </div>

        <div className="dashboard-container">
        <ul className="metric-item metric-full">
          <li className="metric-title">Spending This Year, By Month</li>
          <div className="metric-graph">
          <Line options={yearOptions} data={yearData} />
          </div>
        </ul>
        </div>

        <div className="dashboard-divider">All Time</div>
        <div className="dashboard-container">
        <ul className="metric-item metric-small">
          <li className="metric-title">All Time</li>
          <div className="metric-info-container">
          <li className="metric-info">${metrics.allTimeTotal}</li>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Totals By Year</li>
          <div className="metric-info-container">
          <table className="dash-table">
          <tbody>
          {Object.entries(metrics.yearlyTotals).reverse().map(([year, total]) => (
            <tr key={year}>
            <td className="metric-info"><span style={{color: "white"}}>{year}</span></td>
            <td className="metric-info">${total.toFixed(2)}</td>
            </tr>
          ))}
          </tbody>
          </table>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Top Expenses, All Time</li>
          <div className="metric-info-container">
          <table className="dash-table">
          <tbody>
          {metrics.allTimeExpenses.slice(0,10).map((e) => (
            <tr key={e.id}>
            <td className="metric-info"><span style={{color: "white"}}>{e.item_name}</span></td>
            <td className="metric-info">${e.total.toFixed(2)}</td>
            </tr>
          ))}
          </tbody>
          </table>
          </div>
        </ul>
        </div>
        <div className="dashboard-container">
        <ul className="metric-item metric-full">
          <li className="metric-title">All Time Spending, By Year</li>
          <div className="metric-graph">
          <Line options={allTimeOptions} data={allTimeData} />
          </div>
        </ul>
        </div>
        </>
      ) : (
        <><p>Add an expense to see dashboard metrics!</p><br/><Link to="/add-exp"><p className="link">Add an expense</p></Link></>
      )}
    </div>
  );
}