import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Check for "token" instead of "access" to match what you store in Login component
  isUserAuthenticated: !!localStorage.getItem("token"),

  setIsUserAuthenticated: (value) => set({ isUserAuthenticated: value }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    set({ isUserAuthenticated: false });
  },
}));

export default useAuthStore;
