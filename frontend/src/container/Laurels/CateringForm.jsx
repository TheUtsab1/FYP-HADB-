"use client";

import { useState } from "react";
import { MapPin, Calendar, Users, ChefHat } from "lucide-react";
import "./CateringForm.css";

const CateringForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    event_type: "",
    guests: "",
    date: "",
    time: "",
    venue_address: "",
    menu_preference: "",
    special_requests: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/submit-booking/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage(
          "Your catering request has been submitted successfully! We'll contact you within 24 hours to discuss details."
        );
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          event_type: "",
          guests: "",
          date: "",
          time: "",
          // venue_address: "",
          menu_preference: "",
          special_requests: "",
        });
      } else {
        setMessageType("error");
        setMessage(
          "Unable to submit your request: " +
            (data.message || "Please try again")
        );
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Connection error. Please try again later.");
      console.error("Catering form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="catering-wrapper">
      <div className="catering-card">
        <div className="catering-header">
          <ChefHat className="catering-icon" size={36} />
          <h2>Request Catering Services</h2>
          <p>
            Let us bring the authentic Himalayan flavors to your special event
          </p>
        </div>

        {message && (
          <div className={`catering-message ${messageType}`}>
            <p>{message}</p>
          </div>
        )}

        <form className="catering-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Contact Information</h3>

            <div className="form-row">
              <div className="form-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your contact number"
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Event Details</h3>

            <div className="form-field">
              <label>Event Type</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select event type
                </option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="birthday">Birthday Party</option>
                <option value="anniversary">Anniversary</option>
                <option value="graduation">Graduation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Number of Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  placeholder="Expected number of guests"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-field">
                <label>Event Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  <option value="breakfast">Breakfast (8AM - 10AM)</option>
                  <option value="lunch">Lunch (12PM - 2PM)</option>
                  <option value="dinner">Dinner (6PM - 8PM)</option>
                  <option value="custom">Custom Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Menu Preferences</h3>

            <div className="form-field">
              <label>Menu Type</label>
              <select
                name="menu_preference"
                value={formData.menu_preference}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select menu preference
                </option>
                <option value="himalayan_feast">Himalayan Feast</option>
                <option value="vegetarian_delight">Vegetarian Delight</option>
                <option value="spicy_selection">Spicy Selection</option>
                <option value="mixed_platter">Mixed Platter</option>
                <option value="custom">Custom Menu</option>
              </select>
            </div>

            <div className="form-field">
              <label>Special Requests</label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                placeholder="Dietary restrictions, allergies, or any special requirements"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="catering-policy">
            <p>
              By submitting this form, you agree to our{" "}
              <span>catering policy</span>. We'll contact you within 24 hours to
              discuss your event details and provide a quote.
            </p>
          </div>

          <button
            type="submit"
            className="catering-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Catering Request"}
          </button>
        </form>

        <div className="catering-info">
          <div className="info-item">
            <Calendar size={20} />
            <div>
              <h4>Advance Booking</h4>
              <p>Please book at least 7 days in advance</p>
            </div>
          </div>

          <div className="info-item">
            <Users size={20} />
            <div>
              <h4>Group Size</h4>
              <p>We cater for 20 to 500 guests</p>
            </div>
          </div>

          <div className="info-item">
            <MapPin size={20} />
            <div>
              <h4>Service Area</h4>
              <p>Within 50 miles of Himalayan Heights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringForm;
