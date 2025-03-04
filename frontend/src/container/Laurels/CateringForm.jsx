import { useState } from "react";
import "../Laurels/CateringForm.css";

export default function CateringForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    signUp: false,
    location: [],
    date: "",
    time: "",
    guests: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "location") {
      setFormData((prev) => ({
        ...prev,
        location: checked
          ? [...prev.location, value]
          : prev.location.filter((loc) => loc !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the form data to Django API
    fetch("http://localhost:8000/api/submit-booking/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Form submitted successfully!");
        } else {
          alert("Error submitting form. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error submitting form. Please try again.");
      });
  };

  return (
    <div className="catering__page">
      <div className="catering__overlay">
        <img src="/path-to-your-image.jpg" alt="Catering Background" />
      </div>

      <div className="catering__form-container">
        <h2>Catering Request Form</h2>
        <form className="catering__form" onSubmit={handleSubmit}>
          <label>Name (required)</label>
          <div className="catering__name-fields">
            <input
              type="text"
              name="firstName"
              className="catering__input"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <label>Email (required)</label>
          <input
            type="email"
            name="email"
            className="catering__input"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <label>Phone (required)</label>
          <input
            type="tel"
            name="phone"
            className="catering__input"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <label>Location</label>
          <input
            type="text"
            name="location"
            className="catering__input"
            placeholder="Location"
            required
            value={formData.Location}
            onChange={handleChange}
          />
          <label>Date of Catering (required)</label>
          <input
            type="date"
            name="date"
            className="catering__input"
            required
            value={formData.date}
            onChange={handleChange}
          />
          <label>Time of Catering (required)</label>
          <input
            type="time"
            name="time"
            className="catering__input"
            required
            value={formData.time}
            onChange={handleChange}
          />
          <label>Number of Guests (required)</label>
          <input
            type="number"
            name="guests"
            className="catering__input"
            required
            value={formData.guests}
            onChange={handleChange}
          />

          <label>Additional Notes</label>
          <textarea
            name="notes"
            className="catering__textarea"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="catering__button">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}
