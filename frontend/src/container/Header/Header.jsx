import React from "react";

import { images } from "../../constants";
import "./Header.css";
import { SubHeading } from "../../components";

const Header = () => (
  <div className="app__header app__wrapper section__padding" id="home">
    <div className="app__wrapper_info">
      <SubHeading title="Chase the new flavour" />
      <h1 className="app__header-h1">Taste the authentic nepali cusine</h1>
      <p className="p__opensans" style={{margin: '2rem 0'}}>Among the best chefs in the town, serving you something beyond the flavours.</p>
      <button type="button" className="custom__button">Our Menu</button>
    </div>
    <div className="app__wrapper_img">
      <img src={images.welcome} alt="header img" />
    </div>
  </div>
);

export default Header;
