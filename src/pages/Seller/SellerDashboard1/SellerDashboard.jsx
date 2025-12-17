import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerSidebar from "./SellerSidebar";
import SellerStatsCard from "./SellerStatsCard";
import { Line, Pie } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title,Tooltip,Legend,
  ArcElement,} from "chart.js";

import "../Css/SellerDashboard.css";
import { getCategoryStats, getMonthlySales, getSellerStats } from "../../../api/SellApi";

ChartJS.register( CategoryScale, LinearScale, PointElement,LineElement,Title,Tooltip,Legend,ArcElement);

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sellerData = useSelector((state) => state.seller);
  const sellerUid = sellerData?.sellerUid;
  const sellerName = sellerData?.sellerName;

  const [stats, setStats] = useState({totalProducts: 0,totalOrders: 0,totalRevenue: 0,});

  const [sales, setSales] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
  if (!sellerUid) {
    navigate("/seller-auth");
    return;
  }

  const loadDashboard = async () => {
    try {
      const statsRes = await getSellerStats(sellerUid);
      const salesRes = await getMonthlySales(sellerUid);
      const categoryRes = await getCategoryStats(sellerUid);

      setStats(statsRes);
      setSales(salesRes);
      setCategoryStats(categoryRes);

    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  loadDashboard();
}, [sellerUid, navigate]);


 const filteredCategories = categoryStats.filter(c =>
  (c.category || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredSales = sales.filter(s =>
  (s.month || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
);



  const salesData = {
  labels: filteredSales.map((s) => (s.month || "").toString()),
  datasets: [
    {
      label: "Monthly Sales",
      data: filteredSales.map((s) => s.amount || s.totalAmount || 0),
      borderColor: "#6a11cb",
      backgroundColor: "rgba(106,17,203,0.15)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const pieData = {
  labels: filteredCategories.map((c) => (c.category || c.name || "").toString()),
  datasets: [
    {
      data: filteredCategories.map((c) => c.count || c.total || 0),
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
    <div className="dashboard-container">
      <SellerSidebar
        isOpen={sidebarOpen}
        closeDrawer={() => setSidebarOpen(false)}
      />

      {/* MOBILE SIDEBAR BUTTON */}
      <button
        className="sidebar-toggle-btn d-lg-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`} />
      </button>

      {/* MAIN */}
      <main className="dashboard-main container-fluid">
        {/* HEADER */}
        <header className="dashboard-header row align-items-center">
          <div className="col-12 col-md-6">
            <h2 className="dashboard-title">Welcome Back {sellerName}</h2>
            <p className="dashboard-subtitle">Here’s your store performance</p>
          </div>

          <div className="col-12 col-md-6 text-md-end mt-2 mt-md-0 d-flex flex-wrap gap-2 justify-content-md-end">
            <button className="btn-action" onClick={() => navigate("/sellerpage/product-upload")}>
              <i className="bi bi-plus-circle me-2" /> Add Product
            </button>

            <button className="btn-action" onClick={() => navigate("/SellerDetailsForm")}>
              <i className="bi bi-building-add me-2" /> Start New Business
            </button>
          </div>
        </header>

        {/* SEARCH */}
        <div className="row mt-3 mb-4">
          <div className="col-12 col-sm-8 col-md-4">
            <input type="text" className="form-control search-bar" placeholder="Search category or month..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <SellerStatsCard title="Total Products" value={stats.totalProducts} icon="bi-box-seam"
              color="primary"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <SellerStatsCard title="Total Orders" value={stats.totalOrders} icon="bi-cart-check" 
              color="warning"
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-4">
            <SellerStatsCard title="Revenue" value={`₹${stats.totalRevenue}`} icon="bi-currency-rupee"
              color="success"
            />
          </div>
        </div>

        {/* CHARTS */}
        <div className="row g-3 mt-1 mb-4">
          <div className="col-12 col-lg-6">
            <div className="dashboard-card">
              <h5 className="chart-title">
                <i className="bi bi-graph-up me-2" /> Monthly Sales
              </h5>
              <div className="chart-wrapper">
                <Line data={salesData} />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="dashboard-card">
              <h5 className="chart-title">
                <i className="bi bi-pie-chart me-2" /> Category Distribution
              </h5>
              <div className="chart-wrapper">
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
