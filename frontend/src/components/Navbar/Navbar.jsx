"use client";

import React, { useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import images from "../../constants/images";
import "./Navbar.css";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const { isUserAuthenticated, setIsUserAuthenticated } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsUserAuthenticated(false);
    console.log("User logged out.");
  };

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (toggleMenu && !event.target.closest(".app__navbar-smallscreen")) {
        setToggleMenu(false);
      }
    };

    // Prevent scrolling when mobile menu is open
    if (toggleMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [toggleMenu]);

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img
          src={images.logo || "/placeholder.svg"}
          alt="Himalayan Asian Dining & Bar"
        />
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans">
          <Link to="/">Home</Link>
        </li>
        <li className="p__opensans">
          <Link to="/about-us">About</Link>
        </li>
        <li className="p__opensans">
          <Link to="/specialMenu">Menu</Link>
        </li>
        <li className="p__opensans">
          <Link to="/CateringForm">Catering</Link>
        </li>
        <li className="p__opensans">
          <Link to="/cart">Cart</Link>
        </li>
      </ul>

      <div className="app__navbar-login">
        {isUserAuthenticated ? (
          <button onClick={handleLogout} className="p__opensans">
            Logout
          </button>
        ) : (
          <Link to="/login" className="p__opensans">
            Login/Register
          </Link>
        )}
        <div className="app__navbar-login-divider" />
        <Link to="/table-booking" className="p__opensans">
          Book Table
        </Link>
      </div>

      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
          className="hamburger-icon"
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
                <Link to="/" onClick={() => setToggleMenu(false)}>
                  Home
                </Link>
              </li>
              <li className="p__opensans">
                <Link to="/about-us" onClick={() => setToggleMenu(false)}>
                  About
                </Link>
              </li>
              <li className="p__opensans">
                <Link to="/specialMenu" onClick={() => setToggleMenu(false)}>
                  Menu
                </Link>
              </li>
              <li className="p__opensans">
                <Link to="/CateringForm" onClick={() => setToggleMenu(false)}>
                  Catering
                </Link>
              </li>
              <li className="p__opensans">
                <Link to="/cart" onClick={() => setToggleMenu(false)}>
                  Cart
                </Link>
              </li>
              <div className="mobile-auth-buttons">
                {isUserAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setToggleMenu(false);
                    }}
                    className="p__opensans mobile-auth-btn"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="p__opensans mobile-auth-btn"
                    onClick={() => setToggleMenu(false)}
                  >
                    Login/Register
                  </Link>
                )}
                <Link
                  to="/table-booking"
                  className="p__opensans mobile-book-btn"
                  onClick={() => setToggleMenu(false)}
                >
                  Book Table
                </Link>
              </div>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
