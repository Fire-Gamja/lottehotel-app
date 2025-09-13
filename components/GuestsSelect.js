// components/GuestsSelect.js
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useBookingStore from "../stores/bookingStore"; // ← 저장 원치 않으면 이 줄과 setGuests 사용 부분만 지우면 됩니다.

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
const ACCENT = "#8a6a54";

const MAX_ROOMS = 3;
const MAX_ADULTS = 2;
const MIN_ADULTS = 1;
const MAX_CHILDREN = 1;
const MIN_CHILDREN = 0;

export default function GuestsSelect() {
    const navigation = useNavigation();

    // ✅(선택) zustand에 적용: guests = [{adults, children}, ...]
    const setGuests = useBookingStore((s) => s.setGuests);
    const prevGuests = useBookingStore((s) => s.guests);

    // 초기 상태: 이전 값 있으면 사용, 없으면 객실1(성인2/어린이0)
    const [rooms, setRooms] = useState(
        Array.isArray(prevGuests) && prevGuests.length > 0
            ? prevGuests
            : [{ adults: 2, children: 0 }]
    );

    // 슬라이드 애니메이션 (아래→위 등장)
    const animY = useRef(new Animated.Value(SCREEN_H)).current;
    useEffect(() => {
        Animated.timing(animY, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [animY]);

    const closeDown = () => {
        Animated.timing(animY, {
            toValue: SCREEN_H,
            duration: 240,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => finished && navigation.pop(1));
    };

    // 조작 핸들러
    const addRoom = () => {
        if (rooms.length >= MAX_ROOMS) return;
        setRooms((r) => [...r, { adults: 2, children: 0 }]);
    };
    const removeRoom = (idx) => {
        setRooms((r) => r.filter((_, i) => i !== idx));
    };

    const incAdults = (idx) =>
        setRooms((r) =>
            r.map((room, i) =>
                i === idx ? { ...room, adults: Math.min(MAX_ADULTS, room.adults + 1) } : room
            )
        );
    const decAdults = (idx) =>
        setRooms((r) =>
            r.map((room, i) =>
                i === idx ? { ...room, adults: Math.max(MIN_ADULTS, room.adults - 1) } : room
            )
        );

    const incChildren = (idx) =>
        setRooms((r) =>
            r.map((room, i) =>
                i === idx
                    ? { ...room, children: Math.min(MAX_CHILDREN, room.children + 1) }
                    : room
            )
        );
    const decChildren = (idx) =>
        setRooms((r) =>
            r.map((room, i) =>
                i === idx
                    ? { ...room, children: Math.max(MIN_CHILDREN, room.children - 1) }
                    : room
            )
        );

    const onConfirm = () => {
        // ✅ (선택) 전역 저장
        setGuests && setGuests(rooms);
        closeDown();
    };

    return (
        <Animated.View style={[s.container, { transform: [{ translateY: animY }] }]}>
            {/* Header */}
            <View style={s.header}>
                <Image
                    source={{
                        uri:
                            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop",
                    }}
                    style={s.headerBg}
                    resizeMode="cover"
                />
                <View style={s.headerOverlay} />
                <View style={s.headerBar}>
                    <Text style={s.headerTitle}>객실/인원</Text>
                    <Text style={s.headerCap}>최대 {MAX_ROOMS}개</Text>
                </View>

                <Pressable style={s.closeBtn} onPress={closeDown}>
                    <Text style={s.closeTxt}>×</Text>
                </Pressable>
            </View>

            {/* Body */}
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {rooms.map((room, idx) => {
                    const aDisabledMinus = room.adults <= MIN_ADULTS;
                    const aDisabledPlus = room.adults >= MAX_ADULTS;
                    const cDisabledMinus = room.children <= MIN_CHILDREN;
                    const cDisabledPlus = room.children >= MAX_CHILDREN;

                    return (
                        <View key={idx} style={s.roomCard}>
                            <View style={s.roomHeader}>
                                <Text style={s.roomTitle}>객실 {idx + 1}</Text>
                                {idx === 0 ? (
                                    <Pressable style={s.kidsAgeBtn}>
                                        <Text style={s.kidsAgeTxt}>어린이 연령 정보 〉</Text>
                                    </Pressable>
                                ) : (
                                    <Pressable onPress={() => removeRoom(idx)}>
                                        <Text style={s.removeTxt}>삭제</Text>
                                    </Pressable>
                                )}
                            </View>

                            <View style={s.divider} />

                            {/* Adults */}
                            <CounterRow
                                label="성인"
                                value={room.adults}
                                onMinus={() => decAdults(idx)}
                                onPlus={() => incAdults(idx)}
                                minusDisabled={aDisabledMinus}
                                plusDisabled={aDisabledPlus}
                            />

                            {/* Children */}
                            <CounterRow
                                label="어린이"
                                value={room.children}
                                onMinus={() => decChildren(idx)}
                                onPlus={() => incChildren(idx)}
                                minusDisabled={cDisabledMinus}
                                plusDisabled={cDisabledPlus}
                            />
                        </View>
                    )
                })}

                {/* Add room */}
                <Pressable style={s.addRoomBtn} onPress={addRoom} disabled={rooms.length >= MAX_ROOMS}>
                    <Text style={[s.addRoomTxt, rooms.length >= MAX_ROOMS && s.addRoomDisabled]}>
                        객실 추가
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Bottom bar */}
            <View style={s.bottomBar}>
                <Pressable style={s.confirmBtn} onPress={onConfirm}>
                    <Text style={s.confirmTxt}>선택</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

/* ---------- Subcomponents ---------- */
function CounterRow({ label, value, onMinus, onPlus, minusDisabled, plusDisabled }) {
    return (
        <View style={s.counterRow}>
            <Text style={s.counterLabel}>{label}</Text>

            <View style={s.counterControls}>
                <CircleBtn label="−" disabled={minusDisabled} onPress={onMinus} />
                <Text style={s.counterValue}>{value}</Text>
                <CircleBtn label="＋" disabled={plusDisabled} onPress={onPlus} />
            </View>
        </View>
    );
}

function CircleBtn({ label, onPress, disabled }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[s.circleBtn, disabled && s.circleBtnDisabled]}
        >
            <Text style={[s.circleBtnTxt, disabled && s.circleBtnTxtDisabled]}>{label}</Text>
        </Pressable>
    );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: "#fff",
    },

    header: { height: 150, width: "100%" },
    headerBg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
    headerBar: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingBottom: 12,
        flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
    headerCap: { color: "#fff", opacity: 0.95, fontSize: 12 },

    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeTxt: {
        color: '#fff',
        fontWeight: "100",
        fontSize: 40,
    },

    roomCard: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
    roomHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    roomTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
    kidsAgeBtn: { padding: 6 },
    kidsAgeTxt: { color: "#111" },
    removeTxt: { color: "#8f8f94", textDecorationLine: "underline" },

    divider: { height: 1, backgroundColor: "#EDEDEF", marginVertical: 12 },

    counterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
    },
    counterLabel: { fontSize: 16, color: "#111" },
    counterControls: { flexDirection: "row", alignItems: "center", gap: 22 },
    counterValue: { width: 40, textAlign: "center", fontSize: 18, fontWeight: "600", color: "#111" },

    circleBtn: {
        width: 32, height: 32, borderRadius: 22,
        borderWidth: 1, borderColor: "#e5e5ea",
        alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
    },
    circleBtnDisabled: { backgroundColor: "#f5f5f7" },
    circleBtnTxt: { fontSize: 20, color: "#111" },
    circleBtnTxtDisabled: { color: "#c9c9ce" },

    addRoomBtn: { paddingVertical: 18, alignItems: "center" },
    addRoomTxt: { color: "#111", textDecorationLine: "underline", fontSize: 15 },
    addRoomDisabled: { color: "#c4c4c7", textDecorationLine: "none" },

    bottomBar: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        backgroundColor: "#111",
    },
    confirmBtn: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
    },
    confirmTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});