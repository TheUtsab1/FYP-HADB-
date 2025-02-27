import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md"; 

import images from "../../constants/images";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="app logo" />
      </div>
      <ul className="app__navbar-links">
        <li className="p__opensans">
          <Link to="/home">Home</Link>
        </li>
        <li className="p__opensans">
          <Link to="/about">About</Link>
        </li>
        <li className="p__opensans">
          <Link to="/specialMenu">Menu</Link>
        </li>
        <li className="p__opensans">
          <Link to="/awards">Awards</Link>
        </li>
        <li className="p__opensans">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div className="app__navbar-login">
        <Link to="/login" className="p__opensans">
          Login/Register
        </Link>
        <div />
        <Link to="/book-table" className="p__opensans">
          Book Table
        </Link>
      </div>
      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />

        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen-links">
              <li className="p__opensans">
                <Link to="/">Home</Link>
              </li>
              <li className="p__opensans">
                <Link to="/about">About</Link>
              </li>
              <li className="p__opensans">
                <Link to="/menuItem">Menu</Link>
              </li>
              <li className="p__opensans">
                <Link to="/awards">Awards</Link>
              </li>
              <li className="p__opensans">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div> 
        )} 
      </div>
    </nav>
  );
};

export default Navbar;
