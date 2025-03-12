import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Initialize state by checking if there's a token in localStorage
  isUserAuthenticated: !!localStorage.getItem("token"),
  // Function to update the authentication state
  setIsUserAuthenticated: (value) => set({ isUserAuthenticated: value }),
}));

export default useAuthStore;
