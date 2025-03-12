import React, { useState } from "react";
import "./CateringForm.css";

const Booking = () => {
  const [reservationData, setReservationData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    guests: "2",
    date: "",
    time: "10:00",
  });

  const [message, setMessage] = useState("");

  const handleReservationData = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reservationDataSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/submit-booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Reservation submitted successfully!");
        setReservationData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          guests: "2",
          date: "",
          time: "10:00",
        });
      } else {
        setMessage("Failed to submit reservation: " + JSON.stringify(data));
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book Your Table</h2>
      <form className="booking-form" onSubmit={reservationDataSubmit}>
        <input
          type="text"
          name="first_name"
          value={reservationData.first_name}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={reservationData.last_name}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Last Name"
          required
        />
        <input
          type="tel"
          name="phone"
          value={reservationData.phone}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Phone"
          required
        />
        <input
          type="email"
          name="email"
          value={reservationData.email}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Email"
          required
        />
        <input
          type="number"
          name="guests"
          value={reservationData.guests}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Number of Guests"
          required
        />
        <input
          type="date"
          name="date"
          value={reservationData.date}
          onChange={handleReservationData}
          className="booking-input"
          required
        />
        <select
          name="time"
          value={reservationData.time}
          onChange={handleReservationData}
          className="booking-select"
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
        </select>
        <button type="submit" className="booking-button">
          Book Now
        </button>
      </form>
      {message && <p className="booking-message">{message}</p>}
    </div>
  );
};

export default Booking;
