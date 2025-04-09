import "./Header.css"
import React from "react";

import { images } from "../../constants";

const Header = () => (
  <section className="header-section" id="home">
    <div className="header-content">
      <div className="header-text">
        <div className="subtitle">
          <div className="subtitle-line"></div>
          <p>Chase the new flavour</p>
        </div>
        <h1 className="header-title">Taste the authentic nepali cuisine</h1>
        <p className="header-description">
          Among the best chefs in the town, serving you something beyond the flavours.
        </p>
        <button type="button" className="gold-button">
          Our Menu
        </button>
      </div>
      <div className="header-image">
        <div className="image-container">
          <img src={images.welcome} alt="Delicious Nepali dish" />
          <div className="image-accent"></div>
        </div>
      </div>
    </div>
  </section>
)

export default Header
