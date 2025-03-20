import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching cart with token:", token); // Check if the token exists
        const response = await axios.get("http://127.0.0.1:8000/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Cart items fetched:", response.data); // Log the response structure
        setCartItems(response.data); // Assuming response.data is an array of cart items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
        setMessage("Failed to load cart.");
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/cart/${itemId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setMessage("Item removed successfully.");
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Failed to remove item.");
    }
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {message && <p className="cart-message">{message}</p>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img
                src={item.food_item.food_img_url}
                alt={item.food_item.food_name}
              />
              <div>
                <h3>{item.food_item.food_name}</h3>
                <p>Price: NPR {item.food_item.food_price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button onClick={() => handleRemoveFromCart(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
