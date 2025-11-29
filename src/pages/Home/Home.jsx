import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import Product from "../Product/Products";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Carousel */}
      <div id="heroCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
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

      {/* Featured Products */}
      <Product />
    </div>
  );
}
