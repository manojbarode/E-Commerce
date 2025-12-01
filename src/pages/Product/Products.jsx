import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Product() {
  const [products, setProducts] = useState([]);

  // 🔥 AuthContext se login value le rahe hain
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ShowProduct();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // ---------- Login Check Functions ----------
  const handleAddToCart = () => {
    if (!login) {
      toast.warning("Please login first to add items to cart!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    toast.success("Added to cart!", { position: "top-center" });
  };

  const handleBuyNow = () => {
    if (!login) {
      toast.error("Login required before making a purchase!", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    toast.success("Proceeding to checkout...");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold text-center">Featured Products</h2>
      <div className="row justify-content-center g-3">

        {products.map((product) => (
          <div
            key={product.id}
            className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-stretch"
          >
            <div className="card h-100 shadow-sm product-card w-100">

              <Link to={`/product/${product.id}`} className="position-relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="card-img-top product-img-full rounded-2"
                />
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                  New
                </span>
              </Link>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="d-flex gap-1 mt-2 px-2">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="thumbnail"
                      className="thumbnail-img rounded"
                      onClick={(e) =>
                        (e.target
                          .closest(".card")
                          .querySelector(".product-img-full").src = img)
                      }
                    />
                  ))}
                </div>
              )}

              <div className="card-body d-flex flex-column p-3">
                <h5 className="card-title text-truncate">{product.title}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <p className="fw-bold mt-auto price">₹ {product.price}</p>

                {/* --- Button Login Check --- */}
                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button
                  className="btn btn-warning w-100"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
