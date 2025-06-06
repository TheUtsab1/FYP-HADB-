"use client";

import { useState, useEffect, useRef } from "react";
import { images } from "../../constants";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { X, FileText, ImageIcon } from "lucide-react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { loadStripe } from "@stripe/stripe-js";
import "./Cart.css";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51RGzEPEEI2zN8avgdcno7NHIORqjeNZFOSekIOxyk55iuqiO2ZcEKJnxH2vLCTN6erkIB0XqRZepvahQm3QGmmrL00N98Huk8M"
);

export default function Cart() {
const [cartItems, setCartItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null); // Fixed
  const [orderDate, setOrderDate] = useState(null); // Fixed
  const [user, setUser] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [lastCartState, setLastCartState] = useState([]);
  const invoiceRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessedRedirect = useRef(false);
  const userDataFetched = useRef(false);

  // Store user data in localStorage to persist through redirects
  const storeUserData = (userData) => {
    if (userData) {
      localStorage.setItem(
        "userFullName",
        userData.first_name && userData.last_name
          ? `${userData.first_name} ${userData.last_name}`.trim()
          : userData.username || ""
      );
      localStorage.setItem("userEmail", userData.email || "");
    }
  };

  // Get user data from localStorage
  const getUserDataFromStorage = () => {
    return {
      fullName: localStorage.getItem("userFullName") || "",
      email: localStorage.getItem("userEmail") || "",
      username: localStorage.getItem("username") || "Customer",
    };
  };

  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Fetch user profile first and ensure it completes
        if (!userDataFetched.current) {
          await fetchUserProfile();
          userDataFetched.current = true;
        }

        // Fetch cart items
        const items = await fetchCartItems();
        if (items && items.length > 0) {
          setLastCartState(items);
        }

        // Process payment redirect only after user and cart data are ready
        if (!hasProcessedRedirect.current) {
          const paymentStatus = searchParams.get("payment");
          const sessionId = searchParams.get("session_id");

          if (paymentStatus === "success" && sessionId) {
            handlePaymentRedirect(items);
          } else if (paymentStatus === "canceled") {
            setPaymentMessage("Payment was canceled. Please try again.");
            navigate("/cart", { replace: true });
          }

          hasProcessedRedirect.current = true;
        }
      } catch (error) {
        console.error("Error in initialization:", error);
      }
    };

    initializeCart();
  }, [location.search]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      const storedData = getUserDataFromStorage();
      setUser({
        username: storedData.username,
        email: storedData.email,
        first_name: storedData.fullName.split(" ")[0] || "",
        last_name: storedData.fullName.split(" ").slice(1).join(" ") || "",
      });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/profile/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      const userData = Array.isArray(data.results) ? data.results[0] : data;

      // Set user state
      setUser(userData);

      // Store in localStorage for persistence
      localStorage.setItem("username", userData.username || "Customer");
      localStorage.setItem("email", userData.email || "");
      storeUserData(userData);

      return userData;
    } catch (err) {
      console.error("Profile error:", err);
      const storedData = getUserDataFromStorage();
      setUser({
        username: storedData.username,
        email: storedData.email,
        first_name: storedData.fullName.split(" ")[0] || "",
        last_name: storedData.fullName.split(" ").slice(1).join(" ") || "",
      });
    }
  };

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
      const response = await axios.get("http://127.0.0.1:8000/cart/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      setCartItems(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      return [];
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete("http://127.0.0.1:8000/cart/delete/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
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

  const handlePaymentRedirect = async (currentCartItems) => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const itemsForInvoice =
        currentCartItems && currentCartItems.length > 0
          ? currentCartItems
          : lastCartState;

      // Get stored user data to ensure we have it after redirect
      const storedUserData = getUserDataFromStorage();
      const customerName =
        storedUserData.fullName || storedUserData.username || "Customer";
      const customerEmail = storedUserData.email || "";

      try {
        const paymentVerification = await axios.get(
          `http://127.0.0.1:8000/payment-success/?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (paymentVerification.data.success) {
          const invoice = paymentVerification.data.invoice;
          // Override with stored user data to ensure consistency
          setInvoiceData({
            ...invoice,
            customer_name: customerName,
            customer_email: customerEmail,
          });
          setOrderId(invoice.order_id);
          setOrderDate(invoice.order_date);
          setPaymentMessage(
            "Payment was successful! Your order has been placed."
          );

          await clearCart();
          setTimeout(() => {
            setShowInvoicePopup(true);
          }, 300);
        } else {
          createBasicInvoice("Stripe", sessionId, itemsForInvoice);
          setPaymentMessage("Payment was successful!");
          await clearCart();
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        createBasicInvoice("Stripe", sessionId, itemsForInvoice);
        setPaymentMessage("Payment was successful!");
        await clearCart();
      } finally {
        setLoading(false);
        navigate("/cart", { replace: true });
      }
    }
  };

  const createBasicInvoice = (
    paymentMethod,
    sessionId = null,
    itemsSource = []
  ) => {
    const items = itemsSource.length > 0 ? itemsSource : lastCartState;
    const newOrderId = sessionId
      ? `ORD-${sessionId.slice(-8)}`
      : `ORD-${Math.floor(Math.random() * 10000)}`;

    // Get stored user data to ensure consistency
    const storedUserData = getUserDataFromStorage();
    const customerName =
      storedUserData.fullName || storedUserData.username || "Customer";
    const customerEmail = storedUserData.email || "";

    const invoiceData = {
      order_id: newOrderId,
      order_date: new Date().toISOString().split("T")[0],
      items: items.map(
        (item) => `${item.food_item.food_name} x${item.quantity}`
      ),
      total: items.reduce(
        (total, item) => total + item.food_item.food_price * item.quantity,
        0
      ),
      currency: "npr",
      special_instructions: specialInstructions,
      customer_name: customerName,
      customer_email: customerEmail,
      payment_method: paymentMethod,
    };

    setInvoiceData(invoiceData);
    setOrderId(newOrderId);
    setOrderDate(invoiceData.order_date);

    setTimeout(() => {
      setShowInvoicePopup(true);
    }, 300);
  };

  const handleStripePayment = async (total) => {
    // Before redirecting, make sure user data is stored
    const userData = user || (await fetchUserProfile());
    if (userData) {
      storeUserData(userData);
    }

    setLastCartState([...cartItems]);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create-checkout-session/",
        {
          amount: total,
          currency: "npr",
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.food_item.food_name,
            price: item.food_item.food_price,
            quantity: item.quantity,
          })),
          special_instructions: specialInstructions,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setPaymentMessage("Payment failed! " + error.message);
      }
    } catch (error) {
      console.error("Error setting up Stripe payment:", error);
      setPaymentMessage(
        `Failed to initiate Stripe payment: ${
          error.response?.data?.message || error.message || "Please try again."
        }`
      );
    } finally {
      setLoading(false);
      setShowPaymentPopup(false);
    }
  };

  const handleCashPayment = async () => {
    const currentCartItems = [...cartItems];
    createBasicInvoice("Cash", null, currentCartItems);
    setShowPaymentPopup(false);
    await handlePaymentComplete("cash");
    await clearCart();
  };

  const handlePaymentComplete = async (method, data) => {
    try {
      const response = await axios.post(
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

      if (method !== "cash") {
        setPaymentMessage(
          `Your order has been placed successfully with ${method} payment!`
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      if (method !== "cash") {
        setPaymentMessage(
          "There was an error processing your order. Please try again."
        );
      }
      return null;
    }
  };

  const downloadInvoiceAsPDF = () => {
    if (!invoiceRef.current) return;

    html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceData.order_id}.pdf`);
    });
  };

  const downloadInvoiceAsImage = () => {
    if (!invoiceRef.current) return;

    html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `invoice-${invoiceData.order_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

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
              className="payment-option stripe"
              onClick={() => handleStripePayment(total)}
              disabled={loading}
            >
              <img
                src={
                  images.stripe ||
                  "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/4.25.0/stripe.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Stripe"
              />
              Pay with Stripe
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

  const InvoicePopup = ({ invoice }) => {
    if (!showInvoicePopup || !invoice) return null;

    return (
      <div className="invoice-modal-overlay">
        <div className="invoice-modal">
          <div className="invoice-modal-header">
            <h2>Invoice</h2>
            <div className="invoice-actions">
              <button
                className="invoice-download-btn pdf"
                onClick={downloadInvoiceAsPDF}
                title="Download as PDF"
              >
                <FileText size={18} />
                PDF
              </button>
              <button
                className="invoice-download-btn png"
                onClick={downloadInvoiceAsImage}
                title="Download as Image"
              >
                <ImageIcon size={18} />
                PNG
              </button>
              <button
                className="invoice-modal-close"
                onClick={() => setShowInvoicePopup(false)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="invoice-content" ref={invoiceRef}>
            <div className="invoice-details">
              <div className="invoice-number">
                <p>Order ID: {invoice.order_id}</p>
                <p>Date: {invoice.order_date}</p>
                <p>Payment Method: {invoice.payment_method || "Stripe"}</p>
              </div>
              <div className="customer-details">
                <h3>Customer Information</h3>
                <p>
                  <strong>Name:</strong> {invoice.customer_name}
                </p>
                <p>
                  <strong>Email:</strong> {invoice.customer_email}
                </p>
              </div>
            </div>

            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => {
                    const [name, quantity, amount] = item.split(" x");
                    return (
                      <tr key={index}>
                        <td>{name}</td>
                        <td>{quantity}</td>
                        <td>{amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="invoice-summary">
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  {invoice.currency.toUpperCase()} {invoice.total.toFixed(2)}
                </span>
              </div>
            </div>

            {invoice.special_instructions && (
              <div className="invoice-notes">
                <h3>Special Instructions</h3>
                <p>{invoice.special_instructions}</p>
              </div>
            )}

            <div className="invoice-footer">
              <p>Thank you for your order!</p>
              <p>Please present this invoice when collecting your order.</p>
            </div>
          </div>

          <div className="invoice-modal-footer">
            <button
              className="btn-primary"
              onClick={() => setShowInvoicePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.food_item.food_price * item.quantity,
    0
  );
  const total = subtotal;

  return (
    <div className="cart-container">
      <InvoicePopup invoice={invoiceData} />

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          {paymentMessage && (
            <div
              className={`payment-message ${
                paymentMessage.includes("successful") ? "success" : "error"
              }`}
            >
              {paymentMessage}
            </div>
          )}
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/specialMenu">
            <button className="btn-primary">Browse Menu</button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="cart-title">Your Order</h1>

          {paymentMessage && (
            <div
              className={`payment-message ${
                paymentMessage.includes("successful") ? "success" : "error"
              }`}
            >
              {paymentMessage}
            </div>
          )}

          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-image">
                    <img
                      src={`http://127.0.0.1:8000${item.food_item.food_img_url}`}
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
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
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

          <PaymentPopup total={total} />
        </>
      )}
    </div>
  );
}
