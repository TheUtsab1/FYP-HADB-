"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Check, X, RefreshCw, ChevronDown } from "lucide-react";
import "./table-booking.css";

export default function TableBooking() {
  // Stores all tables from backend
  const [tables, setTables] = useState([]);
  // Stores tables after applying capacity and status filters
  const [filteredTables, setFilteredTables] = useState([]);
  // Loading indicator for API calls
  const [loading, setLoading] = useState(true);
  // Holds any error messages during fetch
  const [error, setError] = useState(null);
  // Keeps track of the table currently being reserved
  const [setReservingTable] = useState(null);

  // Filters: by capacity and status
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form inputs for booking
  const [username] = useState("");
  const [email] = useState("");

  // Controls visibility and content of popup/notification
  const [setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  // Controls notification visibility (for success/error messages)
  const [showNotification, setShowNotification] = useState(false);

  // For showing spinner or loading indicator on refresh
  const [refreshing, setRefreshing] = useState(false);

  // Controls dropdown (capacity/status) visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // FETCH DATA FROM BACKEND
  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data); // Set original data
      applyFilters(response.data); // Filter it immediately
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Failed to load tables. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data manually and show a notification
  const refreshTables = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data);
      applyFilters(response.data);

      // Success message on refresh
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

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } finally {
      setRefreshing(false);
    }
  };

  // On component mount, fetch table data and re-fetch every 30 seconds
  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 30000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Reapply filters when filter options change
  useEffect(() => {
    applyFilters(tables);
  }, [capacityFilter, statusFilter]);

  // Close dropdown when clicking outside of it
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

  // APPLY FILTERS BASED ON SELECTED CAPACITY AND STATUS
  const applyFilters = (tableData) => {
    let filtered = [...tableData];

    // Apply capacity filter if selected
    if (capacityFilter !== "all") {
      const capacity = Number.parseInt(capacityFilter);
      filtered = filtered.filter((table) => table.capacity === capacity);
    }

    // Apply status filter (Available / Occupied)
    if (statusFilter !== "all") {
      filtered = filtered.filter((table) => table.status === statusFilter);
    }

    setFilteredTables(filtered);
  };

  // HANDLE TABLE BOOKING REQUEST
  const handleReservation = async (tableId) => {
    try {
      const token = localStorage.getItem("token");

      // Send booking request to backend with JWT auth
      await axios.post(
        `http://localhost:8000/api/tables/request-booking/${tableId}/`,
        { username, email },
        { headers: { Authorization: `JWT ${token}` } }
      );

      // Success feedback
      setPopupMessage("Booking requested! Admin will confirm shortly.");
      setPopupType("success");
      setShowPopup(false);
      setShowNotification(true);
      fetchTables(); // Refresh table status

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Booking error:", error);
      setPopupMessage(error.response?.data?.error || "Failed to book table.");
      setPopupType("error");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } finally {
      setReservingTable(null);
    }
  };

  // DROPDOWN OPTIONS FOR CAPACITY FILTER
  const capacityOptions = [
    { value: "all", label: "ALL CAPACITIES" },
    { value: "2", label: "2 PEOPLE" },
    { value: "4", label: "4 PEOPLE" },
    { value: "6", label: "6 PEOPLE" },
    { value: "8", label: "8 PEOPLE" },
  ];

  // DROPDOWN OPTIONS FOR STATUS FILTER
  const statusOptions = [
    { value: "all", label: "ALL" },
    { value: "available", label: "AVAILABLE" },
    { value: "occupied", label: "OCCUPIED" },
  ];

  // Get the display label for current capacity filter
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
                      handleReservation(table.id);
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

      {showNotification && (
        <div className={`notification notification-${popupType}`}>
          {popupType === "success" ? <Check size={20} /> : <X size={20} />}
          <span>{popupMessage}</span>
        </div>
      )}
    </div>
  );
}
