import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import { setAmount, setProductUid, setQuantity, setSellerUid } from "../../Redux/orderSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../api/productApi";
import "./ProductDetails.css";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const productUid = useSelector((state) => state.product.productUid);

  const [product, setProduct] = useState(null);
  const [quantity, setLocalQuantity] = useState("1"); // store as string for smooth typing

  /* ---------- Load Product ---------- */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(productUid);
        setProduct(res);
      } catch (err) {
        console.error("Product load failed", err);
      }
    };

    if (productUid) loadProduct();
  }, [productUid]);

  /* ---------- Prepare Redux Order State ---------- */
  useEffect(() => {
    if (!product) return;

    dispatch(setProductUid(product.productUid));
    dispatch(setSellerUid(product.sellerUid));
    dispatch(setAmount(product.price));
    dispatch(setQuantity(1)); // initial quantity
    setLocalQuantity("1");
  }, [product, dispatch]);

  /* ---------- Quantity Handlers ---------- */
  const handleQuantityChange = (e) => {
    const val = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(val)) {
      setLocalQuantity(val);
    }
  };

  const handleQuantityBlur = () => {
    let val = parseInt(quantity);
    if (isNaN(val) || val < 1) val = 1;
    if (product && val > product.stock) val = product.stock;
    setLocalQuantity(String(val));
    dispatch(setQuantity(val));
  };

  if (!product) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4">

        {/* LEFT */}
        <div className="col-md-6">
          <Link to="/" className="btn btn-dark mb-3">
            ← Back to Home
          </Link>

          {product.imageUrls?.length > 0 && (
            <Carousel interval={3000} variant="dark">
              {product.imageUrls.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={img}
                    alt={`product-${index}`}
                    className="d-block w-100 product-main-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          <div className="d-flex gap-2 mt-3">
            <Link 
              to={`/cart?product=${product.productUid}&qty=${quantity}`} 
              className="btn btn-success flex-fill"
            >
              Add to Cart
            </Link>

            <Link
              to={`/buynow?product=${product.productUid}&qty=${quantity}`}
              className="btn btn-warning flex-fill"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-6">
          <div className="details-box shadow p-4">
            <h2 className="fw-bold">{product.title}</h2>

            <h3 className="text-primary mt-2">₹ {product.price}</h3>

            <p className="mt-3">{product.description}</p>

            <p><strong>Stock:</strong> {product.stock}</p>

            {product.dynamicFields && (
              <>
                <h5 className="mt-4">Specifications</h5>
                <ul>
                  {Object.entries(product.dynamicFields).map(([key, value], idx) => (
                    <li key={idx}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-4">
              <label className="form-label"><strong>Quantity</strong></label>
              <input
                type="text"
                className="form-control w-25"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
