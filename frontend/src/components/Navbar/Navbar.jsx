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
  // const [loggedIn, setLoggedIn] = React.useState(!!localStorage.getItem("token"));

  // // Check login status from localStorage
  // React.useEffect(() => {
  //   console.log("Checking login status...");
  //   const token = localStorage.getItem("token");
  //   console.log("Token: ", token);
  //   setLoggedIn(!!token); // If token exists and is not empty, set loggedIn to true
  // }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Properly remove token
    setIsUserAuthenticated(false);
    console.log("User logged out.");
  };
  useEffect(() => {
    console.log(isUserAuthenticated);
  }, [isUserAuthenticated]);
  // Debug log

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="app logo" />
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
        <div />
        <Link to="/table-booking" className="p__opensans">
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
                <Link to="/menuItem">Menu</Link>
              </li>
              <li className="p__opensans">
                <Link to="/catering">Catering</Link>
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
