import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="restaurant-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="logo-img">
                <Link to="/">
                  <img
                    src={logo}
                    alt="Himalayan Asian Dining & Bar"
                    width={60}
                    height={60}
                  />
                </Link>
              </div>
              <div className="logo-text">
                <h2>Himalayan Asian</h2>
                <p>DINING & BAR</p>
              </div>
            </div>

            <div className="footer-info-box">
              <p>
                We are located at 123 Gourmet Street, Foodville.
                <br />
                Contact us at 9806561880 or email us at info.utsab10@gmail.com.
                <br />
                We are available 10:00 AM - 11:00 PM (Closed Wednesday).
              </p>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-nav">
              <div className="nav-column">
                <h3>Quick Access</h3>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about-us">About Us</a>
                  </li>
                  <li>
                    <a href="/menu">Menu</a>
                  </li>
                  <li>
                    <a href="/catering">Catering</a>
                  </li>
                </ul>
              </div>
              <div className="nav-column">
                <h3>About</h3>
                <ul>
                  <li>
                    <a href="/our-story">Our Story</a>
                  </li>
                  <li>
                    <a href="/our-history">Our History</a>
                  </li>
                </ul>
              </div>
              <div className="nav-column">
                <h3>Services</h3>
                <ul>
                  <li>
                    <a href="/reservations">Reservations</a>
                  </li>
                  <li>
                    <a href="/catering">Catering</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>
              &copy; {new Date().getFullYear()} Himalayan Asian Dining and Bar.
              All rights reserved.
            </p>
          </div>
          <div className="social-links">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter />
            </a>
          </div>
          <div className="legal-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
