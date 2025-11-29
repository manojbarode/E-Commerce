import React, { useState } from 'react';
import { Clock, Zap, Tag, TrendingUp } from 'lucide-react';

export default function OffersPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 34, seconds: 22 });

  const megaOffers = [
    {
      id: 1,
      category: 'ELECTRONICS',
      title: 'Smartphones Bonanza',
      subtitle: 'Top Brands at Unbeatable Prices',
      discount: 'Up to 40% OFF',
      extraOffer: '+ Extra ₹2000 Off on Exchange',
      bgGradient: 'linear-gradient(to bottom right, #9333ea, #2563eb)',
      icon: '📱'
    },
    {
      id: 2,
      category: 'FASHION',
      title: 'Style Statement Sale',
      subtitle: 'Trendy Clothes & Accessories',
      discount: 'Flat 50-80% OFF',
      extraOffer: '+ Buy 2 Get 1 Free',
      bgGradient: 'linear-gradient(to bottom right, #db2777, #e11d48)',
      icon: '👗'
    },
    {
      id: 3,
      category: 'HOME & KITCHEN',
      title: 'Home Makeover Fest',
      subtitle: 'Furniture & Appliances',
      discount: 'Up to 60% OFF',
      extraOffer: '+ No Cost EMI Available',
      bgGradient: 'linear-gradient(to bottom right, #ea580c, #dc2626)',
      icon: '🏠'
    },
    {
      id: 4,
      category: 'BEAUTY',
      title: 'Glow Up Special',
      subtitle: 'Skincare & Makeup Essentials',
      discount: 'Min 30% OFF',
      extraOffer: '+ Free Samples on Orders Above ₹499',
      bgGradient: 'linear-gradient(to bottom right, #16a34a, #0d9488)',
      icon: '💄'
    },
    {
      id: 5,
      category: 'ELECTRONICS',
      title: 'Laptop & Tablet Deals',
      subtitle: 'Work From Home Essentials',
      discount: 'Up to 35% OFF',
      extraOffer: '+ Extended Warranty Free',
      bgGradient: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
      icon: '💻'
    },
    {
      id: 6,
      category: 'SPORTS',
      title: 'Fitness Fanatic Sale',
      subtitle: 'Gym Equipment & Sportswear',
      discount: 'Flat 40-70% OFF',
      extraOffer: '+ Free Yoga Mat on ₹1999+',
      bgGradient: 'linear-gradient(to bottom right, #ca8a04, #ea580c)',
      icon: '⚽'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <style>{`
        body {
          background: linear-gradient(to bottom right, #0f172a, #581c87, #0f172a);
          min-height: 100vh;
        }

        .header-section {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .timer-badge {
          background: #dc3545;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: bold;
        }

        .hero-badge {
          background: #ffc107;
          color: black;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: bold;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .offer-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
          height: 100%;
        }

        .offer-card:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .offer-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.2;
          transition: opacity 0.3s;
          z-index: 0;
        }

        .offer-card:hover::before {
          opacity: 0.3;
        }

        .offer-content {
          position: relative;
          z-index: 1;
          padding: 1.5rem;
        }

        .category-badge {
          background: rgba(255, 193, 7, 0.3);
          color: #ffd700;
          border: 1px solid rgba(255, 193, 7, 0.5);
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .discount-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .shop-btn {
          background: linear-gradient(to right, #ffc107, #ff9800);
          color: black;
          font-weight: bold;
          border: none;
          padding: 0.75rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .shop-btn:hover {
          background: linear-gradient(to right, #ffb300, #fb8c00);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 1s;
          z-index: 2;
          pointer-events: none;
        }

        .offer-card:hover .shine-effect {
          left: 100%;
        }

        .footer-cta {
          background: linear-gradient(to right, #9333ea, #db2777);
          padding: 3rem 0;
        }

        .subscribe-input {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }

        .subscribe-input::placeholder {
          color: rgba(255, 255, 255, 0.8);
        }

        .subscribe-input:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
          box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.2);
        }

        .subscribe-btn {
          background: white;
          color: #9333ea;
          font-weight: bold;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
        }

        .subscribe-btn:hover {
          background: #f3f4f6;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)' }}>
        {/* Header */}
        <div className="header-section">
          <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="text-white mb-0 fs-2 fw-bold">
                <span style={{ color: '#ffc107' }}>Super</span>Deals
              </h1>
              <div className="timer-badge d-flex align-items-center gap-2">
                <Clock className="text-white" size={20} />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="container py-5 text-center text-white">
          <div className="hero-badge d-inline-flex align-items-center gap-2 mb-4">
            <Zap size={20} />
            <span>MEGA OFFERS LIVE NOW</span>
          </div>
          <h2 className="display-1 fw-bold mb-4">Today's Best Deals</h2>
          <p className="fs-4 mb-5" style={{ color: '#e5e7eb' }}>
            Limited time offers - Shop now before they expire! ⚡
          </p>
          
          {/* Stats */}
          <div className="row g-3 mx-auto" style={{ maxWidth: '800px' }}>
            <div className="col-4">
              <div className="stat-card">
                <div className="display-4 fw-bold" style={{ color: '#ffc107' }}>1000+</div>
                <div className="small" style={{ color: '#f3f4f6' }}>Products on Sale</div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-card">
                <div className="display-4 fw-bold text-success">80%</div>
                <div className="small" style={{ color: '#f3f4f6' }}>Max Discount</div>
              </div>
            </div>
            <div className="col-4">
              <div className="stat-card">
                <div className="display-4 fw-bold text-info">24hrs</div>
                <div className="small" style={{ color: '#f3f4f6' }}>Flash Sale</div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="container pb-5">
          <div className="row g-4">
            {megaOffers.map((offer) => (
              <div key={offer.id} className="col-lg-4 col-md-6">
                <div className="offer-card">
                  <div 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: offer.bgGradient,
                      opacity: 0.2,
                      zIndex: 0
                    }}
                  />
                  <div className="shine-effect" />
                  <div className="offer-content">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="category-badge">{offer.category}</span>
                      <span style={{ fontSize: '2.5rem' }}>{offer.icon}</span>
                    </div>
                    <h3 className="h4 text-white fw-bold mb-2">{offer.title}</h3>
                    <p className="small mb-3" style={{ color: '#e5e7eb' }}>{offer.subtitle}</p>
                    <div className="discount-box mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Tag className="text-warning" size={20} />
                        <span className="h3 text-white fw-bold mb-0">{offer.discount}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 small" style={{ color: '#4ade80' }}>
                        <TrendingUp size={16} />
                        <span>{offer.extraOffer}</span>
                      </div>
                    </div>
                    <button className="shop-btn">Shop Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="footer-cta">
          <div className="container text-center text-white">
            <h3 className="display-5 fw-bold mb-3">Don't Miss Out on These Amazing Deals!</h3>
            <p className="mb-4" style={{ color: '#f9fafb', fontSize: '1.1rem' }}>Subscribe to get notifications about exclusive offers and new deals</p>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="d-flex gap-2">
                  <input 
                    type="email" 
                    className="form-control subscribe-input flex-grow-1" 
                    placeholder="Enter your email"
                  />
                  <button className="btn subscribe-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}