"use client";

import { useState, useEffect } from "react";
import { images } from "../../constants";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [loading, setLoading] = useState(false);

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
      console.log(response.data);
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
      console.log(id);
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

  // Payment methods handlers
  const handleKhaltiPayment = (total) => {
    const khaltiConfig = {
      publicKey: "98c492879e8a423fb37558d5a33a6a37",
      productIdentity: "1234567890",
      productName: "Food Order",
      productUrl: "http://localhost:3000/",
      eventHandler: {
        onSuccess: async (payload) => {
          console.log("Payment Successful:", payload);
          setLoading(true);

          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/verify-payment/",
              {
                token: payload.token,
                amount: total * 100, // Converting to paisa
              },
              {
                headers: {
                  Authorization: `JWT ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.data.state?.name === "Completed") {
              handlePaymentComplete("khalti", payload);
            } else {
              alert("Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
          } finally {
            setLoading(false);
            setShowPaymentPopup(false);
          }
        },
        onError: (error) => {
          console.log("Payment Error:", error);
          alert("Payment Failed! Please try again.");
        },
        onClose: () => {
          console.log("Payment Cancelled");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    const khaltiCheckout = new KhaltiCheckout(khaltiConfig);
    khaltiCheckout.show({ amount: total * 100 }); // Converting to paisa
  };

  const handleEsewaPayment = () => {
    // This is a placeholder for eSewa integration
    // In a real implementation, you would integrate with eSewa's API
    alert("eSewa integration would go here. This is a placeholder.");
    handlePaymentComplete("esewa");
    setShowPaymentPopup(false);
  };

  const handleCashPayment = () => {
    handlePaymentComplete("cash");
    setShowPaymentPopup(false);
  };

  const handlePaymentComplete = async (method, data) => {
    // Here you would handle the order creation based on the payment method
    console.log(`Payment completed with ${method}`, data);

    try {
      // Example API call to create an order
      await axios.post(
        "http://127.0.0.1:8000/orders/create/",
        {
          payment_method: method,
          payment_details: data ? JSON.stringify(data) : null,
          special_instructions: specialInstructions,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      );

      // Show success message
      alert(`Your order has been placed successfully with ${method} payment!`);

      // Clear cart or redirect to order confirmation
      // fetchCartItems() or redirect
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  };

  // Payment Popup Component (inline)
  const PaymentPopup = ({ total }) => {
    if (!showPaymentPopup) return null;

    return (
      <div className="payment-modal-overlay">
        <div className="payment-modal">
          <div className="payment-modal-header">
            <h2>Select Payment Method</h2>
            <button
              className="payment-modal-close"
              onClick={() => setShowPaymentPopup(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="payment-options">
            <button
              className="payment-option khalti"
              onClick={() => handleKhaltiPayment(total)}
              disabled={loading}
            >
              <img src={images.Khalti} alt="Khalti" />
              Pay with Khalti
            </button>

            <button
              className="payment-option esewa"
              onClick={handleEsewaPayment}
              disabled={loading}
            >
              <img src={images.esewa} alt="eSewa" />
              Pay with eSewa
            </button>

            <button
              className="payment-option cash"
              onClick={handleCashPayment}
              disabled={loading}
            >
              Cash Payment
            </button>
          </div>

          <div className="payment-total">
            Total Amount: NPR {total.toFixed(2)}
          </div>

          {loading && (
            <div className="payment-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    );
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
  const total = subtotal;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Order</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-image">
                <img
                  src={`http://127.0.0.1:8000/${item.food_item.food_img_url}`}
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

          <div className="summary-row total">
            <span>Total</span>
            <span>NPR {total.toFixed(2)}</span>
          </div>

          <button
            className="btn-checkout"
            onClick={() => setShowPaymentPopup(true)}
          >
            Proceed to Payment
          </button>

          <Link to="/specialMenu" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Render the payment popup */}
      <PaymentPopup total={total} />
    </div>
  );
}
