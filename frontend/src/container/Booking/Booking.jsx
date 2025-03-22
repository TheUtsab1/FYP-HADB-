"use client";

import { useState } from "react";
import "./Booking.css";

const Booking = () => {
  const [reservationData, setReservationData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    guests: "2",
    date: "",
    time: "18:00",
    special_requests: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0];

  const handleReservationData = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reservationDataSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/submit-booking/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage("Your table has been reserved successfully!");
        setReservationData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          guests: "2",
          date: "",
          time: "18:00",
          special_requests: "",
        });
      } else {
        setMessageType("error");
        setMessage(
          "Unable to complete your reservation: " +
            (data.message || "Please try again")
        );
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Connection error. Please try again later.");
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-wrapper">
      <div className="booking-card">
        <div className="booking-header">
          <h2>Reserve Your Table</h2>
          <p>Experience the authentic flavors of Himalayan cuisine</p>
        </div>

        {message && (
          <div className={`booking-message ${messageType}`}>
            <p>{message}</p>
          </div>
        )}

        <form className="booking-form" onSubmit={reservationDataSubmit}>
          <div className="form-field">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={reservationData.first_name}
              onChange={handleReservationData}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-field">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={reservationData.last_name}
              onChange={handleReservationData}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={reservationData.phone}
              onChange={handleReservationData}
              placeholder="Your contact number"
              required
            />
          </div>

          <div className="form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={reservationData.email}
              onChange={handleReservationData}
              placeholder="Your email address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Number of Guests</label>
              <select
                name="guests"
                value={reservationData.guests}
                onChange={handleReservationData}
                required
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6 People</option>
                <option value="7">7 People</option>
                <option value="8">8 People</option>
                <option value="9">9+ People</option>
              </select>
            </div>

            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={reservationData.date}
                onChange={handleReservationData}
                min={today}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Time</label>
            <select
              name="time"
              value={reservationData.time}
              onChange={handleReservationData}
              required
            >
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
              <option value="20:00">08:00 PM</option>
              <option value="21:00">09:00 PM</option>
            </select>
          </div>

          <div className="form-field">
            <label>Special Requests (Optional)</label>
            <textarea
              name="special_requests"
              value={reservationData.special_requests}
              onChange={handleReservationData}
              placeholder="Any special requests or dietary requirements"
              rows="3"
            ></textarea>
          </div>

          <div className="reservation-policy">
            <p>
              I agree to the <span>reservation policy</span>. We hold tables for
              15 minutes past the reservation time.
            </p>
          </div>

          <button
            type="submit"
            className="confirm-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "CONFIRM RESERVATION"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
