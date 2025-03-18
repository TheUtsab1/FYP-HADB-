import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const FoodDetail = ({ onClose }) => {
  const { food_slug } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/food/${food_slug}/`
        );
        setFood(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load food details");
        setLoading(false);
      }
    };

    fetchData();
  }, [food_slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Image Section */}
        <div className="modal-header">
          <img
            src={food.food_img_url || "/placeholder.svg"}
            alt={food.food_name}
            className="food-image"
          />
        </div>

        {/* Food Details */}
        <div className="modal-body">
          <h2 className="food-title">{food.food_name}</h2>
          <p className="food-desc">{food.food_content}</p>

          <div className="food-meta">
            <p>
              <strong>Type:</strong> {food.food_type?.food_type || "Unknown"}
            </p>
            <p>
              <strong>Taste:</strong> {food.taste?.taste_type || "Unknown"}
            </p>
            <p>
              <strong>Price:</strong> NPR {food.food_price}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          {/* Add to Cart */}
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
