"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Check,
  X,
  RefreshCw,
  DoorClosedIcon as CloseIcon,
} from "lucide-react";
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
  const [popupType, setPopupType] = useState("success"); // success or error
  const [statusFilter, setStatusFilter] = useState(null);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data);
      setFilteredTables(response.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Failed to load tables. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = tables;

    // Apply capacity filter
    if (capacityFilter !== "all") {
      const capacity = Number.parseInt(capacityFilter);
      filtered = filtered.filter((table) => table.capacity === capacity);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((table) => table.status === statusFilter);
    }

    setFilteredTables(filtered);
  }, [capacityFilter, statusFilter, tables]);

  const handleReservation = async (tableId) => {
    setReservingTable(tableId);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8000/api/tables/request-booking/${tableId}/`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      setPopupMessage("Booking requested! Admin will confirm shortly.");
      setPopupType("success");
      setShowPopup(true);
      fetchTables();
    } catch (error) {
      console.error("Booking error:", error);
      setPopupMessage(error.response?.data?.error || "Failed to book table.");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setReservingTable(null);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Get unique capacity values for filter
  const capacityOptions = [
    ...new Set(tables.map((table) => table.capacity)),
  ].sort((a, b) => a - b);

  return (
    <div className="booking-page">
      <div className="page-header">
        <h1>TABLE RESERVATION</h1>
        <p>Book your dining experience at our restaurant</p>
      </div>

      <div className="filter-section">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${!statusFilter ? "active" : ""}`}
            onClick={() => setStatusFilter(null)}
          >
            All
          </button>
          <button
            className={`filter-tab ${
              statusFilter === "available" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("available")}
          >
            Available
          </button>
          <button
            className={`filter-tab ${
              statusFilter === "occupied" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("occupied")}
          >
            Booked
          </button>
        </div>

        <div className="capacity-filter">
          <select
            id="capacity-select"
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
          >
            <option value="all">All Seats</option>
            {capacityOptions.map((capacity) => (
              <option key={capacity} value={capacity}>
                {capacity} seats
              </option>
            ))}
          </select>

          <button
            onClick={fetchTables}
            className="refresh-button"
            disabled={loading}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tables-grid">
        {loading ? (
          <div className="loading-state">Loading tables...</div>
        ) : filteredTables.length === 0 ? (
          <div className="empty-state">
            No tables available for this capacity
          </div>
        ) : (
          filteredTables.map((table) => (
            <div key={table.id} className={`table-card ${table.status}`}>
              <div className={`table-category ${table.status}`}>
                {table.status === "available" ? "AVAILABLE" : "OCCUPIED"}
              </div>
              <div className="table-content">
                <h3>Table {table.table_number || table.id}</h3>
                <div className="table-price">{table.capacity} seats</div>
                <div className="table-info">
                  <div className="seat-info">
                    <Users size={16} /> {table.capacity} seats
                  </div>
                  <div className="status-badge">
                    {table.status === "available" ? (
                      <span className="status-available">
                        <Check size={14} /> Available
                      </span>
                    ) : (
                      <span className="status-occupied">
                        <X size={14} /> Occupied
                      </span>
                    )}
                  </div>
                </div>
                <div className="table-action">
                  {table.status === "available" ? (
                    <button
                      onClick={() => handleReservation(table.id)}
                      disabled={reservingTable === table.id}
                      className="view-details-button"
                    >
                      {reservingTable === table.id
                        ? "Requesting..."
                        : "Reserve Table"}
                    </button>
                  ) : (
                    <div className="view-details-button disabled">
                      Not Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="reservation-info">
        <h2>Reservation Information</h2>
        <ul>
          <li>Reservations can be made up to 30 days in advance</li>
          <li>A credit card is required to hold your reservation</li>
          <li>Cancellations must be made at least 24 hours in advance</li>
          <li>For parties larger than 8, please call us directly</li>
        </ul>
      </div>

      {/* Custom Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className={`popup-content ${popupType}`}>
              <button className="close-button" onClick={closePopup}>
                <CloseIcon size={18} />
              </button>
              <div className="popup-icon">
                {popupType === "success" ? (
                  <Check size={32} />
                ) : (
                  <X size={32} />
                )}
              </div>
              <div className="popup-message">{popupMessage}</div>
              <button className="popup-button" onClick={closePopup}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
