import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EsewaFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("eSewa payment failed. Check transaction logs for details.");
  }, []);

  return (
    <div className="esewa-result-container">
      <div className="esewa-result-card">
        <h2>Payment Failed</h2>
        <p>
          Your eSewa payment was not completed successfully. Please try again or
          contact support at support@example.com for assistance.
        </p>

        <div className="esewa-result-actions">
          <button className="btn-primary" onClick={() => navigate("/cart")}>
            Try Again
          </button>

          <button className="btn-secondary" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
