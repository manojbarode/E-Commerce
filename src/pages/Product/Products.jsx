import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { ShowProduct } from "../../api/productApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, setProductUid } from "../../Redux/productSlice";
import { setAmount, setQuantity, setSellerUid } from "../../Redux/orderSlice";
import { addToCartApi } from "../../api/cartApi";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const { isLoggedIn, userUid } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ShowProduct();
        if (!Array.isArray(response)) return setProducts([]);

        const cleaned = response.map((p) => ({
          ...p,
          imageUrls: Array.from(new Set(p.imageUrls || [])),
        }));

        setProducts(cleaned);

        const defaults = {};
        cleaned.forEach((p) => {
          defaults[p.productUid] = p.imageUrls?.[0] || "/no-image.png";
        });
        setSelectedImages(defaults);

      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products");
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
  if (!isLoggedIn) {
  toast.warning("Please login first");
  return;
}

  try {
    const res = await addToCartApi(
      product.productUid,
      1,
      userUid
    );

    if (res.success) {
      toast.success("Product added to cart");
    } else {
      toast.error(res.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error("Add to cart failed:", err);
    toast.error("Something went wrong");
  }
};
  const handleBuyNow = (product) => {
  if (!isLoggedIn) {
  toast.warning("Please login first");
  return;
}
    dispatch(setProductUid(product.productUid));
    console.log("product uid "+product.productUid);
    dispatch(setSellerUid(product.sellerUid));
    dispatch(setAmount(Number(product.price)));
    dispatch(setQuantity(1));
    dispatch(addProduct(product));

    navigate("/buynow");
  };

  const handleWishlist = (productUid) => {
    if (!isLoggedIn) {
        toast.warning("Please login first");
    }
    setWishlist((prev) =>
      prev.includes(productUid) ? prev.filter((id) => id !== productUid) : [...prev, productUid]
    );
  };

  const handleThumbnailClick = (productUid, imgUrl) => {
    setSelectedImages((prev) => ({ ...prev, [productUid]: imgUrl }));
  };

  const imageClick = (product) => {
    dispatch(setProductUid(product.productUid));
    // dispatch(setAmount(Number(product.price)));
    dispatch(addProduct(product));
  };

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h2 className="page-heading">Featured Products</h2>
          <p className="page-subtitle">Explore top deals and best picks</p>
        </div>

        <div className="product-grid">
          {products.length === 0 && (
            <p className="text-center text-muted w-100">No products available right now.</p>
          )}

          {products.map((product) => {
            const productUid = product.productUid;
            const mainImage = selectedImages[productUid] || product.imageUrls?.[0] || "/no-image.png";
            const thumbnails = product.imageUrls?.filter((img) => img !== mainImage) || [];

            return (
              <div key={productUid} className="product-card">
                <button
                  type="button"
                  className={`wishlist-icon ${wishlist.includes(productUid) ? "active" : ""}`}
                  onClick={() => handleWishlist(productUid)}
                >
                  ♥
                </button>

                <Link to={`/productDetails`} className="position-relative d-block mb-2">
                  <img src={mainImage} alt={product.title} className="product-img-full" 
                    onClick={() => imageClick(product)}
                  />
                  <span className="badge new-badge position-absolute top-0 start-0 m-2">New</span>
                </Link>

                {thumbnails.length > 0 && (
                  <div className="thumbnail-row no-scrollbar">
                    {thumbnails.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="thumbnail-img"
                        onClick={() => handleThumbnailClick(productUid, img)}
                      />
                    ))}
                  </div>
                )}

                <div className="card-content">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="price-row">
                    <span className="price">₹ {product.price}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn glass-btn w-100 mb-2" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                  </button>

                  <button className="btn glass-btn-secondary w-100" onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
