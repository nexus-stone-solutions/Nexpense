import './css/App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Home.js";
import ViewExp from "./ViewExp.js";
import AddExp from "./AddExp.js";
import Header from "./Header.js";
import Dash from "./Dashboard.js";

export default function App() {
  return (
    <HashRouter>
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dash />} />
            <Route path="/view-exp" element={<ViewExp />} />
            <Route path="/add-exp" element={<AddExp />} />
          </Routes>
        </main>
    </HashRouter>
  );
}
