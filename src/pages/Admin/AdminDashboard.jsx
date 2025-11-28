import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import StatsCard from "./StatsCard";
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
import "./Css/AdminDashboard.css";

// Register chart.js components
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

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State for stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalSellers: 0,
  });

  // State for charts
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch dynamic data from backend
  useEffect(() => {
    // Replace these with real API endpoints
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));

    fetch("/api/admin/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.log(err));

    fetch("/api/admin/category-stats")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  const salesData = {
    labels: sales.map((item) => item.month) || ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Monthly Sales",
        data: sales.map((item) => item.amount) || [1000, 2000, 3000],
        borderColor: "#6a11cb",
        backgroundColor: "rgba(106,17,203,0.2)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: categories.map((c) => c.name) || [
      "Clothes",
      "Electronics",
      "Shoes",
    ],
    datasets: [
      {
        label: "Products per Category",
        data: categories.map((c) => c.count) || [50, 30, 20],
        backgroundColor: [
          "#6a11cb",
          "#2575fc",
          "#ff6a00",
          "#ff3cac",
          "#1de9b6",
          "#f9d423",
        ],
      },
    ],
  };

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar />

      <div className="dashboard-main flex-grow-1">
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Welcome, Admin 👋</h2>
            <button
              className="btn btn-gradient btn-lg text-white"
              onClick={() => navigate("/admin/product-upload")}
            >
              ➕ Add New Product
            </button>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon="bi-box-seam"
              color="bg-gradient-primary"
            />
            <StatsCard
              title="Total Sellers"
              value={stats.totalSellers}
              icon="bi-person-badge"
              color="bg-gradient-success"
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon="bi-cart-check"
              color="bg-gradient-warning"
            />
            <StatsCard
              title="Revenue"
              value={`₹${stats.totalRevenue}`}
              icon="bi-currency-rupee"
              color="bg-gradient-danger"
            />
          </div>

          {/* Charts */}
          <div className="row mb-4">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <div className="card shadow-sm p-3 rounded-4 chart-card">
                <h5 className="mb-3 fw-bold">Monthly Sales</h5>
                <Line data={salesData} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm p-3 rounded-4 chart-card">
                <h5 className="mb-3 fw-bold">Products per Category</h5>
                <Pie data={categoryData} />
              </div>
            </div>
          </div>

          {/* Optional Tables */}
          {/* You can add ProductTable & SellerTable here */}
        </div>
      </div>
    </div>
  );
}
