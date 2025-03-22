"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/cart/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.patch(
        "http://127.0.0.1:8000/cart/update/",
        { id, quantity: newQuantity },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/cart/${id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/specialMenu">
            <button className="btn-primary">Browse Menu</button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.food_item.food_price * item.quantity,
    0
  );
  const deliveryFee = 3.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Order</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img
                  src={item.food_item.food_img_url || "/placeholder.svg"}
                  alt={item.food_item.food_name}
                />
              </div>

              <div className="item-details">
                <h3>{item.food_item.food_name}</h3>
                <p className="item-price">
                  NPR {item.food_item.food_price.toFixed(2)}
                </p>
              </div>

              <div className="item-actions">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="item-total">
                NPR {(item.food_item.food_price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="special-instructions">
            <h3>Special Instructions</h3>
            <textarea
              placeholder="Add notes about your order (allergies, spice level preferences, etc.)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>NPR {subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>NPR {deliveryFee.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>NPR {total.toFixed(2)}</span>
          </div>

          <button className="btn-checkout">Proceed to Checkout</button>

          <Link to="/menu" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
