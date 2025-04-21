"use client";

import { useState, useEffect, useRef } from "react";
import { images } from "../../constants";
import { Link } from "react-router-dom";
import { X, Download, FileText, Image, Check } from "lucide-react";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [user, setUser] = useState(null);
  const invoiceRef = useRef(null);

  const KHALTI_PUBLIC_KEY = "98c492879e8a423fb37558d5a33a6a37";

  useEffect(() => {
    fetchCartItems();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    fetch("http://127.0.0.1:8000/profile/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((data) => {
        const userData = Array.isArray(data.results) ? data.results[0] : data;
        setUser(userData);
      })
      .catch((err) => {
        console.error("Profile error:", err);
        setUser({
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
        });
      });
  };

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

  const handleKhaltiPayment = (total) => {
    const khaltiConfig = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: "food-order-" + Date.now(),
      productName: "Food Order",
      productUrl: window.location.origin,
      eventHandler: {
        onSuccess: async (payload) => {
          console.log("Payment Successful:", payload);
          setLoading(true);

          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/verify-payment/",
              {
                token: payload.token,
                amount: total * 100,
              },
              {
                headers: {
                  Authorization: `JWT ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data.state?.name === "Completed") {
              handlePaymentComplete("khalti", payload);
              alert("Payment Verified Successfully!");
            } else {
              alert(
                "Payment Verification Failed: " +
                  (response.data.detail || "Unknown error")
              );
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
          console.log("Payment window closed");
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
    khaltiCheckout.show({ amount: total * 100 });
  };

  const handleEsewaPayment = async () => {
    if (
      !window.confirm(
        "You will be redirected to eSewa to complete your payment. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const transactionId = `food-order-${Date.now()}`;
      const productAmount = total;
      const totalAmount = productAmount;

      // Save pending order to backend
      const pendingOrderResponse = await axios.post(
        "http://127.0.0.1:8000/orders/pending/",
        {
          transactionId,
          amount: totalAmount,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.food_item.food_name,
            price: item.food_item.food_price,
            quantity: item.quantity,
          })),
          specialInstructions,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!pendingOrderResponse.data.success) {
        throw new Error(
          pendingOrderResponse.data.message || "Failed to save pending order"
        );
      }

      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute(
        "action",
        process.env.REACT_APP_ESEWA_URL || "https://uat.esewa.com.np/epay/main"
      );

      const formInputs = {
        amt: productAmount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: totalAmount,
        pid: transactionId,
        scd: process.env.REACT_APP_ESEWA_MERCHANT_CODE || "EPAYTEST",
        su: `${window.location.origin}/esewa-success`,
        fu: `${window.location.origin}/esewa-failure`,
      };

      Object.keys(formInputs).forEach((key) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", formInputs[key]);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error setting up eSewa payment:", error);
      alert(
        `Failed to initiate eSewa payment: ${
          error.message || "Please try again."
        }`
      );
      setLoading(false);
      setShowPaymentPopup(false);
    }
  };

  const handleCashPayment = () => {
    const newOrderId = "ORD-" + Math.floor(Math.random() * 10000);
    setOrderId(newOrderId);

    const currentDate = new Date().toISOString().split("T")[0];
    setOrderDate(currentDate);

    setShowInvoicePopup(true);
    setShowPaymentPopup(false);

    handlePaymentComplete("cash");
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
        alert(
          `Your order has been placed successfully with ${method} payment!`
        );
      }

      fetchCartItems();
    } catch (error) {
      console.error("Error creating order:", error);

      if (method !== "cash") {
        alert("There was an error processing your order. Please try again.");
      }
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
      pdf.save(`invoice-${orderId}.pdf`);
    });
  };

  const downloadInvoiceAsImage = () => {
    if (!invoiceRef.current) return;

    html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `invoice-${orderId}.png`;
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

  const InvoicePopup = ({ total }) => {
    if (!showInvoicePopup) return null;

    const customerName = user
      ? user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username
      : "Customer";

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
                <Image size={18} />
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
                <p>Date: {orderDate}</p>
                <p>Payment Method: Cash</p>
              </div>
              <div className="customer-details">
                <h3>Customer Information</h3>
                <p>
                  <strong>Name:</strong> {customerName}
                </p>
                {user && user.email && (
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="invoice-items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.food_item.food_name}</td>
                      <td>{item.quantity}</td>
                      <td>NPR {item.food_item.food_price.toFixed(2)}</td>
                      <td>
                        NPR{" "}
                        {(item.food_item.food_price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoice-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>NPR {total.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>NPR {total.toFixed(2)}</span>
              </div>
            </div>

            {specialInstructions && (
              <div className="invoice-notes">
                <h3>Special Instructions</h3>
                <p>{specialInstructions}</p>
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

      {user && (
        <div className="welcome-message">
          <p>
            Welcome,{" "}
            {user.first_name
              ? `${user.first_name} ${user.last_name}`
              : user.username}
            !
          </p>
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

      <PaymentPopup total={total} />
      <InvoicePopup total={total} />
    </div>
  );
}
