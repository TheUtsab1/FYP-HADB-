"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Check, X, RefreshCw, ChevronDown } from "lucide-react";
import "./table-booking.css";

export default function TableBooking() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingTable, setReservingTable] = useState(null);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [statusFilter, setStatusFilter] = useState("all");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

      // Show success notification
      setPopupMessage("Tables refreshed successfully!");
      setPopupType("success");
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (err) {
      console.error("Error refreshing tables:", err);
      setPopupMessage("Failed to refresh tables.");
      setPopupType("error");
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".filter-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const applyFilters = (tableData) => {
    let filtered = [...tableData];

    // Filter by capacity
    if (capacityFilter !== "all") {
      const capacity = Number.parseInt(capacityFilter);
      filtered = filtered.filter((table) => table.capacity === capacity);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((table) => table.status === statusFilter);
    }

    setFilteredTables(filtered);
  };

  const handleReservation = async (tableId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/tables/request-booking/${tableId}/`,
        { username, email },
        { headers: { Authorization: `JWT ${token}` } }
      );
      setPopupMessage("Booking requested! Admin will confirm shortly.");
      setPopupType("success");
      setShowPopup(false);
      setShowNotification(true);
      fetchTables();

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Booking error:", error);
      setPopupMessage(error.response?.data?.error || "Failed to book table.");
      setPopupType("error");
      setShowNotification(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } finally {
      setReservingTable(null);
    }
  };

  // Capacity options for dropdown
  const capacityOptions = [
    { value: "all", label: "ALL CAPACITIES" },
    { value: "2", label: "2 PEOPLE" },
    { value: "4", label: "4 PEOPLE" },
    { value: "6", label: "6 PEOPLE" },
    { value: "8", label: "8 PEOPLE" },
  ];

  // Status options for filter - removed "pending" as requested
  const statusOptions = [
    { value: "all", label: "ALL" },
    { value: "available", label: "AVAILABLE" },
    { value: "occupied", label: "OCCUPIED" },
  ];

  // Get current capacity label
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
        {/* Capacity Dropdown */}
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

      {/* Status Filter Pills */}
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

      {/* Floating Refresh Button */}
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
                    onClick={() => {
                      setReservingTable(table.id);
                      setShowPopup(true);
                    }}
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

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              <X size={20} />
            </button>
            <h2 className="popup-title">Reserve Table</h2>
            <div className="popup-form">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <div className="form-input-wrapper">
                  <input
                    className="form-input"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="form-submit"
                onClick={() => handleReservation(reservingTable)}
                disabled={!username || !email}
              >
                Confirm Reservation
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
