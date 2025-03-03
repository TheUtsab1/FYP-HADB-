import { useEffect, useState } from "react";
import axios from "axios";
import "./SpecialMenu.css";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/listFood/")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging
        setMenuItems(response.data.results || response.data); // Adjust if needed
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="menu-section">
      <h2 className="menu-title">Our Special Menu</h2>
      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((food) => (
            <div key={food.food_slug} className="menu-card">
              <img
                src={food.food_img_url}
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
          ))
        ) : (
          <p className="no-items">No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
