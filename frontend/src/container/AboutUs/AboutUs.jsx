import "./AboutUs.css"
import React from "react"
import { images } from "../../constants"

const AboutUs = () => (
  <section className="about-section" id="about">
    <div className="about-background">
      <div className="about-overlay">
        <img src={images.H} alt="" />
      </div>
    </div>

    <div className="about-container">
      <div className="section-header">
        <h2>Our Story</h2>
        <div className="gold-divider"></div>
      </div>

      <div className="about-content">
        <div className="about-card">
          <div className="card-header">
            <h3>About Us</h3>
            <div className="spoon-divider"></div>
          </div>
          <p className="card-text">
            We're an absolute good in the Indo-Nepal cuisine-themed restaurants. Find us located at Kanakubo Ibaraki
            ken. We serve you from 9 AM to 7 PM. We're open Sunday, Monday, Tuesday, Thursday and Friday.
          </p>
          <button type="button" className="gold-button outline">
            Know More
          </button>
        </div>

        <div className="about-image">
        </div>

        <div className="about-card">
          <div className="card-header">
            <h3>Our History</h3>
            <div className="spoon-divider"></div>
          </div>
          <p className="card-text">
            Find us located at Kanakubo Ibaraki ken. We serve you from 9 AM to 7 PM. We're open Sunday, Monday, Tuesday,
            Thursday and Friday.
          </p>
          <button type="button" className="gold-button outline">
            Know More
          </button>
        </div>
      </div>
    </div>
  </section>
)

export default AboutUs
