// src/components/StripeCheckoutButton.js
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios";

// Replace with your Stripe test publishable key
const stripePromise = loadStripe(
  "pk_test_TYooMQauvdEDq54NiTphI7jx"
);

function StripeCheckoutButton({ cartItems, email }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/create-stripe-session/",
        {
          items: cartItems,
          email: email,
        }
      );

      const stripe = await stripePromise;
      if (stripe && response.data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        console.error("Stripe or session ID is missing.");
      }
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Processing..." : "Pay with Stripe"}
    </button>
  );
}

export default StripeCheckoutButton;
