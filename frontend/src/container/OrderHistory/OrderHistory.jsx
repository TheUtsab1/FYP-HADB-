import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view order history");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/orders/history/", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order history");
        setLoading(false);
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="order-history-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="order-history-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1>Your Order History</h1>
      {orders.length === 0 ? (
        <div className="empty-history">
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/specialMenu" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.transaction_id}</h3>
                <span className={`status ${order.payment_status.toLowerCase()}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> NPR {order.amount.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {order.payment_method}</p>
                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.food_name} x{item.quantity} (NPR {item.total.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </div>
                {order.special_instructions && (
                  <p><strong>Special Instructions:</strong> {order.special_instructions}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}