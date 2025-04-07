import React from "react";

const EsewaPayment = ({ total }) => {
  const handlePayment = () => {
    const amount = total * 100; // Convert to paisa
    const pid = "HIMALAYAN_" + Date.now();
    const successUrl = "http://localhost:8000/verify-esewa/"; // Backend endpoint
    const failureUrl = "http://localhost:3000/payment-failed";

    // eSewa Payment URL
    const esewaUrl = `https://uat.esewa.com.np/epay/main?amt=${amount}&pdc=0&psc=0&txAmt=0&tAmt=${amount}&pid=${pid}&scd=EPAYTEST&su=${successUrl}&fu=${failureUrl}`;

    // Redirect to eSewa Payment URL
    window.location.href = esewaUrl;
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay with eSewa</button>
    </div>
  );
};

export default EsewaPayment;
