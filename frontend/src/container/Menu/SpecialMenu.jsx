import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import axios from "axios";
import "./SpecialMenu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMenu = (url = "http://127.0.0.1:8000/listFood/") => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        console.log("API Response:", response.data);
        setMenuItems(response.data.results || response.data);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleNextPage = () => {
    if (nextPage) {
      fetchMenu(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchMenu(prevPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="menu-section">
      <h2 className="menu-title">Our Special Menu</h2>
      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((food) => (
            <Link to={`/food/${food.food_slug}`} key={food.food_slug} className="menu-card-link">
              {/* Wrapped entire card with Link */}
              <div className="menu-card">
                <img
                  src={
                    food.food_img_url.startsWith("http")
                      ? food.food_img_url
                      : `http://127.0.0.1:8000${food.food_img_url}`
                  }
                  alt={food.food_name}
                  className="menu-image"
                />

                <div className="menu-info">
                  <h3 className="menu-name">{food.food_name}</h3>
                  <p className="menu-description">{food.food_content}</p>
                  <p className="menu-price">Price: ${food.food_price}</p>
                  <p className="menu-category">
                    Category: {food.food_type?.food_type}
                  </p>
                  <p className="menu-taste">Taste: {food.taste?.taste_type}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-items">No menu items available.</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={!prevPage}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="current-page">Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={!nextPage}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Menu;
