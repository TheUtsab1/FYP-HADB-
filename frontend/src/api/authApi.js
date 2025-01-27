const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to register user.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error; // Rethrow the error for higher-level handling
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to login.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error; // Rethrow the error for higher-level handling
  }
}
