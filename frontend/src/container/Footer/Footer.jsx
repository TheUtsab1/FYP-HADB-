import React from "react";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

// import { FooterOverlay } from "../../components";
import { images } from "../../constants";
import "./Footer.css";

const Footer = () => (
  <div className="app__footer section__padding">
    {/* <FooterOverlay /> */}

    <div className="app__footer-links">
      <div className="app__footer-links_contact">
        <h1 className="app__footer-headtext">Contact Us</h1>
        <p className="p__opensans">Ibaraki Ken Kanakubo</p>
        <p className="p__opensans">9806561880</p>
        <p className="p__opensans">9817114887</p>
      </div>
      <div className="app__footer-links_logo">
        <img src={images.logo} alt="footer_logo" />
        <p className="p__opensans">
          "The best way to find yourself is to lose yourself in the service of
          others."
        </p>
        <img
          src={images.spoon}
          alt="spoon"
          className="spoon__img"
          style={{ marginTop: 15 }}
        />
        <div className="app__footer-links_icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
        </div>
      </div>
      <div className="app_footer-links_work">
        <h1 className="app__footer-headtext">Working Hours</h1>
        <p className="p__opensans">Monday - Friday</p>
        <p className="p__opensans">08:00 am - 12:00 pm</p>
        <p className="p__opensans">Saturday - Sunday</p>
        <p className="p__opensans">07:00 am - 11:00 pm</p>
      </div>
    </div>
    <div className="footer__copyright">
      <p className="p__opensans">
        2024 Himalayan Asian Dining and Bar. All rights reserved.
      </p>
    </div>
  </div>
);

export default Footer;
