import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

  // Chart Data
  const [mData, setMData] = useState("");
  const [yData, setYData] = useState("");
  const [aData, setAData] = useState("");
  
  // Set options for Charts
  const monthOptions = {responsive: true,maintainAspectRatio: false, scales: {
    x: {title: {display: true,text: "Day of Month",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#333333"},},
    y: {title: {display: true,text: "Spending",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#555555"},},}}
  const yearOptions = {responsive: true, maintainAspectRatio: false, scales: {
    x: {title: {display: true,text: "Month",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#333333"},},
    y: {title: {display: true,text: "Spending",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#555555"},},}}
  const allTimeOptions = {responsive: true, maintainAspectRatio: false, scales: {
    x: {title: {display: true,text: "Year",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#333333"},},
    y: {title: {display: true,text: "Spending",color: "#ffffffcc",},ticks: {color: "#ffffffcc"},grid: {color: "#555555"},},}}

  // Calculate metrics for dashboard tiles
  useEffect(() => {
    let isMounted = true;
  
    const getMetrics = async (expenses) => {
      if (!isMounted) return;
      
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

      let thisMonthDays = {};
      let thisYearMonths = {};
      let allTimeYears = {};

  
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

        if (pMonth === m && pYear === y) {
          thisMonthTotal += e.total;
          thisMonthExpenses.push(e);
          thisMonthDays[pDate.getDate()] = (thisMonthDays[pDate.getDate()] || 0) + e.total;
        }
        if ((pMonth === (m-1) && (pYear === y)) || ((pMonth === 12 && m === 1) && (pYear === (y-1)))) {
          lastMonthTotal += e.total;
        }
        if (pYear === y) {
          thisYearTotal += e.total;
          thisYearExpenses.push(e);
          thisYearMonths[monthReadable] = (thisYearMonths[monthReadable] || 0) + e.total;
        }

        allTimeTotal += e.total;
        allTimeExpenses.push(e);
        allTimeYears[pYear] = (allTimeYears[pYear] || 0) + e.total;
  
        monthlyTotals[monthReadable] = (monthlyTotals[monthReadable] || 0) + e.total;
        yearlyTotals[pYear] = (yearlyTotals[pYear] || 0) + e.total;
      }

      thisMonthExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
      thisYearExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
      allTimeExpenses.sort((a,b)=>(a.total<b.total)?1:((a.total>b.total)?-1:0));
  
      if (isMounted) {
        setMetrics({ thisYearTotal, thisYearExpenses, yearlyTotals, monthlyTotals, thisMonthTotal, thisMonthExpenses, lastMonthTotal, allTimeTotal, allTimeExpenses });
        setMData(thisMonthDays);
        setYData(thisYearMonths);
        setAData(allTimeYears);
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

  // Month Line Chart
  const monthData = {
    labels: Object.keys(mData),
    datasets: [{
        label: '$',
        data: Object.values(mData),
        borderColor: '#fdad7377',
        backgroundColor: '#fdad7377',
        }],
  };
  // Year Line Chart
  const yearData = {
      labels: Object.keys(yData),
      datasets: [{
			label: '$',
			data: Object.values(mData),
			borderColor: '#fdad7377',
			backgroundColor: '#fdad7377',
			}],
  };
  // All Time Line Chart
  const allTimeData = {
      labels: Object.keys(aData),
      datasets: [{
			label: '$',
			data: Object.values(aData),
			borderColor: '#fdad7377',
			backgroundColor: '#fdad7377',
			}],
  };

  if (expenses === null || mData === "" || yData === "" || aData === "") {
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
          <li className="metric-info metric-total">${metrics.thisMonthTotal.toLocaleString()}</li>
          </div>
        </ul>
        <ul className="metric-item metric-large">
          <li className="metric-title">Last Month vs This Month</li>
          <div className="metric-info-container">
            <li className="metric-info"><span style={{color: "white"}}>Last Month: </span>${metrics.lastMonthTotal.toLocaleString()}</li>
            <li className="metric-info"><span style={{color: "white"}}>This Month: </span>${metrics.thisMonthTotal.toLocaleString()}</li>
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
            <td className="metric-info">${e.total.toLocaleString()}</td>
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
          <li className="metric-info metric-total">${metrics.thisYearTotal.toLocaleString()}</li>
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
            <td className="metric-info">${total.toLocaleString()}</td>
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
            <td className="metric-info">${e.total.toLocaleString()}</td>
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

        <div className="dashboard-divider">All Time Expenses</div>
        <div className="dashboard-container">
        <ul className="metric-item metric-small">
          <li className="metric-title">All Time</li>
          <div className="metric-info-container">
          <li className="metric-info metric-total">${metrics.allTimeTotal.toLocaleString()}</li>
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
            <td className="metric-info">${total.toLocaleString()}</td>
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
            <td className="metric-info">${e.total.toLocaleString()}</td>
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