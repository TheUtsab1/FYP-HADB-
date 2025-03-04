import React, { useState } from "react";
import "./Booking.css";

const Booking = () => {
  const [reservationData, setReservationData] = useState({
    Booking_name: "",
    email: "",
    No_of_person: "2 Person",
    Date: "",
    time: "10:00",
  });

  const handleReservationData = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reservationDataSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation Data:", reservationData);
    // Add API call or other logic here
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book Your Table</h2>
      <form className="booking-form" onSubmit={reservationDataSubmit}>
        <input
          type="text"
          name="Booking_name"
          value={reservationData.Booking_name}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Full Name"
        />
        <input
          type="text"
          name="email"
          value={reservationData.email}
          onChange={handleReservationData}
          className="booking-input"
          placeholder="Email"
        />
        <select
          name="No_of_person"
          value={reservationData.No_of_person}
          onChange={handleReservationData}
          className="booking-select"
        >
          <option value="2 Person">2 Person</option>
          <option value="3 Person">3 Person</option>
          <option value="4 Person">4 Person</option>
          <option value="5 Person">5 Person</option>
          <option value="6 Person">6 Person</option>
          <option value="Family Table">Family Table (10 chairs)</option>
        </select>
        <input
          type="date"
          name="Date"
          value={reservationData.Date}
          onChange={handleReservationData}
          className="booking-input"
        />
        <select
          name="time"
          value={reservationData.time}
          onChange={handleReservationData}
          className="booking-select"
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
    </div>
  );
};

export default Booking;
