"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import "./SpecialMenu.css";

// Menu.jsx - React component for displaying restaurant food menu with pagination and category filters

const Menu = () => {
  // STATE VARIABLES

  // Stores all menu items fetched from backend
  const [menuItems, setMenuItems] = useState([]);

  // Loading indicator for API requests
  const [loading, setLoading] = useState(true);

  // Stores any fetch-related error
  const [error, setError] = useState(null);

  // For paginated API - next & previous page links
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Tracks current page number for UI and smooth scrolling
  const [currentPage, setCurrentPage] = useState(1);

  // Active category selected for filtering
  const [activeCategory, setActiveCategory] = useState("All");

  // All unique categories fetched from food_type field
  const [categories, setCategories] = useState([]);

  // BACKEND FETCH LOGIC FOR MENU ITEMS
  const fetchMenu = (url = "http://127.0.0.1:8000/listFood/") => {
    setLoading(true); // Show spinner while fetching

    axios
      .get(url)
      .then((response) => {
        // `results` bhitra data huncha pagination vako case ma, otherwise direct data
        const data = response.data.results || response.data;
        setMenuItems(data);

        // Unique categories extract garne from each item's food_type
        const uniqueCategories = [
          ...new Set(
            data.map((item) => item.food_type?.food_type || "Uncategorized")
          ),
        ];

        // 'All' category by default add gareko for reset option
        setCategories(["All", ...uniqueCategories]);

        // Pagination links for next/prev
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);

        setLoading(false); // Done fetching
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu. Please try again later.");
        setLoading(false);
      });
  };

  // INITIAL FETCH on component mount
  useEffect(() => {
    fetchMenu(); // Suru ma data load garxa
  }, []);

  // NEXT PAGE CLICK HANDLER
  const handleNextPage = () => {
    if (nextPage) {
      fetchMenu(nextPage); // Next API call
      setCurrentPage((prev) => prev + 1); // Page number update
      window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
    }
  };

  // PREVIOUS PAGE CLICK HANDLER
  const handlePrevPage = () => {
    if (prevPage) {
      fetchMenu(prevPage);
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // CATEGORY FILTERING
  const filterByCategory = (category) => {
    setActiveCategory(category); // UI ma highlight garna
  };

  // FILTER LOGIC
  // Yo part ma selected category anusar item display garincha
  const filteredItems =
    activeCategory === "All"
      ? menuItems // All selected vaye sabai item dekhauxa
      : menuItems.filter(
          (item) => item.food_type?.food_type === activeCategory
        );

  // LIMIT DISPLAYED ITEMS TO 12 PER PAGE (3 rows of 4)
  // Pagination backend bata aako cha, but manually control garna parne vaye, yo use hunchha
  const limitItemsPerPage = (items, limit = 12) => {
    return items.slice(0, limit); // First 12 matra return garxa
  };

  return (
    <div className="menu-section">
      <div className="menu-header">
        <h2 className="menu-title">Our Special Menu</h2>
        <p className="menu-subtitle">
          Discover the authentic flavors of Himalayan cuisine
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => filterByCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading meals...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">!</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={() => fetchMenu()}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="menu-grid">
            {filteredItems.length > 0 ? (
              limitItemsPerPage(filteredItems).map((food) => (
                <Link
                  to={`/food/${food.food_slug}`}
                  key={food.food_slug}
                  className="menu-card-link"
                >
                  <div className="menu-card">
                    <div className="menu-image-container">
                      <img
                        src={`${food.food_img_url}`}
                        alt={food.food_name}
                        className="menu-image"
                        loading="lazy"
                      />

                      {food.food_type?.food_type && (
                        <span className="menu-badge">
                          {food.food_type.food_type}
                        </span>
                      )}
                    </div>
                    <div className="menu-info">
                      <div className="menu-header-row">
                        <h3 className="menu-name">{food.food_name}</h3>
                        <span className="menu-price">
                          NRP {food.food_price}
                        </span>
                      </div>
                      <p className="menu-description">
                        {food.food_content.length > 100
                          ? `${food.food_content.substring(0, 100)}...`
                          : food.food_content}
                      </p>
                      <div className="menu-meta">
                        {food.taste?.taste_type && (
                          <span className="menu-taste">
                            <Star size={14} />
                            {food.taste.taste_type}
                          </span>
                        )}
                        <span className="menu-view">View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-items-container">
                <p className="no-items">
                  No menu items available in this category.
                </p>
                {activeCategory !== "All" && (
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveCategory("All")}
                  >
                    View All Menu Items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={!prevPage}
              className="pagination-btn"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
            <span className="current-page">Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={!nextPage}
              className="pagination-btn"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
