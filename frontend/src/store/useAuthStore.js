import { create } from "zustand";

const useAuthStore = create((set) => ({
  isUserAuthenticated: !!localStorage.getItem("access"), // initial check

  setIsUserAuthenticated: (value) => set({ isUserAuthenticated: value }),

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ isUserAuthenticated: false });
  },
}));

export default useAuthStore;
