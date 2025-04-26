"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import { images } from "../../constants";

const FoodDetail = ({ onClose }) => {
  const { food_slug } = useParams(); // URL bata slug extract garincha (e.g., /food/momo)
  // STATE VARIABLES
  const [food, setFood] = useState(null); // Store fetched food data
  const [loading, setLoading] = useState(true); // Loading spinner display control
  const [error, setError] = useState(null); // Error message display
  const [quantity, setQuantity] = useState(1); // Cart ma kati quantity add garne
  const [addedToCart, setAddedToCart] = useState(false); // Track if item was added
  const [reviews, setReviews] = useState([]); // Store all reviews
  const [displayedReviews, setDisplayedReviews] = useState([]); // Store displayed reviews
  const [userRating, setUserRating] = useState(0); // User's selected rating
  const [hoverRating, setHoverRating] = useState(0); // Rating being hovered
  const [comment, setComment] = useState(""); // User's comment
  const [submitting, setSubmitting] = useState(false); // Review submission status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [anonymous, setAnonymous] = useState(false); // For anonymous reviews
  const [anonymousName, setAnonymousName] = useState(""); // For anonymous name
  const [reviewError, setReviewError] = useState(""); // For review error messages
  const [reviewsPerPage, setReviewsPerPage] = useState(2); // Changed from 3 to 2
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [activeTab, setActiveTab] = useState("all"); // Active filter tab
  const [sortOption, setSortOption] = useState("newest"); // Sort option

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // FETCH SPECIFIC FOOD ITEM DETAILS FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API call using slug (e.g., /food/momo/)
        const response = await axios.get(
          `http://127.0.0.1:8000/food/${food_slug}/`
        );
        setFood(response.data); // Success: set food detail
        setLoading(false); // Stop spinner
        // Fetch reviews for this food item
        fetchReviews();
      } catch (err) {
        setError("Failed to load food details"); // Error handling
        setLoading(false);
      }
    };
    fetchData(); // Component mount huda call huncha
  }, [food_slug]);

  // FETCH REVIEWS FOR THIS FOOD ITEM
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/food/${food_slug}/reviews/`
      );
      // Map the response data to match the component's expected structure
      const formattedReviews = response.data.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        user_name: review.user_name || review.username || "Anonymous",
        created_at: review.created_at,
      }));
      setReviews(formattedReviews);
      updateDisplayedReviews(formattedReviews, 1, "all", "newest");
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  // Update displayed reviews based on filters, sorting, and pagination
  const updateDisplayedReviews = (allReviews, page, tab, sort) => {
    // Filter reviews based on active tab
    let filteredReviews = [...allReviews];
    if (tab !== "all") {
      const ratingFilter = Number.parseInt(tab);
      filteredReviews = allReviews.filter(
        (review) => review.rating === ratingFilter
      );
    }

    // Sort reviews
    if (sort === "newest") {
      filteredReviews.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sort === "oldest") {
      filteredReviews.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (sort === "highest") {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    }

    // Paginate
    const startIndex = (page - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    setDisplayedReviews(filteredReviews.slice(0, endIndex));
  };

  // Effect to update displayed reviews when filters change
  useEffect(() => {
    if (reviews.length > 0) {
      updateDisplayedReviews(reviews, currentPage, activeTab, sortOption);
    }
  }, [currentPage, activeTab, sortOption, reviewsPerPage]);

  // Handle load more reviews
  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  // ADD ITEM TO CART FUNCTION
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token"); // Logged-in user ko token

    if (!token) {
      alert("Please log in to add items to your cart");
      return;
    }

    try {
      setAddedToCart(false); // New request aunu agadi status reset garincha
      // API call to add food item to cart
      const response = await axios.post(
        "http://127.0.0.1:8000/cart/",
        {
          food_item_id: food.id, // ID passed from fetched food detail
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `JWT ${token}`, // Protected endpoint
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Item added to cart:", response.data);
      setAddedToCart(true); // UI lai success message dekhauna
      // 3 second pachi confirmation message hide garincha
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error); // Debug help
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
      }
    }
  };

  // SUBMIT REVIEW FUNCTION
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    setReviewError("");
    setSubmitting(true);

    try {
      if (isLoggedIn) {
        // Authenticated user review
        const token = localStorage.getItem("token");
        await axios.post(
          `http://127.0.0.1:8000/food/${food_slug}/reviews/create/`,
          {
            rating: userRating,
            comment: comment,
            food: food.id, // Make sure to pass the food ID
          },
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else if (anonymous) {
        // Anonymous review
        await axios.post(
          `http://127.0.0.1:8000/food/${food_slug}/reviews/anonymous/`,
          {
            rating: userRating,
            comment: comment,
            user_name: anonymousName || "Anonymous",
            food: food.id, // Make sure to pass the food ID
          }
        );
      } else {
        setReviewError("Please log in or choose to review anonymously");
        setSubmitting(false);
        return;
      }

      // Reset form and refresh reviews
      setUserRating(0);
      setComment("");
      setAnonymousName("");
      fetchReviews();
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response && error.response.data.detail) {
        setReviewError(error.response.data.detail);
      } else {
        setReviewError("Failed to submit review. Please try again.");
      }
      setSubmitting(false);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Count reviews by rating
  const countReviewsByRating = (rating) => {
    return reviews.filter((review) => review.rating === rating).length;
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading delicious details...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  return (
    <div className="food-detail-container">
      {/** Food Detail Section **/}
      <div className="food-detail-page">
        <div className="food-image-container">
          <div className="food-image-section">
            <img
              src={food.food_img_url || images.defaultFoodImage}
              alt={food.food_name}
            />
            {food.food_type?.food_type && (
              <span className="food-badge">{food.food_type.food_type}</span>
            )}
          </div>
        </div>
        <div className="food-details">
          <h1 className="food-title">{food.food_name}</h1>
          <div className="food-rating">
            <div className="rating-summary">
              <span className="rating-value">{calculateAverageRating()}</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(calculateAverageRating())
                        ? "star filled"
                        : "star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">({reviews.length} reviews)</span>
            </div>
            <div className="rating-actions">
              <button
                className="view-reviews-btn"
                onClick={() =>
                  document
                    .querySelector(".reviews-container")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                View all reviews
              </button>
            </div>
          </div>
          <p className="food-description">{food.food_content}</p>
          <div className="food-meta">
            <div className="food-meta-item">
              <span className="meta-icon type-icon"></span>
              <div>
                <span className="meta-label">Type</span>
                <span className="meta-value">
                  {food.food_type?.food_type || "Traditional"}
                </span>
              </div>
            </div>
            <div className="food-meta-item">
              <span className="meta-icon taste-icon"></span>
              <div>
                <span className="meta-label">Taste</span>
                <span className="meta-value">
                  {food.taste?.taste_type || "Savory"}
                </span>
              </div>
            </div>
          </div>
          <div className="food-price-section">
            <p className="food-price">NPR {food.food_price}</p>
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          <div className="food-actions">
            <button
              className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <span className="check-icon">✓</span> Added to Cart
                </>
              ) : (
                <>
                  <span className="cart-icon"></span> Add to Cart
                </>
              )}
            </button>
            <button className="favorite-btn" aria-label="Add to favorites">
              <span className="heart-icon">♥</span>
            </button>
          </div>
        </div>
      </div>

      {/** Redesigned Reviews Section **/}
      <div className="reviews-container">
        <div className="reviews-header">
          <div className="reviews-title-row">
            <h2 className="reviews-title">Customer Reviews</h2>
            <button
              className="write-review-btn"
              onClick={() =>
                document
                  .getElementById("review-form")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Write a Review
            </button>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = countReviewsByRating(rating);
              const percentage = reviews.length
                ? (count / reviews.length) * 100
                : 0;
              return (
                <div
                  key={rating}
                  className={`rating-bar-item ${
                    activeTab === rating.toString() ? "active" : ""
                  }`}
                  onClick={() => handleTabChange(rating.toString())}
                >
                  <div className="rating-bar-label">
                    <span>{rating}</span>
                    <span className="star-icon">★</span>
                  </div>
                  <div className="rating-bar-wrapper">
                    <div
                      className="rating-bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="rating-bar-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="reviews-tabs-container">
          <div className="reviews-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`tab-btn ${
                  activeTab === rating.toString() ? "active" : ""
                }`}
                onClick={() => handleTabChange(rating.toString())}
              >
                {rating} Stars ({countReviewsByRating(rating)})
              </button>
            ))}
          </div>
          <div className="reviews-sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="reviews-content">
          {displayedReviews.length === 0 ? (
            <div className="no-reviews-message">
              <div className="no-reviews-icon">📝</div>
              <h3>No reviews yet</h3>
              <p>Be the first to share your experience with this dish!</p>
            </div>
          ) : (
            <>
              <div className="reviews-list">
                {displayedReviews.map((review, index) => (
                  <div key={review.id || index} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-profile">
                        <div className="reviewer-avatar">
                          {review.user_name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="reviewer-details">
                          <div className="reviewer-name">
                            {review.user_name || "Anonymous"}
                          </div>
                          <div className="review-date">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating-badge">
                        <span className="rating-number">{review.rating}</span>
                        <span className="rating-star">★</span>
                      </div>
                    </div>
                    <div className="review-card-body">
                      <p className="review-text">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              {displayedReviews.length <
                reviews.filter(
                  (review) =>
                    activeTab === "all" ||
                    review.rating === Number.parseInt(activeTab)
                ).length && (
                <div className="load-more-container">
                  <button className="load-more-btn" onClick={handleLoadMore}>
                    Load More Reviews
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div id="review-form" className="review-form-section">
          <h3 className="review-form-title">Share Your Experience</h3>
          {reviewError && (
            <div className="review-error-message">{reviewError}</div>
          )}
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-row">
              <div className="form-group rating-group">
                <label className="form-label">Rating</label>
                <div className="rating-stars">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <span
                        key={index}
                        className={`rating-star ${
                          ratingValue <= (hoverRating || userRating)
                            ? "filled"
                            : ""
                        }`}
                        onClick={() => setUserRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
                <span className="rating-text">
                  {userRating === 1 && "Poor"}
                  {userRating === 2 && "Fair"}
                  {userRating === 3 && "Good"}
                  {userRating === 4 && "Very Good"}
                  {userRating === 5 && "Excellent"}
                </span>
              </div>

              {!isLoggedIn && (
                <div className="form-group anonymous-group">
                  <div className="anonymous-option">
                    <input
                      type="checkbox"
                      id="anonymous-review"
                      checked={anonymous}
                      onChange={() => setAnonymous(!anonymous)}
                      className="checkbox-input"
                    />
                    <label
                      htmlFor="anonymous-review"
                      className="checkbox-label"
                    >
                      Post as anonymous
                    </label>
                  </div>

                  {anonymous && (
                    <input
                      type="text"
                      id="anonymous-name"
                      className="form-input"
                      value={anonymousName}
                      onChange={(e) => setAnonymousName(e.target.value)}
                      placeholder="Display name (optional)"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="review-comment">
                Review
              </label>
              <textarea
                id="review-comment"
                className="form-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this dish..."
                rows={3}
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-review-btn"
                disabled={
                  userRating === 0 || submitting || (!isLoggedIn && !anonymous)
                }
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

              {!isLoggedIn && !anonymous && (
                <p className="login-prompt">
                  <a href="/login" className="login-link">
                    Log in
                  </a>{" "}
                  or check the box to post anonymously
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
