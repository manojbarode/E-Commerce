import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
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

  const salesData = {
    labels: sales.map((s) => s.month) || ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Monthly Sales",
        data: sales.map((s) => s.amount) || [1000, 2000, 3000],
        borderColor: "#6a11cb",
        backgroundColor: "rgba(106,17,203,0.2)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: categoryStats.map((c) => c.category) || ["Clothes", "Electronics", "Shoes"],
    datasets: [
      {
        label: "Products per Category",
        data: categoryStats.map((c) => c.count) || [5, 3, 2],
        backgroundColor: ["#6a11cb","#2575fc","#ff6a00","#ff3cac","#1de9b6","#f9d423"],
      },
    ],
  };

  return (
    <div className="seller-dashboard-wrapper d-flex">
      <SellerSidebar />
      <div className="dashboard-content flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="fw-bold mb-2">Welcome, Seller 👋</h2>
          <button
            className="btn btn-gradient text-white mb-2"
            onClick={() => navigate("/SellerPage/product-upload")}
          >
            ➕ Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards d-flex flex-wrap gap-3 mb-4">
          <SellerStatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon="bi-box-seam"
            color="bg-primary"
          />
          <SellerStatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="bi-cart-check"
            color="bg-warning"
          />
          <SellerStatsCard
            title="Revenue"
            value={`₹${stats.totalRevenue}`}
            icon="bi-currency-rupee"
            color="bg-success"
          />
        </div>

        {/* Charts */}
        <div className="row gap-4">
          <div className="col-lg-6 col-12">
            <div className="card shadow-sm p-3 rounded-4 chart-card">
              <h5 className="mb-3 fw-bold">Monthly Sales</h5>
              <Line data={salesData} />
            </div>
          </div>
          <div className="col-lg-6 col-12">
            <div className="card shadow-sm p-3 rounded-4 chart-card">
              <h5 className="mb-3 fw-bold">Products per Category</h5>
              <Pie data={categoryData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
