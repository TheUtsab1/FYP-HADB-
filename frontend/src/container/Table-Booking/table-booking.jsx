"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Check,
  X,
  RefreshCw,
  ChevronDown,
  Calendar,
  Clock,
} from "lucide-react";
import "./table-booking.css";

export default function TableBooking() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingTable, setReservingTable] = useState(null);

  const [capacityFilter, setCapacityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [username] = useState("");
  const [email] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [selectedTable, setSelectedTable] = useState(null);

  const [showNotification, setShowNotification] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Add new state variables for popups
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data);
      applyFilters(response.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Failed to load tables. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const refreshTables = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data);
      applyFilters(response.data);

      setPopupMessage("Tables refreshed successfully!");
      setPopupType("success");
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Error refreshing tables:", err);
      setPopupMessage("Failed to refresh tables.");
      setPopupType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters(tables);
  }, [capacityFilter, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".filter-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const applyFilters = (tableData) => {
    let filtered = [...tableData];

    if (capacityFilter !== "all") {
      const capacity = Number.parseInt(capacityFilter);
      filtered = filtered.filter((table) => table.capacity === capacity);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((table) => table.status === statusFilter);
    }

    setFilteredTables(filtered);
  };

  const openReservationPopup = (table) => {
    setSelectedTable(table);
    setShowPopup(true);
  };

  const closeReservationPopup = () => {
    setShowPopup(false);
    setSelectedTable(null);
  };

  // Close login popup
  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  // Navigate to login page
  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  // Close success popup
  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const handleReservation = async (tableId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Show login popup instead of notification
      setShowLoginPopup(true);
      setShowPopup(false);
      return;
    }

    setReservingTable(tableId);
    try {
      await axios.post(
        `http://localhost:8000/api/tables/request-booking/${tableId}/`,
        { username, email },
        { headers: { Authorization: `JWT ${token}` } }
      );

      // Close reservation popup and show success popup
      setShowPopup(false);
      setShowSuccessPopup(true);

      fetchTables();
    } catch (error) {
      console.error("Booking error:", error);
      setPopupMessage(
        error.response?.data?.error || "Failed to book table. Please try again."
      );
      setPopupType("error");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setReservingTable(null);
    }
  };

  const capacityOptions = [
    { value: "all", label: "ALL CAPACITIES" },
    { value: "2", label: "2 PEOPLE" },
    { value: "4", label: "4 PEOPLE" },
    { value: "6", label: "6 PEOPLE" },
    { value: "8", label: "8 PEOPLE" },
  ];

  const statusOptions = [
    { value: "all", label: "ALL" },
    { value: "available", label: "AVAILABLE" },
    { value: "occupied", label: "OCCUPIED" },
  ];

  const getCurrentCapacityLabel = () => {
    const option = capacityOptions.find((opt) => opt.value === capacityFilter);
    return option ? option.label : "ALL CAPACITIES";
  };

  return (
    <div className="booking-page">
      <h1 className="booking-title">OUR TABLE RESERVATIONS</h1>
      <p className="booking-subtitle">
        Browse available tables and make a reservation
      </p>

      <div className="filter-container">
        <div className="filter-dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {getCurrentCapacityLabel()}
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-content">
              {capacityOptions.map((option) => (
                <div
                  key={option.value}
                  className={`dropdown-item ${
                    capacityFilter === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setCapacityFilter(option.value);
                    setDropdownOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-pills">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-pill ${
                statusFilter === option.value ? "active" : ""
              }`}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="refresh-button"
        onClick={refreshTables}
        disabled={refreshing}
        aria-label="Refresh tables"
      >
        <RefreshCw size={24} className={refreshing ? "animate-spin" : ""} />
      </button>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="form-submit" onClick={fetchTables}>
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="tables-grid">
          {filteredTables.length === 0 ? (
            <div className="error-message">
              <p>No tables match your filters.</p>
              <button
                className="form-submit"
                onClick={() => {
                  setCapacityFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTables.map((table) => (
              <div key={table.id} className="table-card">
                <div className={`table-status-tag status-${table.status}`}>
                  {table.status === "available"
                    ? "Available"
                    : table.status === "occupied"
                    ? "Occupied"
                    : "Pending"}
                </div>

                <div className="table-content">
                  <h3 className="table-number">Table {table.table_number}</h3>
                  <div className="table-capacity">
                    <Users size={20} />
                    <span>{table.capacity} People</span>
                  </div>
                </div>

                {table.status === "available" ? (
                  <button
                    className="table-action action-reserve"
                    onClick={() => openReservationPopup(table)}
                  >
                    Reserve Now
                  </button>
                ) : table.status === "occupied" ? (
                  <button className="table-action action-occupied" disabled>
                    Currently Occupied
                  </button>
                ) : (
                  <button className="table-action action-pending" disabled>
                    Pending Confirmation
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reservation Popup */}
      {showPopup && selectedTable && (
        <div
          className="reservation-popup-overlay"
          onClick={closeReservationPopup}
        >
          <div
            className="reservation-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <div className="popup-header-line"></div>
              <button
                className="popup-close-btn"
                onClick={closeReservationPopup}
              >
                <X size={20} />
              </button>
            </div>

            <div className="popup-content">
              <div className="popup-icon">
                <Calendar size={32} />
              </div>
              <h3 className="popup-title">
                Reserve Table {selectedTable.table_number}
              </h3>

              <div className="table-details">
                <div className="detail-item">
                  <Users size={18} />
                  <span>{selectedTable.capacity} People</span>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <span>Available Now</span>
                </div>
              </div>

              <p className="popup-message">
                Would you like to reserve this table? Our staff will confirm
                your reservation shortly.
              </p>

              <div className="popup-actions">
                <button
                  className="popup-cancel-btn"
                  onClick={closeReservationPopup}
                >
                  Cancel
                </button>
                <button
                  className="popup-confirm-btn"
                  onClick={() => handleReservation(selectedTable.id)}
                  disabled={reservingTable === selectedTable.id}
                >
                  {reservingTable === selectedTable.id ? (
                    <span className="loading-text">
                      <div className="button-spinner"></div>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Reservation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={closeLoginPopup}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closeLoginPopup}>
              ×
            </button>
            <div className="popup-icon">🔒</div>
            <h3 className="popup-title">Login Required</h3>
            <p className="popup-message">Please log in to reserve a table</p>
            <div className="popup-actions">
              <button className="popup-login-btn" onClick={navigateToLogin}>
                Log In
              </button>
              <button className="popup-cancel-btn" onClick={closeLoginPopup}>
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay" onClick={closeSuccessPopup}>
          <div className="success-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closeSuccessPopup}>
              ×
            </button>
            <div className="popup-icon">
              <Check size={24} />
            </div>
            <h3 className="popup-title">Reservation Requested</h3>
            <p className="popup-message">
              Your table reservation has been requested successfully. You will
              be contacted soon.
            </p>
            <div className="popup-actions">
              <button className="popup-cancel-btn" onClick={closeSuccessPopup}>
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div className={`notification notification-${popupType}`}>
          {popupType === "success" ? <Check size={20} /> : <X size={20} />}
          <span>{popupMessage}</span>
        </div>
      )}
    </div>
  );
}
