import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaGift,
  FaPercentage,
  FaCoins,
  FaTag,
  FaChevronRight,
} from "react-icons/fa";

const offersData = [
  {
    id: 1,
    title: "Flat 50% OFF",
    description: "On your first order",
    details:
      "Get flat 50% discount on your first purchase. Valid for new users only.",
    icon: <FaPercentage />,
    color: "danger",
  },
  {
    id: 2,
    title: "₹200 Cashback",
    description: "On prepaid orders",
    details:
      "Pay online and get ₹200 cashback directly in your wallet.",
    icon: <FaCoins />,
    color: "success",
  },
  {
    id: 3,
    title: "Festival Offer",
    description: "Extra discounts on festive items",
    details:
      "Enjoy festive discounts across multiple categories.",
    icon: <FaTag />,
    color: "warning",
  },
];

const rewardsData = [
  {
    id: 1,
    title: "Reward Coins",
    description: "Earn coins on every purchase",
    details:
      "Earn reward coins and redeem them on future orders.",
    icon: <FaCoins />,
  },
  {
    id: 2,
    title: "Gift Vouchers",
    description: "Redeem vouchers using reward points",
    details:
      "Convert your reward points into exciting gift vouchers.",
    icon: <FaGift />,
  },
];

const Offer_Rewards = () => {
  const [previewItem, setPreviewItem] = useState(null);
  const [fullItem, setFullItem] = useState(null);

  return (
    <div className="container py-4">

      {/* ===== LIST ===== */}
      {!fullItem && (
        <>
          <h4 className="fw-bold mb-3">🔥 Offers for You</h4>

          <div className="row">
            {offersData.map((offer) => (
              <div className="col-md-4 mb-3" key={offer.id}>
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => setPreviewItem(offer)}
                >
                  <div className="card-body d-flex align-items-center">
                    <div
                      className={`btn btn-${offer.color} rounded-circle me-3`}
                      style={{ width: 50, height: 50 }}
                    >
                      {offer.icon}
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{offer.title}</h6>
                      <p className="text-muted small mb-0">
                        {offer.description}
                      </p>
                    </div>

                    <FaChevronRight />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="fw-bold mt-4 mb-3">🎁 Your Rewards</h4>

          <div className="row">
            {rewardsData.map((reward) => (
              <div className="col-md-6 mb-3" key={reward.id}>
                <div
                  className="card shadow-sm border-0 h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => setPreviewItem(reward)}
                >
                  <div className="card-body d-flex align-items-center">
                    <div
                      className="btn btn-outline-primary rounded-circle me-3"
                      style={{ width: 50, height: 50 }}
                    >
                      {reward.icon}
                    </div>

                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{reward.title}</h6>
                      <p className="text-muted small mb-0">
                        {reward.description}
                      </p>
                    </div>

                    <FaChevronRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== PREVIEW ===== */}
      {previewItem && !fullItem && (
        <div className="card shadow-lg border-0 rounded-4 p-4 mt-4">
          <h4 className="fw-bold">{previewItem.title}</h4>
          <p>{previewItem.details}</p>

          <div className="d-flex gap-3">
            <button
              className="btn btn-danger"
              onClick={() => {
                setFullItem(previewItem);
                setPreviewItem(null);
              }}
            >
              View Full Details
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => setPreviewItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== FULL DETAILS ===== */}
      {fullItem && (
        <div className="card shadow-lg border-0 rounded-4 p-5 mt-4">
          <h2 className="fw-bold">{fullItem.title}</h2>
          <p>{fullItem.details}</p>

          <button
            className="btn btn-outline-secondary mt-3"
            onClick={() => setFullItem(null)}
          >
            Back to Offers
          </button>
        </div>
      )}
    </div>
  );
};

export default Offer_Rewards;
