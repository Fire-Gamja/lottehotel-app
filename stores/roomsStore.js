import { create } from "zustand";


const DEFAULT_ROOMS = {

    "시그니엘 서울": [
        {
            id: "grand-double-city-view-bath",
            name: "그랜드 더블 시티뷰",
            type: "더블",
            view: "시티",
            size: "40~50㎡",
            remaining: 1,
            thumbnail: require("../assets/commingsoon.webp"),
        }, 
        {
            id: "grand-double-city-view-bath",
            name: "그랜드 더블 리버뷰",
            type: "더블",
            view: "리버",
            size: "40~50㎡",
            remaining: 2,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "premier-double-city-view",
            name: "프리미어 더블 시티뷰",
            type: "더블",
            view: "시티",
            size: "46~60㎡",
            remaining: 3,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "premier-double-river-view",
            name: "프리미어 더블 리버뷰",
            type: "더블",
            view: "리버",
            size: "46~60㎡",
            remaining: 4,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "deluxe-twin-city",
            name: "디럭스 트윈 시티뷰",
            type: "트윈",
            view: "시티",
            size: "40㎡",
            remaining: 5,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "suite-double-river",
            name: "스위트 더블 리버뷰",
            type: "더블",
            view: "리버",
            size: "55㎡",
            remaining: 2,
            thumbnail: require("../assets/commingsoon.webp"),
        }
    ],

    "롯데호텔 서울": [
        {
            id: "premier-double-city-view-bath",
            name: "프리미어 더블 시티뷰 (전망욕실)",
            type: "더블",
            view: "시티 (전망욕실)",
            size: "46~60㎡",
            remaining: 3,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "deluxe-twin-city",
            name: "디럭스 트윈 시티뷰",
            type: "트윈",
            view: "시티",
            size: "40㎡",
            remaining: 5,
            thumbnail: require("../assets/commingsoon.webp"),
        },
        {
            id: "suite-double-river",
            name: "스위트 더블 리버뷰",
            type: "더블",
            view: "리버",
            size: "55㎡",
            remaining: 2,
            thumbnail: require("../assets/commingsoon.webp"),
        },
    ],
    "롯데호텔 부산": [
        {
            id: "deluxe-double-ocean",
            name: "디럭스 더블 오션뷰",
            type: "더블",
            view: "오션",
            size: "48㎡",
            remaining: 4,
            thumbnail: require("../assets/commingsoon.webp"),
        },
    ],
};


const useRoomsStore = create((set, get) => ({
    roomsByHotel: DEFAULT_ROOMS,


    setRoomsForHotel: (hotelName, rooms) =>
        set((state) => ({
            roomsByHotel: { ...state.roomsByHotel, [hotelName]: rooms },
        })),


    getRoomsForHotel: (hotelName) => {
        const map = get().roomsByHotel || {};
        return map[hotelName] || [];
    },


    decreaseRoomCount: (hotelName, roomId) => {
        set((state) => {
            const list = state.roomsByHotel[hotelName] || [];
            const updated = list.map((r) =>
                r.id === roomId && r.remaining > 0 ? { ...r, remaining: r.remaining - 1 } : r
            );
            return { roomsByHotel: { ...state.roomsByHotel, [hotelName]: updated } };
        });
    },
}));


export default useRoomsStore;