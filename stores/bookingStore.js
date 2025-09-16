// stores/bookingStore.js
import { create } from 'zustand';

const useBookingStore = create((set, get) => ({
  // Current draft (used while user is in the flow)
  hotelList: [],
  startDate: null,
  endDate: null,
  guests: [],

  // Snapshot to offer "resume" on the home screen
  resumeSnapshot: null, // { hotelList, startDate, endDate, guests, savedAt }

  // Mutators for current draft
  setHotelList: (list) => set({ hotelList: list || [] }),
  setDates: (start, end) => set({ startDate: start, endDate: end }),
  setGuests: (rooms) => set({ guests: rooms || [] }),
  clearHotels: () => set({ hotelList: [] }),
  clearDates: () => set({ startDate: null, endDate: null }),
  clearGuests: () => set({ guests: [] }),
  clearCurrentDraft: () => set({ hotelList: [], startDate: null, endDate: null, guests: [] }),

  // Save/Load resume
  saveProgressFromCurrent: () => {
    const { hotelList, startDate, endDate, guests } = get();
    set({ resumeSnapshot: { hotelList, startDate, endDate, guests, savedAt: Date.now() } });
  },
  loadResumeToCurrent: () => {
    const snap = get().resumeSnapshot;
    if (!snap) return;
    set({ hotelList: snap.hotelList || [], startDate: snap.startDate || null, endDate: snap.endDate || null, guests: snap.guests || [] });
  },
  dismissResume: () => set({ resumeSnapshot: null }),
}));

export default useBookingStore;
