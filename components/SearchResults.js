import React, { useMemo, useState, useCallback, memo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Color from "../components/styles/color";
import useBookingStore from "../stores/bookingStore";
import { getHotelByName } from "../stores/hotelCatalog";
import useRoomsStore from "../stores/roomsStore";

const { width } = Dimensions.get("window");
const H_PADDING = 16;
const THUMB_W = width - H_PADDING * 2;
const THUMB_H = Math.round((THUMB_W * 9) / 16);

// 금액 포맷
const fmtKRW = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 텍스트 체크박스
const Check = memo(({ checked }) => (
  <View style={[s.cbBox, checked ? s.cbBoxOn : s.cbBoxOff]}>
    {checked ? <Text style={s.cbMark}>✓</Text> : null}
  </View>
));

/* =================== 헤더 =================== */
const Header = memo(function Header({ onBack }) {
  return (
    <View style={s.headerWrap}>
      <View style={s.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={s.iconBtn}>
          <Text style={s.iconTxt}>←</Text>
        </Pressable>
        {/* (상상 금지: 가운데 타이틀 없음) */}
        <Pressable accessibilityRole="button" style={s.iconBtn}>
          <Text style={s.iconTxt}>≡</Text>
        </Pressable>
      </View>

      {/* 아래: 좌측 '객실 선택' + 우측 단계(1~4) */}
      <View style={s.stepRow}>
        <Text style={s.stepLabel}>객실 선택</Text>
        <View style={s.stepDots}>
          <View style={[s.stepDot, s.stepPast]}>
            <Text style={s.stepNumPast}>1</Text>
          </View>
          <View style={[s.stepDot, s.stepCurrent]}>
            <Text style={s.stepNumCurrent}>2</Text>
          </View>
          <View style={[s.stepDot, s.stepFuture]}>
            <Text style={s.stepNumFuture}>3</Text>
          </View>
          <View style={[s.stepDot, s.stepFuture]}>
            <Text style={s.stepNumFuture}>4</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

/* ============== 예약정보 (회색 배경 · 세로) ============== */
const BookingInfo = memo(function BookingInfo({ hotelName }) {
  const meta = getHotelByName(hotelName) || {};
  return (
    <View style={s.infoWrap}>
      {/* {name} > */}
      <View style={[s.infoRow, { marginBottom: 6 }]}>
        <Text style={[s.infoValue, { fontWeight: "800" }]} numberOfLines={1}>
          {hotelName || meta?.name || "-"}
        </Text>
        <Text style={{ marginLeft: 6, color: "#999" }}>{">"}</Text>
      </View>

      {/* 호텔성급 | {star} */}
      <InfoRow label="호텔성급" value={meta?.star || "-"} />
      {/* 주소 | {address} */}
      <InfoRow label="주소" value={meta?.address || "-"} />
      {/* 체크인/아웃 | 15:00 / 11:00 */}
      <InfoRow label="체크인/아웃" value="15:00 / 11:00" />

      {/* 아래 버튼: ♡ 관심 */}
      <Pressable accessibilityRole="button" style={s.likeBtnBottom}>
        <Text style={s.likeTxt}>♡ 관심</Text>
      </Pressable>
    </View>
  );
});

const InfoRow = memo(({ label, value }) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoSep}> | </Text>
    <Text style={s.infoValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
));

/* ================= 상단 CTA (주황) ================= */
const TopCTA = memo(() => (
  <Pressable accessibilityRole="button" style={s.topCta}>
    <Text style={s.topCtaTxt}>최저가로 바로 예약하기 →</Text>
  </Pressable>
));

/* ===================== 탭 ===================== */
const Tabs = memo(function Tabs({ tab, onChange }) {
  return (
    <View style={s.tabsRow}>
      <Pressable
        accessibilityRole="button"
        onPress={() => onChange("room")}
        style={[s.tabBtn, tab === "room" ? s.tabOn : s.tabOff]}
      >
        <Text style={[s.tabTxt, tab === "room" ? s.tabTxtOn : s.tabTxtOff]}>
          룸 프로모션
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => onChange("pkg")}
        style={[s.tabBtn, tab === "pkg" ? s.tabOn : s.tabOff]}
      >
        <Text style={[s.tabTxt, tab === "pkg" ? s.tabTxtOn : s.tabTxtOff]}>
          패키지
        </Text>
      </Pressable>
    </View>
  );
});

/* ============ 필터/정렬 + 세금 체크 ============ */
const FiltersBar = memo(function FiltersBar({ taxIncluded, onToggleTax }) {
  return (
    <View style={s.filterWrap}>
      <View style={s.filterRow}>
        <Pressable accessibilityRole="button" style={s.chip}>
          <Text style={s.chipTxt}>낮은 요금순 ▾</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={s.chip}>
          <Text style={s.chipTxt}>침대타입 ▾</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={s.chip}>
          <Text style={s.chipTxt}>전망타입 ▾</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[s.chip, s.chipIcon]}
        >
          <Text style={s.chipTxt}>↻</Text>
        </Pressable>
      </View>

      {/* 3px black line */}
      <View style={s.filterBorder} />

      {/* 우측 체크박스 */}
      <Pressable
        accessibilityRole="button"
        onPress={onToggleTax}
        style={s.taxRow}
      >
        <Check checked={taxIncluded} />
        <Text style={s.taxTxt}>세금,봉사료 포함 보기</Text>
      </Pressable>
    </View>
  );
});

/* ================== 객실 카드 ================== */
const RoomCard = memo(function RoomCard({
  room,
  index,
  basePrice,
  taxIncluded,
}) {
  // 객실이 아래로 갈수록 20% 증가
  const adjusted = useMemo(
    () => basePrice * Math.pow(1.2, index),
    [basePrice, index]
  );
  const visiblePrice = useMemo(
    () => (taxIncluded ? adjusted : adjusted * 0.95),
    [adjusted, taxIncluded]
  );

  return (
    <View style={s.card}>
      {/* 썸네일 + 좌상단 잔여 객실 배지 */}
      <View>
        <Image
          source={room.thumbnail || require("../assets/commingsoon.webp")}
          style={s.thumb}
          resizeMode="cover"
        />
        <View style={s.remainBadge}>
          <Text style={s.remainTxt}>잔여 객실 {room.remaining ?? 0}개</Text>
        </View>
      </View>

      <View style={s.cardBody}>
        {/* 객실명(굵게) */}
        <Text style={s.roomName} numberOfLines={1}>
          {room.name}
        </Text>
        {/* 하단 메타: 타입 | 뷰 | 면적 */}
        <Text style={s.roomMeta} numberOfLines={1}>
          {room.type} | {room.view} | {room.size}
        </Text>

        {/* === 금액 영역(전체 박스: 라운드, 1px 연회색, 하단 그림자) === */}
        <View style={s.priceArea}>
          {/* 상단: 좌측 태그(리워즈회원, border=primary) + 우측 하트 */}
          <View style={s.priceRow}>
            <View style={s.rewardsTag}>
              <Text style={s.rewardsTagTxt}>리워즈회원</Text>
            </View>
            <Text style={s.heart}>♡</Text>
          </View>

          {/* 일반요금 > (블랙) */}
          <View style={s.normalRow}>
            <Text style={s.normalTxt}>일반요금 &gt;</Text>
          </View>

          {/* 버튼1: 채움(primary) 중앙정렬 · 금액 굵게(700) 흰색 */}
          <Pressable accessibilityRole="button" style={s.btnPrimary}>
            <Text style={s.btnPrimaryLbl}>리워즈 회원 요금</Text>
            <Text style={s.btnPrimaryPrice}>{`₩${fmtKRW(
              visiblePrice
            )} KRW`}</Text>
          </Pressable>

          {/* 버튼2: 외곽선(primary) 배경 없음 · 라벨/금액 검정 · 금액 700 · 중앙정렬 */}
          <Pressable accessibilityRole="button" style={s.btnOutline}>
            <Text style={s.btnOutlineLbl}>일반요금</Text>
            <Text style={s.btnOutlinePrice}>{`₩${fmtKRW(
              visiblePrice
            )} KRW`}</Text>
          </Pressable>
        </View>

        {/* 하단 우측: 리워즈 회원 혜택 + ? */}
        <View style={s.benefitRow}>
          <Text style={s.benefitHint}>리워즈 회원 혜택</Text>
          <View style={s.qCircle}>
            <Text style={s.qTxt}>?</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

/* ===================== 화면 ===================== */
export default function SearchResults() {
  const navigation = useNavigation();
  const hotelList = useBookingStore(s => s.hotelList);
  const hotel = hotelList.length > 0 ? hotelList[0] : "";
  const baseFromStore = useBookingStore(s => s.price);

  // 호텔 이름
  const roomsByHotel = useRoomsStore(s => s.roomsByHotel);
  const hotelName = useMemo(() => {
    if (typeof hotel === "string") return hotel.trim();
    if (hotel?.name) return hotel.name.trim();
    return "";
  }, [hotel]);
  const EMPTY = useRef([]).current; // 항상 동일 참조
  const rooms = useMemo(() => roomsByHotel?.[hotelName] ?? EMPTY, [roomsByHotel, hotelName]);
  // 기준가: DateSelect.js에서 온 값, 없으면 안전한 fallback
  const basePrice = useMemo(() => {
    const n = typeof baseFromStore === "string" ? parseInt(baseFromStore, 10) : baseFromStore;
    return Number.isFinite(n) ? n : 180000; // index 0 카드가 DateSelect 금액과 동일
  }, [baseFromStore]);

  const [tab, setTab] = useState("room");
  const [taxIncluded, setTaxIncluded] = useState(true);
  console.log("hotel from bookingStore:", hotel);
  console.log("resolved hotelName:", hotelName);
  console.log("roomsByHotel keys:", Object.keys(roomsByHotel || {}));
  const renderItem = useCallback(
    ({ item, index }) => (
      <RoomCard
        room={item}
        index={index}
        basePrice={basePrice}
        taxIncluded={taxIncluded}
      />
    ),
    [basePrice, taxIncluded]
  );
  const listHeader = useMemo(() => (
    <View>
      <BookingInfo hotelName={hotelName} />
      <TopCTA />
      <Tabs tab={tab} onChange={setTab} />
      <FiltersBar
        taxIncluded={taxIncluded}
        onToggleTax={() => setTaxIncluded((v) => !v)}
      />
    </View>
  ), [hotelName, tab, taxIncluded]);

  return (
    <View style={s.screen}>
      {/* ⬆️ 상단 헤더는 고정 */}
      <Header
        onBack={() => {
          try {
            useBookingStore.getState().saveProgressFromCurrent();
          } catch (e) {
            console.log("saveProgress error:", e);
          }
          navigation.goBack();
        }}
      />

      <FlatList
        data={rooms}
        keyExtractor={(it, idx) => `${it.id || it.name}-${idx}`}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={s.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
        bounces={false}            // iOS 오버스크롤 방지
        overScrollMode="never"
      />
    </View>
  );
}

/* ==================== 스타일 ==================== */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  // 헤더
  headerWrap: { paddingHorizontal: H_PADDING, paddingTop: 8, backgroundColor: "#fff" },
  headerRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  iconTxt: { fontSize: 18, color: Color.text?.black || "#111" },

  // 상태 인디케이터
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 6,
  },
  stepLabel: { color: "#5b5048", fontSize: 12, fontWeight: "600" },
  stepDots: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepPast: { borderWidth: 1, borderColor: Color.primary || "#978773", backgroundColor: "transparent" },
  stepCurrent: { backgroundColor: Color.primary || "#978773" },
  stepFuture: { backgroundColor: "#d9d9d9" },
  stepNumPast: { color: Color.primary || "#978773", fontWeight: "700", fontSize: 12 },
  stepNumCurrent: { color: "#fff", fontWeight: "800", fontSize: 12 },
  stepNumFuture: { color: "#777", fontWeight: "700", fontSize: 12 },

  // 예약 정보 (회색 배경, 세로)
  infoWrap: {
    backgroundColor: "#f6f6f6",
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoLabel: { fontSize: 13, color: "#5b5048", fontWeight: "700" },
  infoSep: { color: "#e3e3e3", marginHorizontal: 6 },
  infoValue: { fontSize: 13, color: Color.text?.black || "#111", flexShrink: 1 },

  likeBtnBottom: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likeTxt: { color: Color.text?.black || "#111", fontWeight: "700" },

  // 상단 CTA
  topCta: {
    marginTop: 10,
    marginHorizontal: H_PADDING,
    backgroundColor: "#D06E41",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  topCtaTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },

  // 탭
  tabsRow: { marginTop: 12, marginHorizontal: H_PADDING, flexDirection: "row", gap: 8 },
  tabBtn: { flex: 1, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  tabOn: { backgroundColor: "#111" },
  tabOff: { backgroundColor: "#eee" },
  tabTxt: { fontSize: 14, fontWeight: "700" },
  tabTxtOn: { color: "#fff" },
  tabTxtOff: { color: "#555" },

  // 필터/정렬
  filterWrap: { marginTop: 10, marginHorizontal: H_PADDING },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  chip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  chipIcon: { width: 36, paddingHorizontal: 0 },
  chipTxt: { fontSize: 12, color: Color.text?.black || "#111" },
  filterBorder: { height: 3, backgroundColor: "#000", marginTop: 10, marginBottom: 8 },
  taxRow: { flexDirection: "row", alignItems: "center", alignSelf: "flex-end" },
  cbBox: { width: 18, height: 18, borderRadius: 3, borderWidth: 1, alignItems: "center", justifyContent: "center", marginRight: 8 },
  cbBoxOn: { borderColor: Color.primary || "#978773", backgroundColor: Color.primary || "#978773" },
  cbBoxOff: { borderColor: "#bbb", backgroundColor: "#fff" },
  cbMark: { color: "#fff", fontSize: 12, lineHeight: 12 },
  taxTxt: { fontSize: 12, color: Color.text?.black || "#111" },

  // 리스트
  listContent: { paddingHorizontal: H_PADDING, paddingBottom: 24, paddingTop: 6 },

  // 카드
  card: {
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
  },
  remainBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  remainTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },

  cardBody: { padding: 12 },
  roomName: { fontSize: 16, fontWeight: "800", color: Color.text?.black || "#111", marginBottom: 6 },
  roomMeta: { fontSize: 12, color: "#555", marginBottom: 10 },

  // 금액 영역(전체 박스)
  priceArea: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  // 상단 줄: 태그 + 하트
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rewardsTag: {
    borderWidth: 1,
    borderColor: Color.primary || "#978773",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rewardsTagTxt: { color: Color.primary || "#978773", fontSize: 12, fontWeight: "700" },
  heart: { fontSize: 18, color: "#999" },

  // 일반요금 >
  normalRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  normalTxt: { fontSize: 12, color: "#111", fontWeight: "700" },

  // 버튼1: 채움(primary)
  btnPrimary: {
    backgroundColor: Color.primary || "#978773",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  btnPrimaryLbl: { color: "#fff", fontSize: 13, fontWeight: "700" },
  btnPrimaryPrice: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 2 },

  // 버튼2: 외곽선(primary) · 배경 없음 · 검정 텍스트/금액 · 중앙정렬
  btnOutline: {
    borderWidth: 1,
    borderColor: Color.primary || "#978773",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  btnOutlineLbl: { color: "#111", fontSize: 13, fontWeight: "700" },
  btnOutlinePrice: { color: "#111", fontSize: 16, fontWeight: "700", marginTop: 2 },

  // 하단 우측 힌트
  benefitRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 10, gap: 8 },
  benefitHint: { color: "#888" },
  qCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "#bbb", alignItems: "center", justifyContent: "center" },
  qTxt: { color: "#777", fontWeight: "700", fontSize: 12 },
});
