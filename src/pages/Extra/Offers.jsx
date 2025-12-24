import React, { useState, useEffect } from "react";
import { Clock, Zap, Tag, TrendingUp } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

/* ===============================
   FESTIVALS CONFIG (REAL DATES)
================================ */
const FESTIVALS = [
  { name: "New Year", date: "2025-01-01" },
  { name: "Holi", date: "2025-03-14" },
  { name: "Raksha Bandhan", date: "2025-08-19" },
  { name: "Navratri", date: "2025-10-02" },
  { name: "Diwali", date: "2025-11-01" },
  { name: "Christmas", date: "2025-12-25" },
];

const SHOW_BEFORE_DAYS = 5;
const SHOW_AFTER_DAYS = 10;

export default function OffersPage() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [activeFestival, setActiveFestival] = useState(null);

  const megaOffers = [
    {
      id: 1,
      category: "ELECTRONICS",
      title: "Smartphones Bonanza",
      subtitle: "Top Brands at Unbeatable Prices",
      discount: "Up to 40% OFF",
      extraOffer: "+ Extra ₹2000 Off on Exchange",
      bgGradient: "linear-gradient(to bottom right, #9333ea, #2563eb)",
      icon: "📱",
    },
    {
      id: 2,
      category: "FASHION",
      title: "Style Statement Sale",
      subtitle: "Trendy Clothes & Accessories",
      discount: "Flat 50-80% OFF",
      extraOffer: "+ Buy 2 Get 1 Free",
      bgGradient: "linear-gradient(to bottom right, #db2777, #e11d48)",
      icon: "👗",
    },
    {
      id: 3,
      category: "HOME & KITCHEN",
      title: "Home Makeover Fest",
      subtitle: "Furniture & Appliances",
      discount: "Up to 60% OFF",
      extraOffer: "+ No Cost EMI Available",
      bgGradient: "linear-gradient(to bottom right, #ea580c, #dc2626)",
      icon: "🏠",
    },
    {
      id: 4,
      category: "BEAUTY",
      title: "Glow Up Special",
      subtitle: "Skincare & Makeup Essentials",
      discount: "Min 30% OFF",
      extraOffer: "+ Free Samples on Orders Above ₹499",
      bgGradient: "linear-gradient(to bottom right, #16a34a, #0d9488)",
      icon: "💄",
    },
    {
      id: 5,
      category: "ELECTRONICS",
      title: "Laptop & Tablet Deals",
      subtitle: "Work From Home Essentials",
      discount: "Up to 35% OFF",
      extraOffer: "+ Extended Warranty Free",
      bgGradient: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
      icon: "💻",
    },
    {
      id: 6,
      category: "SPORTS",
      title: "Fitness Fanatic Sale",
      subtitle: "Gym Equipment & Sportswear",
      discount: "Flat 40-70% OFF",
      extraOffer: "+ Free Yoga Mat on ₹1999+",
      bgGradient: "linear-gradient(to bottom right, #ca8a04, #ea580c)",
      icon: "⚽",
    },
  ];

  /* ===============================
     REAL-TIME FESTIVAL TIMER
  ================================ */
  useEffect(() => {
    const checkFestival = () => {
      const now = new Date(); // REAL current system time
      let currentFestival = null;

      FESTIVALS.forEach((festival) => {
        const festDate = new Date(festival.date + "T00:00:00"); // timezone safe

        const startDate = new Date(festDate);
        startDate.setDate(startDate.getDate() - SHOW_BEFORE_DAYS);

        const endDate = new Date(festDate);
        endDate.setDate(endDate.getDate() + SHOW_AFTER_DAYS);

        if (now >= startDate && now <= endDate) {
          currentFestival = { ...festival, endDate };
        }
      });

      if (!currentFestival) {
        setShowTimer(false);
        setActiveFestival(null);
        setTimeLeft(null);
        return;
      }

      const diff = currentFestival.endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setShowTimer(false);
        setActiveFestival(null);
        setTimeLeft(null);
        return;
      }

      setShowTimer(true);
      setActiveFestival(currentFestival);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    checkFestival();                 // run immediately
    const interval = setInterval(checkFestival, 1000); // real-time check

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <h1 className="text-white fw-bold m-0">
            <span style={{ color: "#ffc107" }}>Super</span>Deals
          </h1>

          {showTimer && timeLeft && (
            <div
              style={{
                background: "#dc3545",
                padding: "8px 16px",
                borderRadius: "50px",
                color: "#fff",
                fontWeight: "bold",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Clock size={18} />
              {activeFestival.name} Sale Ends In&nbsp;
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="container py-5 text-center text-white">
        <div
          style={{
            background: "#ffc107",
            color: "#000",
            display: "inline-flex",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "50px",
            fontWeight: "bold",
          }}
        >
          <Zap size={18} /> {activeFestival?.name || "Mega"} Sale
        </div>

        <h2 className="display-4 fw-bold mt-4">Today's Best Deals</h2>
        <p className="text-light fs-5">
          Limited time festival offers – grab them fast ⚡
        </p>
      </div>

      {/* OFFERS */}
      <div className="container pb-5">
        <div className="row g-4">
          {megaOffers.map((offer) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "20px",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: offer.bgGradient,
                    opacity: 0.2,
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div className="d-flex justify-content-between mb-3">
                    <span
                      style={{
                        background: "rgba(255,193,7,0.3)",
                        color: "#ffd700",
                        padding: "4px 12px",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {offer.category}
                    </span>
                    <span style={{ fontSize: "32px" }}>{offer.icon}</span>
                  </div>

                  <h4 className="text-white fw-bold">{offer.title}</h4>
                  <p className="text-light small">{offer.subtitle}</p>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <Tag size={18} className="text-warning" />
                      <strong className="text-white">{offer.discount}</strong>
                    </div>
                    <div className="d-flex gap-2 small text-success mt-1">
                      <TrendingUp size={14} />
                      {offer.extraOffer}
                    </div>
                  </div>

                  <button
                    style={{
                      marginTop: "16px",
                      width: "100%",
                      background:
                        "linear-gradient(to right, #ffc107, #ff9800)",
                      border: "none",
                      padding: "10px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Shop Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          background: "linear-gradient(to right, #9333ea, #db2777)",
          padding: "40px 0",
        }}
      >
        <div className="container text-center text-white">
          <h3 className="fw-bold">Don’t Miss Festival Offers 🎉</h3>
          <p>Subscribe for exclusive deals & notifications</p>
          <div className="d-flex justify-content-center gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="form-control w-50"
            />
            <button className="btn btn-light fw-bold">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
