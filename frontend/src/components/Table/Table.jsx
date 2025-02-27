import React, { useState, useEffect } from "react";
import axios from "axios";

const Table = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tables/")
      .then((response) => setTables(response.data))
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  return (
    <div>
      <h2>Tables</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.id}>
            Table {table.number} - Capacity: {table.capacity} seats
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Table;