import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuthStore from "../src/store/useAuthStore";
import { AboutUs, SpecialMenu } from "./container";
import "./App.css";
import Login from "./components/routes/Login";
import { Applayout } from "./Applayout";
import { LandingPage } from "./Page/LandingPage";
import Signup from "./components/routes/Signup";
import VerifyEmail from "./components/routes/VerifyEmail";
import CateringForm from "./container/Laurels/CateringForm";
import Cart from "./container/Cart/Cart";
import Booking from "./container/Booking/Booking";
import Aboutus from "./container/About-Us/about-us";
import FoodDetail from "./container/FoodDetail/FoodDetail";
import TableBooking from "./container/Table-Booking/table-booking";
import Profile from "./container/Profile/Profile";
import ChatBot from "./container/Chatbot/Chatbot";

// ChatbotPopup component
const ChatbotPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="chatbot-popup-overlay">
      <div className="chatbot-popup-container">
        <div className="chatbot-popup-header">
          <h3>Chat with us</h3>
          <button className="chatbot-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="chatbot-popup-body">
          <div className="chatbot-messages">
            <div className="chatbot-message bot">
              <p>Hello! How can I help you today?</p>
            </div>
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
            />
            <button className="chatbot-send-btn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ChatbotIcon component
const FloatingChatbot = ({ onClick }) => {
  return (
    <div className="chatbot-icon-container" onClick={onClick}>
      <div className="chatbot-icon" aria-label="Open chatbot">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </div>
  );
};

const App = () => {
  const { setIsUserAuthenticated } = useAuthStore();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      setIsUserAuthenticated(true);
    }
  }, [setIsUserAuthenticated]);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <BrowserRouter>
        {/* Add the ChatbotIcon component here so it appears on all routes */}
        <FloatingChatbot onClick={toggleChatbot} />
        <ChatbotPopup
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
        <Routes>
          <Route path="/" element={<Applayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="Signup" element={<Signup />} />
            <Route path="Verify" element={<VerifyEmail />} />
            <Route path="Login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="about-us" element={<Aboutus />} />
            <Route path="Booking" element={<Booking />} />
            <Route path="table-booking" element={<TableBooking />} />
            <Route path="specialMenu" element={<SpecialMenu />} />
            <Route path="/food/:food_slug" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="CateringForm" element={<CateringForm />} />
            <Route path="Chatbot" element={<ChatBot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
