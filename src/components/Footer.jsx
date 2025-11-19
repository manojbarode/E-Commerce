export default function Footer() {
  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            
            {/* Logo & About */}
            <div className="col-12 col-sm-6 col-md-3">
              <h2 className="h4 fw-bold mb-3">E-Shop</h2>
              <p className="text-white-50">
                Best online shopping platform for all your needs.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-12 col-sm-6 col-md-3">
              <h3 className="h5 fw-semibold mb-3">Quick Links</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Home</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Shop</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Cart</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Contact</a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="col-12 col-sm-6 col-md-3">
              <h3 className="h5 fw-semibold mb-3">Categories</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Electronics</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Fashion</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Home & Kitchen</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Beauty</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Kidz</a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-white-50 text-decoration-none hover-link">Sports</a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-12 col-sm-6 col-md-3">
              <h3 className="h5 fw-semibold mb-3">Address</h3>
              <div className="d-flex gap-3">
                <p className="text-white-50 text-decoration-none hover-link items-center gap-2">
                 Near Shagun Tower, Vijay Nagar, Indore, Madhya Pradesh 452010 +918889174066</p>
              </div>
            </div>
          </div>

          <hr className="border-secondary my-4" />

          <p className="text-center text-white-50 mb-0">
            © 2025 E-Shop. All Rights Reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .hover-link:hover {
          color: white !important;
          transition: color 0.2s;
        }
        
        .hover-icon:hover {
          color: white !important;
          transition: color 0.2s;
        }
      `}</style>
    </>
  );
}