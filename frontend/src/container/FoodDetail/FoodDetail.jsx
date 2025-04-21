"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import { images } from "../../constants";

const FoodDetail = ({ onClose }) => {
  const { food_slug } = useParams(); // URL bata slug extract garincha (e.g., /food/momo)

  // STATE VARIABLES
  const [food, setFood] = useState(null); // Store fetched food data
  const [loading, setLoading] = useState(true); // Loading spinner display control
  const [error, setError] = useState(null); // Error message display
  const [quantity, setQuantity] = useState(1); // Cart ma kati quantity add garne
  const [addedToCart, setAddedToCart] = useState(false); // Track if item was added

  // FETCH SPECIFIC FOOD ITEM DETAILS FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call using slug (e.g., /food/momo/)
        const response = await axios.get(
          `http://127.0.0.1:8000/food/${food_slug}/`
        );
        setFood(response.data); // Success: set food detail
        setLoading(false); // Stop spinner
      } catch (err) {
        setError("Failed to load food details"); // Error handling
        setLoading(false);
      }
    };

    fetchData(); // Component mount huda call huncha
  }, [food_slug]);

  // ADD ITEM TO CART FUNCTION
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token"); // Logged-in user ko token

    try {
      setAddedToCart(false); // New request aunu agadi status reset garincha

      // API call to add food item to cart
      const response = await axios.post(
        "http://127.0.0.1:8000/cart/",
        {
          food_item_id: food.id, // ID passed from fetched food detail
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `JWT ${token}`, // Protected endpoint
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item added to cart:", response.data);
      setAddedToCart(true); // UI lai success message dekhauna

      // 3 second pachi confirmation message hide garincha
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error); // Debug help
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading delicious details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="food-detail-page">
      <div className="food-image-container">
        <div className="food-image-section">
          <img
            src={food.food_img_url || images.defaultFoodImage}
            alt={food.food_name}
          />
          {food.food_type?.food_type && (
            <span className="food-badge">{food.food_type.food_type}</span>
          )}
        </div>
      </div>

      <div className="food-details">
        <h1 className="food-title">{food.food_name}</h1>

        {/* <div className="food-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(4.5) ? "star filled" : "star"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-value">4.5</span>
          <span className="rating-count">(120 reviews)</span>
        </div> */}

        <p className="food-description">{food.food_content}</p>

        <div className="food-meta">
          <div className="food-meta-item">
            <span className="meta-icon type-icon"></span>
            <div>
              <span className="meta-label">Type</span>
              <span className="meta-value">
                {food.food_type?.food_type || "Traditional"}
              </span>
            </div>
          </div>

          <div className="food-meta-item">
            <span className="meta-icon taste-icon"></span>
            <div>
              <span className="meta-label">Taste</span>
              <span className="meta-value">
                {food.taste?.taste_type || "Savory"}
              </span>
            </div>
          </div>
        </div>

        <div className="food-price-section">
          <p className="food-price">NPR {food.food_price}</p>
          <div className="quantity-selector">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="food-actions">
          <button
            className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {addedToCart ? (
              <>
                <span className="check-icon">✓</span> Added to Cart
              </>
            ) : (
              <>
                <span className="cart-icon"></span> Add to Cart
              </>
            )}
          </button>

          <button className="favorite-btn" aria-label="Add to favorites">
            <span className="heart-icon">♥</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
