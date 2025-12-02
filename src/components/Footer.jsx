export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row g-4">

          <div className="col-12 col-md-3">
            <h2 className="h4 fw-bold">E-Shop</h2>
            <p className="text-white-50">
              Best online shopping platform for all your needs.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <h5 className="fw-semibold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a className="text-white-50 text-decoration-none hover-link" href="#">Home</a></li>
              <li><a className="text-white-50 text-decoration-none hover-link" href="#">Shop</a></li>
              <li><a className="text-white-50 text-decoration-none hover-link" href="#">Cart</a></li>
              <li><a className="text-white-50 text-decoration-none hover-link" href="#">Contact</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h5 className="fw-semibold">Categories</h5>
            <ul className="list-unstyled">
              <li><span className="text-white-50">Electronics</span></li>
              <li><span className="text-white-50">Fashion</span></li>
              <li><span className="text-white-50">Home & Kitchen</span></li>
              <li><span className="text-white-50">Beauty</span></li>
              <li><span className="text-white-50">Kids</span></li>
              <li><span className="text-white-50">Sports</span></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h5 className="fw-semibold">Address</h5>
            <p className="text-white-50">
              Near Shagun Tower, Vijay Nagar, Indore, MP 452010 <br />
              +91 8889174066
            </p>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        <p className="text-center text-white-50 mb-0">
          © 2025 E-Shop. All Rights Reserved.
        </p>
      </div>

      <style>{`
        .hover-link:hover { color: #fff !important; }
      `}</style>
    </footer>
  );
}
