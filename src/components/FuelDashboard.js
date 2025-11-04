import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Papa from "papaparse";
import "./FuelDashboard.css";

const COLORS = ["rgba(79, 70, 229, 1)", "rgba(6, 182, 212, 1)", "rgba(245, 158, 11, 1)", "rgba(147, 51, 234, 1)", "#10b981"];

const FuelDashboard = () => {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    Papa.parse("/Cleaned_FleetFuel.csv", {
      download: true,
      header: true,
      complete: (results) => setData(results.data),
    });
  }, []);

  const fleet = data.map((d) => ({
    ...d,
    Distance: parseFloat(d.Distance),
    Litres: parseFloat(d.Litres),
    MPG: parseFloat(d.MPG),
    Cost: parseFloat(d.Cost),
  }));

  const top10 = [...fleet].sort((a, b) => b.Litres - a.Litres).slice(0, 10);
  const avgMPG = (fleet.reduce((sum, v) => sum + (v.MPG || 0), 0) / fleet.length).toFixed(2);
  const totalLitres = fleet.reduce((sum, v) => sum + (v.Litres || 0), 0).toFixed(2);
  const totalCost = fleet.reduce((sum, v) => sum + (v.Cost || 0), 0).toFixed(2);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`dashboard ${theme}`}>
      {/* 🌗 Theme Toggle */}
      <div className="toggle-container">
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">
          {theme === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </span>
      </div>

      <h1>🚛 Fleet Fuel Efficiency & Cost Dashboard</h1>
      <p>Visual insights for reducing fuel consumption and operational cost</p>

      {/* Cards Section */}
      <div className="cards">
        <div className="card">
          <h3>Total Fuel Used</h3>
          <p>{totalLitres} Litres</p>
        </div>
        <div className="card">
          <h3>Average Efficiency</h3>
          <p>{avgMPG} MPG</p>
        </div>
        <div className="card">
          <h3>Total Fuel Cost</h3>
          <p>£{totalCost}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3>Top 10 Vehicles by Fuel Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Registration" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Litres" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="chart-card">
          <h3>Distance vs Fuel Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fleet}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Distance" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Litres" stroke="rgba(234, 208, 37, 1)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>Fuel Cost Distribution (Top 5 Vehicles)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={top10.slice(0, 5)}
                dataKey="Cost"
                nameKey="Registration"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {top10.slice(0, 5).map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== INSIGHTS SECTION AS CARD ===== */}
      <div className="insight-card">
        <h2>💡 Key Recommendations</h2>
        <div className="insight-list">
          <div className="insight-item">1️⃣ Optimize routes for high-fuel routes.</div>
          <div className="insight-item">2️⃣ Replace or maintain vehicles older than 8 years.</div>
          <div className="insight-item">3️⃣ Conduct driver training for efficient driving.</div>
          <div className="insight-item">4️⃣ Monitor load balancing across vehicles.</div>
          <div className="insight-item">5️⃣ Switch to hybrid or low-consumption models.</div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer>
        © {new Date().getFullYear()} Fuel Efficiency Dashboard
        <div className="creators">
          Created by <strong>Moksh Shah</strong> & <strong>Aryan Gamit</strong>
        </div>
      </footer>
    </div>
  );
};

export default FuelDashboard;
