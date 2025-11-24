export default function Home() {
  return (
    <div className="mt-4">
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="firstimg.jpg" className="d-block w-100 hero-img" alt="slide1" />
          </div>
          <div className="carousel-item">
            <img src="secondimg.jpg" className="d-block w-100 hero-img" alt="slide2" />
          </div>
          <div className="carousel-item">
            <img src="thirdimg.webp" className="d-block w-100 hero-img" alt="slide3" />
          </div>
          <div className="carousel-item">
            <img src="fourthimg.png" className="d-block w-100 hero-img" alt="slide4" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
      <style>{`
        .hero-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          object-position: center;
        }
        
        @media (max-width: 1200px) {
          .hero-img { 
            height: 400px; 
          }
        }
        
        @media (max-width: 992px) {
          .hero-img { 
            height: 350px; 
          }
        }
        
        @media (max-width: 768px) {
          .hero-img { 
            height: 280px; 
          }
        }
        
        @media (max-width: 576px) {
          .hero-img { 
            height: 220px; 
          }
        }
        
        .carousel-inner {
          border-radius: 0;
        }
        
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 20px;
        }
        
        .carousel-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin: 0 5px;
        }
      `}</style>
    </div>
  );
}