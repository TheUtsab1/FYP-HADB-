"use client";

import "./about-us.css";
import { images } from "../../constants";
import { Link } from "react-router-dom";

export default function Aboutus() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("http://127.0.0.1:8000/feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok) throw new Error(result.error || "Submission failed");

      alert("Thank you for your feedback!");
      event.target.reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="about-us-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="section-content">
          <div className="welcome-header">
            <h2 className="section-title">
              Welcome to Himalayan Asian Dining and Bar
            </h2>
            <p className="section-description">
              Where tradition meets technology! Our Online Restaurant Management
              System is designed to redefine the dining experience, making it
              effortless for both customers and restaurant administrators.
            </p>
          </div>

          {/* Vision Section */}
          <div className="vision-container">
            <div className="vision-content">
              <h3 className="vision-title">Our Vision</h3>
              <p className="vision-description">
                At Himalayan Asian Dining and Bar, we aim to blend innovation
                with hospitality, ensuring smooth operations, convenient online
                bookings, and an enhanced customer experience. Whether you're
                planning a cozy dinner, a grand celebration, or just a quick
                bite, we bring convenience to your fingertips.
              </p>
              <Link to="/Booking">
                <button className="exp-button">Book a Table</button>
              </Link>
            </div>
            <div className="vision-image-container">
              <img
                src={images.FrontView || "/placeholder.svg"}
                alt="Restaurant interior"
                className="vision-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="section-content">
          <h2 className="section-title centered">Why Us?</h2>

          <div className="features-grid">
            <FeatureCard
              iconName="calendar-check"
              title="Seamless Table Reservations"
              description="Say goodbye to long waiting times! Reserve your favorite table online with real-time booking confirmations."
            />

            <FeatureCard
              iconName="utensils"
              title="Hassle-Free Online Orders"
              description="Browse our diverse menu, place your order, and enjoy a delightful meal at your convenience."
            />

            <FeatureCard
              iconName="chef-hat"
              title="Catering Made Simple"
              description="Need catering for an event? Book online and let us handle the rest, ensuring a stress-free dining experience."
            />

            <FeatureCard
              iconName="server"
              title="Effortless Admin Control"
              description="Our intuitive admin panel allows restaurant managers to handle reservations, orders, and feedback efficiently."
            />

            <FeatureCard
              iconName="message-square"
              title="Customer-Centric Approach"
              description="We value your feedback! Our system enables easy reviews and ratings to help us serve you better."
            />

            <FeatureCard
              iconName="credit-card"
              title="Secure Payments & Notifications"
              description="Enjoy smooth and secure transactions, along with instant notifications on reservations and order updates."
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="section-content centered">
          <h2 className="section-title">Experience the Future of Dining</h2>
          <p className="section-description">
            With a perfect blend of flavor, service, and technology, our
            Restaurant Management System brings you a next-level dining
            experience—right from your screen to your plate!
          </p>

          <div className="button-group">
            <Link to="/specialMenu">
              <button className="exp-button">Order Online</button>
            </Link>
            <Link to="/Booking">
              <button className="exp-button">Book a Table</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback Form Section - Redesigned */}
      <section className="feedback-section">
        <div className="section-content">
          <h2 className="section-title centered">Share Your Feedback</h2>
          <p className="section-description centered">
            We value your opinion! Please take a moment to share your experience
            with us.
          </p>

          <div className="feedback-form-container">
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rating">Your Rating</label>
                  <select id="rating" name="rating" required>
                    <option value="">Select Rating</option>
                    <option value="5">Excellent (5 Stars)</option>
                    <option value="4">Very Good (4 Stars)</option>
                    <option value="3">Good (3 Stars)</option>
                    <option value="2">Fair (2 Stars)</option>
                    <option value="1">Poor (1 Star)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback_type">Feedback Type</label>
                  <select id="feedback_type" name="feedback_type" required>
                    <option value="">Select Type</option>
                    <option value="food">Food Quality</option>
                    <option value="service">Customer Service</option>
                    <option value="ambience">Restaurant Ambience</option>
                    <option value="website">Website Experience</option>
                    <option value="reservation">Reservation Process</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Feedback</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Please share your experience with us..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <button type="submit" className="primary-button">
                  SUBMIT FEEDBACK
                </button>
              </div>

              <div className="helper-text">
                Your feedback helps us improve our services
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ iconName, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <i className={`icon-${iconName}`}></i>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
