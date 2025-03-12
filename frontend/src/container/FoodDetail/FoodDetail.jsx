import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FoodDetail = () => {
  const { food_slug } = useParams(); // Get slug from URL
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/food/${food_slug}/`) // Adjust API URL
      .then((response) => {
        setFood(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food details:", error);
        setLoading(false);
      });
  }, [food_slug]);

  if (loading) return <p>Loading...</p>;
  if (!food) return <p>Food item not found!</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{food.food_name}</h1>
      <img src={food.food_img_url} alt={food.food_name} width="300" />
      <p><strong>Price:</strong> ${food.food_price}</p>
      <p><strong>Type:</strong> {food.food_type.food_type}</p>
      <p><strong>Taste:</strong> {food.taste.taste_type}</p>
      <p><strong>Description:</strong> {food.food_content}</p>
    </div>
  );
};

export default FoodDetail;
