"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Check, X, RefreshCw } from "lucide-react";
import "./table-booking.css";

export default function TableBooking() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingTable, setReservingTable] = useState(null);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/api/tables/");
      setTables(response.data);
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

  const handleReservation = async (tableId) => {
    setReservingTable(tableId);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
      await axios.post(
        `http://localhost:8000/api/tables/request-booking/${tableId}/`,
        {},
        {
          headers: {
            Authorization: `JWT ${token}`, // Include token in request headers
          },
        }
      );
  
      alert("Booking requested! Admin will confirm shortly.");
      fetchTables(); // Immediate refresh after booking
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.error || "Failed to book table.");
    } finally {
      setReservingTable(null);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-content">
        <div className="booking-header">
          <h1>Table Reservation</h1>
          <p>Click on an available table to request reservation</p>

          {/* Refresh Button */}
          <button
            onClick={fetchTables}
            className="refresh-button"
            disabled={loading}
          >
            <RefreshCw size={16} /> Refresh Tables
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-grid">
          {loading ? (
            <p>Loading tables...</p>
          ) : tables.length === 0 ? (
            <p>No tables available</p>
          ) : (
            tables.map((table) => (
              <div key={table.id} className={`table-card ${table.status}`}>
                <div className="table-info">
                  <h2>Table {table.table_number}</h2>
                  <p>
                    <Users size={16} /> {table.capacity} seats
                  </p>
                  <p>
                    {table.status === "available" ? (
                      <span className="status-available">
                        <Check size={16} /> Available
                      </span>
                    ) : (
                      <span className="status-occupied">
                        <X size={16} /> Occupied
                      </span>
                    )}
                  </p>
                </div>

                {table.status === "available" ? (
                  <button
                    onClick={() => handleReservation(table.id)}
                    disabled={reservingTable === table.id}
                    className="reserve-button"
                  >
                    {reservingTable === table.id ? "Requesting..." : "Reserve"}
                  </button>
                ) : (
                  <button className="occupied-button" disabled>
                    Booked
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
