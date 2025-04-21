import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EsewaSuccess() {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Verifying your payment...");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyPayment() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const oid = urlParams.get("oid");
        const amt = urlParams.get("amt");
        const refId = urlParams.get("refId");

        if (!oid || !amt || !refId) {
          setMessage(
            "Missing payment parameters. Payment verification failed."
          );
          setSuccess(false);
          setVerifying(false);
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/esewa-verify/",
          {
            oid,
            amt,
            refId,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess(true);
          setMessage("Payment successful! Your order has been placed.");
        } else {
          setSuccess(false);
          setMessage(
            response.data.message ||
              "Payment verification failed. Please contact support."
          );
        }
      } catch (error) {
        console.error("Error verifying eSewa payment:", error);
        setSuccess(false);
        setMessage(
          `Payment verification failed: ${
            error.response?.data?.message || error.message
          }. Please contact support.`
        );
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, []);

  return (
    <div className="esewa-result-container">
      <div className="esewa-result-card">
        <h2>
          {verifying
            ? "Verifying Payment"
            : success
            ? "Payment Successful!"
            : "Payment Failed"}
        </h2>

        {verifying && <div className="loading-spinner"></div>}

        <p>{message}</p>

        <div className="esewa-result-actions">
          <button
            className="btn-primary"
            onClick={() => navigate(success ? "/orders" : "/cart")}
          >
            {success ? "View Orders" : "Return to Cart"}
          </button>

          <button className="btn-secondary" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
