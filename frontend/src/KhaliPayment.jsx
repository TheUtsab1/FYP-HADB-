import React, { useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";

const KhaltiPayment = () => {
  const [loading, setLoading] = useState(false);

  // Move this to environment variables in production
  const KHALTI_PUBLIC_KEY = "98c492879e8a423fb37558d5a33a6a37"; // Replace with your test key

  const khaltiConfig = {
    publicKey: KHALTI_PUBLIC_KEY,
    productIdentity: "1234567890",
    productName: "Product Name",
    productUrl: "http://localhost:3000/",
    eventHandler: {
      onSuccess: (payload) => {
        console.log("Payment Successful:", payload);
        setLoading(true);

        // Send the payload to the backend for verification
        fetch("http://localhost:8000/verify-payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            token: payload.token,
            amount: payload.amount,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setLoading(false);
            if (data.state && data.state.name === "Completed") {
              alert("Payment Verified Successfully!");
            } else {
              alert(
                "Payment Verification Failed: " +
                  (data.detail || "Unknown error")
              );
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error("Verification Error:", error);
            alert("Payment verification error. Please try again.");
          });
      },
      onError: (error) => {
        console.log("Payment Error:", error);
        alert("Payment failed. Please try again.");
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

  const handlePayment = () => {
    const checkout = new KhaltiCheckout(khaltiConfig);
    // Amount in paisa (Rs 10 = 1000 paisa)
    checkout.show({ amount: 1000 });
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: "#5C2D91",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay with Khalti"}
      </button>
      {loading && (
        <div style={{ marginTop: "10px" }}>Processing payment...</div>
      )}
    </div>
  );
};

export default KhaltiPayment;
