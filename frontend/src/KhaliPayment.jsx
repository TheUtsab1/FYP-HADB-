import React from "react";
import KhaltiCheckout from "khalti-checkout-web";

const KhaltiPayment = () => {
  const khaltiConfig = {
    publicKey: "98c492879e8a423fb37558d5a33a6a37",
    productIdentity: "1234567890",
    productName: "Product Name",
    productUrl: "http://localhost:3000/",
    eventHandler: {
      onSuccess: (payload) => {
        console.log("Payment Successful:", payload);

        // Send the payload to the backend for verification
        fetch("http://localhost:8000/verify-payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: payload.token,
            amount: payload.amount,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.state.name === "Completed") {
              alert("Payment Verified!");
            } else {
              alert("Payment Verification Failed!");
            }
          });
      },
      onError: (error) => {
        console.log("Payment Error:", error);
      },
      onClose: () => {
        console.log("Payment Closed");
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

  const handlePayment = () => {
    khaltiCheckout.show({ amount: 1000 }); // Amount in paisa (10 = Rs. 0.10)
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay with Khalti</button>
    </div>
  );
};

export default KhaltiPayment;
