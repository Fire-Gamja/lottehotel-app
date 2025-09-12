// stores/bookingStore.js
import { create } from 'zustand';

const useBookingStore = create((set) => ({
  hotelList: [],                 // ["롯데호텔 서울", "L7 명동...", ...]
  startDate: null,
  endDate: null,
  setHotelList: (list) => set({ hotelList: list }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  clearHotels: () => set({ hotelList: [] }),
  clearDates: () => set({ startDate: null, endDate: null }),
  clearAll: () => set({ hotelList: [], startDate: null, endDate: null }),
}));

export default useBookingStore;
