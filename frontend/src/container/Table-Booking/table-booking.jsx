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
  const [statusFilter, setStatusFilter] = useState("all");

  const [username] = useState("");
  const [email] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

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
      const capacity = parseInt(capacityFilter);
      filtered = filtered.filter((table) => table.capacity === capacity);
    }

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

      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error("Booking error:", error);
      setPopupMessage(error.response?.data?.error || "Failed to book table.");
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
