import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md"; 
import images from "../../constants/images";
import "./Navbar.css";
import { Link } from "react-router-dom";
// import Popup from "../routes/Popup";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  // Check login status from localStorage or a similar mechanism
  React.useEffect(() => {
    const userLoggedIn = localStorage.getItem("loggedIn");
    console.log("User logged in status:", userLoggedIn); // Debug log
    if (userLoggedIn === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");  // Mark as logged out
    setLoggedIn(false);
    console.log("User logged out."); // Debug log
  };

  console.log("LoggedIn state:", loggedIn); // Debug log

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
          <Link to="/about">About</Link>
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
        {loggedIn ? (
          <button onClick={handleLogout} className="p__opensans">
            Logout
          </button>
        ) : (
          <Link to="/login" className="p__opensans">
            Login/Register
          </Link>
        )}
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
