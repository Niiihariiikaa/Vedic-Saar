import { createContext, useContext, useState, useCallback } from "react";
import BookingModal from "./BookingModal";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");

  const openBooking = useCallback((service = "") => {
    setPreselectedService(service);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setPreselectedService("");
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBooking}
        preselectedService={preselectedService}
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}