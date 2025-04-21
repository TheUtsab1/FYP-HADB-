import React from "react";
import "./Chatbot.css";

const Chatbot = () => {
  return (
    <a
      href="https://wa.me/9779806561880?text=Hello%20Admin%2C%20I%20need%20help%20with%20my%20order"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://img.icons8.com/color/48/000000/whatsapp.png"
        alt="WhatsApp"
      />
    </a>
  );
};

export default Chatbot;
