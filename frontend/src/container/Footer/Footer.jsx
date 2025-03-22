import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="restaurant-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-left">
            <div className="footer-logo">
              <img
                src={logo || "/placeholder.svg"}
                alt="Himalayan Asian Dining & Bar"
              />
              <div className="logo-text">
                <h2>Himalayan Asian</h2>
                <p>DINING & BAR</p>
              </div>
            </div>

            <div className="footer-contact-info">
              <div className="contact-row">
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <p>123 Gourmet Street, Foodville</p>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <p>9806561880</p>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <p>info.utsab10@gmail.com</p>
                </div>
                <div className="contact-item">
                  <Clock className="contact-icon" />
                  <p>10:00 AM - 11:00 PM (Closed Wed)</p>
                </div>
              </div>
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
                    <a href="/specialMenu">Menu</a>
                  </li>
                  <li>
                    <a href="/Catering">Catering</a>
                  </li>
                </ul>
              </div>
              <div className="nav-column">
                <h3>About</h3>
                <ul>
                  <li>
                    <a href="/about">Our Story</a>
                  </li>
                  <li>
                    <a href="/about">Our History</a>
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
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
