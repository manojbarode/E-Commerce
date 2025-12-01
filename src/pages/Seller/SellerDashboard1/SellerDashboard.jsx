import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import SellerStatsCard from "./SellerStatsCard";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../Css/SellerDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [sales, setSales] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sellerId = localStorage.getItem("sellerId");

    fetch(`/api/seller/${sellerId}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.log);

    fetch(`/api/seller/${sellerId}/sales`)
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch(console.log);

    fetch(`/api/seller/${sellerId}/category-stats`)
      .then((res) => res.json())
      .then((data) => setCategoryStats(data))
      .catch(console.log);
  }, []);

  // 🔍 Filter Logic
  const filteredCategories = categoryStats.filter((c) =>
    (c.category || c.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSales = sales.filter((s) =>
    s.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔵 Sales Chart Data
  const salesData = {
    labels: filteredSales.map((s) => s.month),
    datasets: [
      {
        label: "Monthly Sales",
        data: filteredSales.map((s) => s.amount),
        borderColor: "#6a11cb",
        backgroundColor: "rgba(106,17,203,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 🟠 Pie Chart Data
  const pieData = {
    labels: filteredCategories.map((c) => c.category || c.name),
    datasets: [
      {
        label: "Products per Category",
        data: filteredCategories.map((c) => c.count || c.total),
        backgroundColor: [
          "#6a11cb",
          "#2575fc",
          "#ff6a00",
          "#ff3cac",
          "#1de9b6",
          "#f9d423",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="dashboard-container">

      <SellerSidebar isOpen={sidebarOpen} closeDrawer={() => setSidebarOpen(false)} />

      <button
        className="sidebar-toggle-btn d-lg-none"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
      </button>

      {/* MAIN */}
      <main className="dashboard-main container-fluid">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Welcome Back 👋</h2>
            <p className="dashboard-subtitle">Here’s your daily store performance</p>
          </div>

          <button
            className="btn add-product-btn"
            onClick={() => navigate("/sellerpage/product-upload")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Product
          </button>
        </header>

        {/* 🔍 Search Bar */}
        <div className="search-bar-container mb-4">
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Search category or month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-lg-4">
            <SellerStatsCard title="Total Products" value={stats.totalProducts} icon="bi-box-seam" color="primary" />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <SellerStatsCard title="Total Orders" value={stats.totalOrders} icon="bi-cart-check" color="warning" />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <SellerStatsCard title="Revenue" value={`₹${stats.totalRevenue}`} icon="bi-currency-rupee" color="success" />
          </div>
        </div>

        {/* Charts */}
        <div className="row g-3">
          {/* LINE CHART */}
          <div className="col-12 col-lg-6">
            <div className="dashboard-card">
              <h5 className="chart-title">
                <i className="bi bi-graph-up me-2"></i>
                Monthly Sales
              </h5>

              <div className="chart-wrapper">
                <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="col-12 col-lg-6">
            <div className="dashboard-card">
              <h5 className="chart-title">
                <i className="bi bi-pie-chart me-2"></i>
                Category Distribution
              </h5>

              <div className="chart-wrapper">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
