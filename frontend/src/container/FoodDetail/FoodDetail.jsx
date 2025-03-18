import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import {images} from '../../constants';

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
<div className="food-detail-page">
  {/* Left Side - Image Section */}
  <div className="food-image-section">
    <img src={food.food_img_url} alt={food.food_name} />
  </div>

  {/* Right Side - Details Section */}
  <div className="food-details">
    <h1 className="food-title">{food.food_name}</h1>
    <p className="food-description">{food.food_content}</p>

    <div className="food-meta">
      <div className="food-meta-item">
        <strong>Type:</strong> {food.food_type?.food_type || "Unknown"}
      </div>
      <div className="food-meta-item">
        <strong>Taste:</strong> {food.taste?.taste_type || "Unknown"}
      </div>
    </div>

    <p className="food-price">NPR {food.food_price}</p>

    <div className="quantity-selector">
      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
    </div>

    <button className="add-to-cart-btn">Add to Cart</button>
    {/* <button className="buy-now-btn">Buy Now</button> */}
  </div>
</div>
  );
  //   </div>
  // );
};

export default FoodDetail;
