"use client"

import { useEffect, useState, useRef } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { MdOutlineRestaurantMenu } from "react-icons/md"
import images from "../../constants/images"
import "./Navbar.css"
import { Link, useLocation } from "react-router-dom"
import useAuthStore from "../../store/useAuthStore"

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const { isUserAuthenticated, logout } = useAuthStore()
  const profileDropdownRef = useRef(null)
  const location = useLocation()

  // Check token validity on component mount
  useEffect(() => {
    // This ensures the authentication state is always up-to-date
    // You could add token validation logic here as well
    const token = localStorage.getItem("token")
    console.log("Token in storage:", !!token)
    console.log("Auth state:", isUserAuthenticated)
  }, [isUserAuthenticated])

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (toggleMenu && !event.target.closest(".app__navbar-smallscreen")) {
        setToggleMenu(false)
      }

      // Close profile dropdown when clicking outside
      if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }

    // Prevent scrolling when mobile menu is open
    if (toggleMenu) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [toggleMenu, showProfileDropdown])

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo || "/placeholder.svg"} alt="Himalayan Asian Dining & Bar" />
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li className="p__opensans">
          <Link to="/about-us" className={location.pathname === "/about-us" ? "active" : ""}>
            About
          </Link>
        </li>
        <li className="p__opensans">
          <Link to="/specialMenu" className={location.pathname === "/specialMenu" ? "active" : ""}>
            Menu
          </Link>
        </li>
        <li className="p__opensans">
          <Link to="/CateringForm" className={location.pathname === "/CateringForm" ? "active" : ""}>
            Catering
          </Link>
        </li>
        <li className="p__opensans">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
            Cart
          </Link>
        </li>
      </ul>

      <div className="app__navbar-login">
        {isUserAuthenticated ? (
          <div className="profile-dropdown" ref={profileDropdownRef}>
            <button className="p__opensans" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              Profile
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown-content">
                <Link to="/profile" onClick={() => setShowProfileDropdown(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
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
        <GiHamburgerMenu color="#fff" fontSize={27} onClick={() => setToggleMenu(true)} className="hamburger-icon" />

        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
            <ul className="app__navbar-smallscreen-links">
              <li className="p__opensans">
                <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => setToggleMenu(false)}>
                  Home
                </Link>
              </li>
              <li className="p__opensans">
                <Link
                  to="/about-us"
                  className={location.pathname === "/about-us" ? "active" : ""}
                  onClick={() => setToggleMenu(false)}
                >
                  About
                </Link>
              </li>
              <li className="p__opensans">
                <Link
                  to="/specialMenu"
                  className={location.pathname === "/specialMenu" ? "active" : ""}
                  onClick={() => setToggleMenu(false)}
                >
                  Menu
                </Link>
              </li>
              <li className="p__opensans">
                <Link
                  to="/CateringForm"
                  className={location.pathname === "/CateringForm" ? "active" : ""}
                  onClick={() => setToggleMenu(false)}
                >
                  Catering
                </Link>
              </li>
              <li className="p__opensans">
                <Link
                  to="/cart"
                  className={location.pathname === "/cart" ? "active" : ""}
                  onClick={() => setToggleMenu(false)}
                >
                  Cart
                </Link>
              </li>
              <div className="mobile-auth-buttons">
                {isUserAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className={`p__opensans mobile-auth-btn ${location.pathname === "/profile" ? "active" : ""}`}
                      onClick={() => setToggleMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setToggleMenu(false)
                      }}
                      className="p__opensans mobile-auth-btn"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`p__opensans mobile-auth-btn ${location.pathname === "/login" ? "active" : ""}`}
                    onClick={() => setToggleMenu(false)}
                  >
                    Login/Register
                  </Link>
                )}
                <Link
                  to="/table-booking"
                  className={`p__opensans mobile-book-btn ${location.pathname === "/table-booking" ? "active" : ""}`}
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
  )
}

export default Navbar
