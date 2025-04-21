"use client";

// Import necessary hooks and icons
import { useState } from "react";
import { MapPin, Calendar, Users, ChefHat } from "lucide-react";
import "./CateringForm.css"; // Import custom CSS for styling the form

// Define the CateringForm functional component
const CateringForm = () => {
  // State to manage form data input values
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

  // State to handle messages shown after form submission (success/error)
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Type can be 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if the form is being submitted

  // Get today's date in YYYY-MM-DD format to use as the minimum date for event booking
  const today = new Date().toISOString().split("T")[0];

  // Handle changes in input fields (form fields are dynamic)
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get name and value from input field
    // Update the state with the new value for the corresponding field
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (POST request to the backend API)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setIsSubmitting(true); // Set submitting state to true to disable the submit button
    setMessage(""); // Reset any previous messages

    try {
      // Send form data to the backend API
      const response = await fetch(
        "http://127.0.0.1:8000/api/submit-booking/", // API endpoint to handle catering request submission
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // Define the content type as JSON
          body: JSON.stringify(formData), // Convert form data to JSON and send it as the body
        }
      );

      const data = await response.json(); // Parse the JSON response from the API

      if (response.ok) {
        // If the response is successful (HTTP status 200-299)
        setMessageType("success");
        setMessage(
          "Your catering request has been submitted successfully! We'll contact you within 24 hours to discuss details."
        );
        // Reset form fields after successful submission
        setFormData({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          event_type: "",
          guests: "",
          date: "",
          time: "",
          menu_preference: "",
          special_requests: "",
        });
      } else {
        // If the response has an error (non-2xx status)
        setMessageType("error");
        setMessage(
          "Unable to submit your request: " + (data.message || "Please try again")
        );
      }
    } catch (error) {
      // If there is a network error or other issue with the request
      setMessageType("error");
      setMessage("Connection error. Please try again later.");
      console.error("Catering form error:", error); // Log the error for debugging
    } finally {
      // Reset submitting state to false once the request is completed
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
