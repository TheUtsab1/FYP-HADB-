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
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Name (required)</label>
        <div className="name-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <label>Email (required)</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <div className="checkbox">
          <input
            type="checkbox"
            name="signUp"
            checked={formData.signUp}
            onChange={handleChange}
          />
          <label>Sign up for news and updates</label>
        </div>

        <label>Phone (required)</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Location</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="location"
              value="Sherman Oaks"
              checked={formData.location.includes("Sherman Oaks")}
              onChange={handleChange}
            />
            Sherman Oaks
          </label>
          <label>
            <input
              type="checkbox"
              name="location"
              value="Sycamore"
              checked={formData.location.includes("Sycamore")}
              onChange={handleChange}
            />
            Sycamore
          </label>
        </div>

        <label>Date of Catering (required)</label>
        <input
          type="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
        />

        <label>Time of Catering (required)</label>
        <input
          type="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
        />
        <p className="time-note">in Pacific Time</p>

        <label>Number of Guests (required)</label>
        <input
          type="number"
          name="guests"
          required
          value={formData.guests}
          onChange={handleChange}
        />

        <label>Additional Notes</label>
        <textarea
          name="notes"
          rows="4"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}
