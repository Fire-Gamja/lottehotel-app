// stores/bookingStore.js
import { create } from 'zustand';

const useBookingStore = create((set) => ({
  hotelList: [],
  startDate: null,
  endDate: null,
  guests: [], 
  setHotelList: (list) => set({ hotelList: list }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  clearHotels: () => set({ hotelList: [] }),
  clearDates: () => set({ startDate: null, endDate: null }),
  setGuests: (rooms) => set({ guests: rooms }),
}));

export default useBookingStore;