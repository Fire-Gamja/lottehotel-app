// DateSelect.js  (React Native - Check-in/Out range picker)
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import useBookingStore from '../stores/bookingStore';
const setDates = useBookingStore((s) => s.setDates);
const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
const ACCENT = "#8a6a54";
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

/* ---------- utils ---------- */
const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => stripTime(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
const addMonths = (base, n) => new Date(base.getFullYear(), base.getMonth() + n, 1);
const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a, b) => stripTime(a).getTime() < stripTime(b).getTime();
const isBetween = (d, start, end) =>
    start && end && stripTime(d).getTime() > stripTime(start).getTime() && stripTime(d).getTime() < stripTime(end).getTime();

function getMonthMatrix(year, month) {
    const first = new Date(year, month, 1);
    const startIdx = first.getDay(); // 0: Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startIdx; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
}

/* ---------- component ---------- */
export default function DateSelect({
    monthsToShow = 3,         // 현재 달 포함 3개월
    onConfirm,                // (startDate, endDate)
    onClose,                  // 닫기 콜백
    initialStart,             // 있으면 우선 적용
    initialEnd,
}) {
    const navigation = useNavigation();
    const route = useRoute();
    const popAfterConfirm = Number(route.params?.popAfterConfirm ?? 1);
    const onPicked = route.params?.onPicked;
    // 오늘/익일 기본값
    const today = stripTime(new Date());
    const defaultStart = initialStart ? stripTime(initialStart) : today;
    const defaultEnd = initialEnd ? stripTime(initialEnd) : addDays(today, 1);

    // 상한일: 현재 달 + (monthsToShow-1)개월의 말일  (3개월만 표시/선택)
    const cappedMonths = Math.max(1, Math.min(3, monthsToShow));
    const maxDate = stripTime(new Date(today.getFullYear(), today.getMonth() + cappedMonths, 0));

    const [start, setStart] = useState(defaultStart > maxDate ? maxDate : defaultStart);
    const [end, setEnd] = useState(defaultEnd > maxDate ? maxDate : defaultEnd);
    const [closing, setClosing] = useState(false);
    // 등장/퇴장 애니메이션
    const animY = useRef(new Animated.Value(SCREEN_H)).current;
    useEffect(() => {
        Animated.timing(animY, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [animY]);

    const slideDownClose = () => {
        setClosing(true);
        Animated.timing(animY, {
            toValue: SCREEN_H,
            duration: 240,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (!finished) return;
            // route 기반으로 스스로 pop (HotelSelect에서 replace로 들어왔으면 Reservation으로 복귀)
            navigation.pop(1);
            // 필요하면 onClose도 병행 호출
            onClose && onClose();
        });
    };

    // 월 생성 (현재 달부터 cappedMonths 개)
    const months = useMemo(() => {
        const list = [];
        for (let i = 0; i < cappedMonths; i++) {
            const mDate = addMonths(today, i);
            list.push({
                year: mDate.getFullYear(),
                month: mDate.getMonth(),
                matrix: getMonthMatrix(mDate.getFullYear(), mDate.getMonth()),
            });
        }
        return list;
    }, [today, cappedMonths]);

    const handlePick = (date) => {
        if (!date) return;
        const t = stripTime(date).getTime();
        if (t < today.getTime() || t > maxDate.getTime()) return; // 범위 가드

        if (!start || (start && end)) {
            setStart(date);
            setEnd(null);
        } else if (start && !end) {
            if (isBefore(date, start) || isSameDay(date, start)) setStart(date);
            else setEnd(date);
        }
    };

    const canConfirm = !!start && !!end;

    const handleConfirm = () => {
        if (!canConfirm) return;
        setClosing(true);
        Animated.timing(animY, {
            toValue: SCREEN_H,
            duration: 240,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (!finished) return;
            // 먼저 콜백으로 값 전달
            setDates(start, end);
            // 그리고 스택에서 제거
            navigation.pop(popAfterConfirm);
        });
    };

    return (
        <Animated.View
            pointerEvents={closing ? "none" : "auto"}   // ✅ 닫힐 때 터치 통과
            style={[s.container, { transform: [{ translateY: animY }] }]}
        >
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
                    <Text style={s.headerTitle}>체크인/아웃</Text>
                </View>
                <Pressable style={s.closeBtn} onPress={slideDownClose}>
                    <Text style={s.closeTxt}>×</Text>
                </Pressable>
            </View>

            {/* 요일 */}
            <View style={s.dowRow}>
                {DOW.map((d, i) => (
                    <Text
                        key={d}
                        style={[
                            s.dowTxt,
                            i === 0 && { color: "#d73a49" },
                            i === 6 && { color: "#2f6feb" },
                        ]}
                    >
                        {d}
                    </Text>
                ))}
            </View>

            {/* 달력 */}
            <ScrollView bounces={false} overScrollMode="never">
                {months.map(({ year, month, matrix }) => (
                    <View key={`${year}-${month}`} style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                        <Text style={s.monthTitle}>
                            {year}. {(month + 1).toString().padStart(2, "0")}
                        </Text>

                        {matrix.map((week, rIdx) => (
                            <View key={rIdx} style={s.weekRow}>
                                {week.map((date, cIdx) => {
                                    const isEmpty = !date;
                                    const d = date ? stripTime(date) : null;
                                    const isPast = d ? d.getTime() < today.getTime() : false;
                                    const isOver = d ? d.getTime() > maxDate.getTime() : false;
                                    const disabled = isEmpty || isPast || isOver;

                                    const selectedStart = start && d && isSameDay(d, start);
                                    const selectedEnd = end && d && isSameDay(d, end);
                                    const inRange = d && isBetween(d, start, end);

                                    return (
                                        <View key={cIdx} style={s.dayCellWrap}>
                                            {(inRange || selectedStart || selectedEnd) && (
                                                <View
                                                    style={[
                                                        s.rangeBg,
                                                        inRange && { borderRadius: 0 },
                                                        selectedStart && { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
                                                        selectedEnd && { borderTopRightRadius: 16, borderBottomRightRadius: 16 },
                                                        selectedStart && !end && { borderRadius: 16 },
                                                    ]}
                                                />
                                            )}

                                            <Pressable
                                                disabled={disabled}
                                                onPress={() => handlePick(d)}
                                                style={[
                                                    s.dayBtn,
                                                    disabled && s.dayDisabledBtn,
                                                    (selectedStart || selectedEnd) && s.daySelected,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        s.dayTxt,
                                                        disabled && s.dayDisabledTxt,
                                                        (selectedStart || selectedEnd) && { color: "#fff", fontWeight: "700" },
                                                    ]}
                                                >
                                                    {date ? date.getDate() : ""}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* 하단 선택 바 */}
            <View style={s.bottomBar}>
                <Pressable
                    onPress={handleConfirm}
                    disabled={!canConfirm}
                    style={[s.confirmBtn, !canConfirm && s.confirmDisabled]}
                >
                    <Text style={s.confirmTxt}>
                        {canConfirm
                            ? `선택  •  ${start.getMonth() + 1}/${start.getDate()} → ${end.getMonth() + 1}/${end.getDate()}`
                            : "선택"}
                    </Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

/* ---------- styles ---------- */
const COL = 7;
const CELL_W = Math.floor((SCREEN_W - 32) / COL); // 좌우 16px padding

const s = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0, right: 0, top: 0, bottom: 0,
        backgroundColor: "#fff",
    },

    header: { height: 112, width: "100%" },
    headerBg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
    headerBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 12 },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

    closeBtn: {
        position: "absolute", top: 40, right: 12,
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center", justifyContent: "center",
    },
    closeTxt: { color: "#fff", fontSize: 18, lineHeight: 18 },

    dowRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dowTxt: { width: CELL_W, textAlign: "center", fontSize: 13, color: "#6b7280" },

    monthTitle: { marginTop: 14, marginBottom: 8, fontSize: 16, fontWeight: "700", color: "#111" },

    weekRow: { flexDirection: "row", justifyContent: "space-between" },
    dayCellWrap: {
        width: CELL_W,
        height: CELL_W,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    rangeBg: { position: "absolute", left: 0, right: 0, top: 8, bottom: 8, backgroundColor: "#e9ddd6" },

    dayBtn: {
        width: CELL_W - 10,
        height: CELL_W - 10,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    daySelected: { backgroundColor: ACCENT },
    dayTxt: { fontSize: 15, color: "#111" },

    // 지난 날짜/상한 밖 회색 처리
    dayDisabledTxt: { color: "#c4c4c7" },

    bottomBar: {
        position: "absolute", left: 0, right: 0, bottom: 0,
        backgroundColor: "#111",
        paddingVertical: 14,
    },
    confirmBtn: {
        marginHorizontal: 16,
        height: 44,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ACCENT,
    },
    confirmDisabled: { backgroundColor: "#3f3f46" },
    confirmTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
