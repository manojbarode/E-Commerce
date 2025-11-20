import React from "react";

export default function Home() {
  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div>
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" style={{height: '500px'}}>
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
          </div>
          
          <div className="carousel-inner rounded-4" style={{height: '500px'}}>
            <div className="carousel-item active h-100">
              <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
                <img
                  src="firstimg.jpg"
                  className="d-block img-fluid carousel-img"
                  alt="Product 1"
                />
              </div>
            </div>

            <div className="carousel-item" style={{height: '500px'}}>
              <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
                <img
                  src="secondimg.jpg"
                  className="d-block img-fluid carousel-img"
                  alt="Product 2"
                />
              </div>
            </div>

            <div className="carousel-item h-100">
              <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
                <img
                  src="thirdimg.webp"
                  className="d-block img-fluid carousel-img"
                  alt="Product 3"
                />
              </div>
            </div>

            <div className="carousel-item h-100">
              <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
                <img
                  src="fourthimg.png"
                  className="d-block img-fluid carousel-img"
                  alt="Product 4"
                />
              </div>
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
      
      <style>{`
        .carousel-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }
        
        .carousel-item > div {
          height: 100%;
        }
        
        /* Mobile screens - maintain consistent size */
        @media (max-width: 768px) {
          #carouselExample {
            height: 300px !important;
          }
          
          .carousel-inner {
            height: 300px !important;
          }
          
          .carousel-item {
            height: 300px !important;
          }
          
          .carousel-img {
            height: 300px;
          }
        }
        
        /* Very small mobile screens */
        @media (max-width: 576px) {
          #carouselExample {
            height: 250px !important;
          }
          
          .carousel-inner {
            height: 250px !important;
          }
          
          .carousel-item {
            height: 250px !important;
          }
          
          .carousel-img {
            height: 250px;
          }
        }
      `}</style>
    </>
  );
}