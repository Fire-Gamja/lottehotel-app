import { create } from 'zustand';

// 홈 화면의 상태(스크롤, 배너 슬라이드)를 관리하는 중앙 저장소
const useHomeStore = create((set) => ({
  // --- States (상태) ---
  isScrolled: false, // 스크롤 되었는지 여부
  slideIndex: 1,     // 현재 배너 슬라이드 번호
  slideIntervalId: null, // 배너 자동 넘김을 위한 ID

  // --- Actions (상태 변경 함수) ---

  // isScrolled 상태를 변경하는 함수
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),

  // 배너 슬라이드 번호를 다음으로 넘기는 함수
  nextSlide: () => set((state) => ({
    slideIndex: state.slideIndex < 4 ? state.slideIndex + 1 : 1
  })),

  // 배너 자동 넘김 시작 함수
  startSlideInterval: () => {
    // 이미 실행 중인 인터벌이 있다면 중복 실행 방지
    const { slideIntervalId, nextSlide } = useHomeStore.getState();
    if (slideIntervalId) return;

    const intervalId = setInterval(nextSlide, 6000);
    set({ slideIntervalId: intervalId });
  },

  // 배너 자동 넘김 중지 함수
  clearSlideInterval: () => {
    const { slideIntervalId } = useHomeStore.getState();
    if (slideIntervalId) {
      clearInterval(slideIntervalId);
      set({ slideIntervalId: null });
    }
  },
}));

export default useHomeStore;

