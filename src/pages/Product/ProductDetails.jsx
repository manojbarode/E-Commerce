import Carousel from "react-bootstrap/Carousel";
import { Link, useParams, useNavigate } from "react-router-dom";
import {setAmount,setProductUid,setQuantity,setSellerUid,} from "../../Redux/orderSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../api/productApi";
import { addToCartApi } from "../../api/cartApi";
import { toast } from "react-toastify";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { productUid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setLocalQuantity] = useState("1");

  /* ---------- LOAD PRODUCT ---------- */
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const res = await getProductById(productUid);
      setProduct(res);
      setLoading(false);
    };

    if (productUid) loadProduct();
  }, [productUid]);

  /* ---------- SYNC TO REDUX ---------- */
  useEffect(() => {
    if (!product) return;

    dispatch(setProductUid(product.productUid));
    dispatch(setSellerUid(product.sellerUid));
    dispatch(setAmount(product.price));
    dispatch(setQuantity(1));
  }, [product, dispatch]);

  /* ---------- UI STATES ---------- */
  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h5>Product not found</h5>
      </div>
    );
  }

  /* ---------- HANDLERS ---------- */
  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setLocalQuantity(val);
  };

  const handleQuantityBlur = () => {
    let val = parseInt(quantity);
    if (isNaN(val) || val < 1) val = 1;
    if (val > product.stock) val = product.stock;

    setLocalQuantity(String(val));
    dispatch(setQuantity(val));
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
      return;
    }

    try {
      const res = await addToCartApi(product.productUid, Number(quantity));
      toast.success(res.message || "Product added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
      return;
    }

    navigate("/checkout", {
      state: {
        items: [
          {
            productUid: product.productUid,
            name: product.title,
            image: product.imageUrls?.[0] || "/no-image.png",
            quantity: Number(quantity),
            price: product.price,
          },
        ],
        source: "BUY_NOW",
      },
    });
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4">

        <div className="col-md-6 sticky-left">
          <Link to="/" className="btn btn-dark mb-3">
            ← Back to Home
          </Link>

          {product.imageUrls?.length > 0 && (
            <Carousel interval={3000} variant="dark">
              {product.imageUrls.map((img, index) => (
                <Carousel.Item key={index}>
                  <img src={img} alt={`product-${index}`}className="d-block w-100 product-main-img"/>
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {/* ACTION BUTTONS (UNDER IMAGE) */}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-success flex-fill" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button className="btn btn-warning flex-fill" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>

        {/* RIGHT (SCROLLABLE DETAILS) */}
        <div className="col-md-6">
          <div className="details-box shadow">
            <h2 className="fw-bold">{product.title}</h2>
            <h3 className="text-primary mt-2">₹ {product.price}</h3>

            <p className="mt-3">{product.description}</p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            {product.dynamicFields && (
              <>
                <h5 className="mt-4">Specifications</h5>
                <ul>
                  {Object.entries(product.dynamicFields).map(([k, v], i) => (
                    <li key={i}>
                      <strong>{k}:</strong> {v}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-4">
              <label className="form-label">
                <strong>Quantity</strong>
              </label>
              <input type="text" className="form-control w-25" value={quantity} onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
