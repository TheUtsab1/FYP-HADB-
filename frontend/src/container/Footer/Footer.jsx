import React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  // const [email, setEmail] = useState("");
  // const [setSubscribed] = useState(false);

  // const handleSubscribe = (e) => {
  //   e.preventDefault();
  //   if (email) {
  //     setSubscribed(true);
  //     setEmail("");
  //     setTimeout(() => setSubscribed(false), 3000);
  //   }
  // };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section about">
          <div className="logo-container">
            <img src={logo} width={100} height={100} alt="Logo" />
            <h2>Himalayan Asian Dining & Bar</h2>
          </div>
          {/* <p>
            Delicious cuisine and exceptional service since 2022. Our restaurant
            management system helps us deliver the best dining experience.
          </p> */}
          <div className="social-links">
            <a target="_blank" href="https://www.facebook.com/" className="social-link" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a target="_blank" href="https://www.facebook.com/" className="social-link" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <MapPin size={16} />
              <span>123 Gourmet Street, Foodville</span>
            </li>
            <li>
              <Phone size={16} />
              <span>9806561880</span>
            </li>
            <li>
              <Mail size={16} />
              <span>info.utsab10@gmail.com</span>
            </li>
            <li>
              <Clock size={16} />
              <span>We're opened all along the week 10:00 AM - 11:00 PM except Wednesday</span>
            </li>
          </ul>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/menuItem">Menu</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/catering">Catering</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Himalayan Asian Dining and Bar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
