import React, { useEffect, useState } from "react";
import add from "./icons/add.png";
import info from "./icons/info.png";

export default function AddExp() {
  const [error, setError] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [price, setPrice] = useState("");
  const [numPurchased, setNumPurchased] = useState(1);
  const [freq, setFreq] = useState("One Time");
  const [freqOther, setFreqOther] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayDate = new Date().toLocaleDateString('en-US').split("/")
    let month;
    const preMonth = new Date().getMonth()+1;
    if (preMonth === 12) {
      month = 0
    } else {
      month = preMonth;
    }
    let postMonth;
    if (month<10) {
      postMonth=`0${month}`
    } else {
      postMonth=month
    }
    const output = `${todayDate[2]}-${postMonth}-${todayDate[1]}`;
    setToday(output);
    setPurchaseDate(output);
  },[])

  const handleSubmit = async (e) => {
    try {
      const total = price*numPurchased;
      const expenseData = {purchaseDate: purchaseDate, itemName: itemName, itemDesc: itemDesc, price: price, numPurchased: numPurchased, total: total, freq: freq, freqOther: freqOther}
      const add = await window.api.addExpense(expenseData);
      if (!add){
        setError(add.message || "An error occurred.");
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Expense added!");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.log(err)
      setError(err.message || "An error occurred.");
      setTimeout(() => setError(""), 5000);
    }
  }

  return (
    <div id="container">
      {error && <p className="error-text">{error}</p>}
      <h1>Add an Expense</h1>
      <div className="home-content">
            <form onSubmit={handleSubmit} className="expense-form">
                <label>Purchase Date</label>
              <div id="date-container">
                <input
                id="purchaseDate"
                type="date"
                value={(purchaseDate&&purchaseDate!==today)?purchaseDate:today}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
                />
                <span className="validity"></span>
              </div>
                <label>Item Name</label>
                <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                />
                <label>Item Description (optional)</label>
                <textarea
                id="itemDesc"
                type="text"
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                />
                <div id="price-container">
                <label htmlFor="price">Price</label><img alt="info" src={info}/>
                <span>Exclude commas and currency symbols. Only use numbers and, optionally, a period '.'</span>
                </div>
                <input
                id="price"
                type="tel"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                pattern="^\d+[\.]{0,1}?[\d+]{0,2}?$"
                />
                <label>Number Purchased</label>
                <input
                id="numPurchased"
                type="tel"
                value={(numPurchased&&numPurchased!=="")?numPurchased:""}
                onChange={(e) => setNumPurchased(e.target.value)}
                required
                min={0}
                pattern="^\d+[\.]{0,1}?[\d+]{0,2}?$"
                />

                {/* Frequency Radio Buttons */}
                <label>Frequency</label>
                <div className="radio-container">
                <div className="radio-div">
                <input
                type="radio"
                id="oneTime"
                name="freq"
                value="One Time"
                onChange={() => setFreq("One Time")}
                checked={(freq&&freq!=="One Time")?false:true}
                />
                <p htmlFor="oneTime">One-Time Purchase</p>
                </div>

                <div className="radio-div">
                <input
                type="radio"
                id="monthly"
                name="freq"
                value="Monthly"
                onChange={() => setFreq("Monthly")}
                />
                <p htmlFor="monthly">Monthly Subscription</p>
                </div>

                <div className="radio-div">
                <input
                type="radio"
                id="yearly"
                name="freq"
                value="Yearly"
                onChange={() => setFreq("Yearly")}
                />
                <p htmlFor="yearly">Yearly Subscription</p>
                </div>

                <div className="radio-div">
                <input
                type="radio"
                id="other"
                name="freq"
                value="other"
                onChange={() => setFreq("other")}
                />
                <p htmlFor="other">Other</p>
                <input
                id="otherText"
                type="text"
                name="freq"
                value={freqOther}
                onChange={(e) => setFreqOther(e.target.value)}
                required={freq==="other"?true:false}
                style={{marginLeft: "20px", width: "200px", height: "10px", textAlign: "left"}}
                />
                </div>
                </div>

                <button type="submit"><p>Add Expense</p> <img id="expense-add-img" alt="+" src={add}></img></button>
            </form>
            </div>
    </div>
  );
}