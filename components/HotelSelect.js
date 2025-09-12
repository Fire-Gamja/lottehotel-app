// HotelSelect.js (React Native, slide-up modal + bottom action bar)
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import useBookingStore from "../stores/bookingStore";

const COUNTRIES = ["한국", "미국", "러시아", "일본", "베트남", "미얀마"];
const BRANDS = ["시그니엘", "롯데호텔", "L7 호텔 바이 롯데", "롯데시티호텔"];

const HOTEL_DATA = {
  한국: {
    시그니엘: ["시그니엘 서울", "시그니엘 부산"],
    롯데호텔: ["롯데호텔 서울", "롯데호텔 월드", "롯데호텔 부산", "롯데호텔 제주", "롯데호텔 울산"],
    "L7 호텔 바이 롯데": [
      "L7 명동 바이 롯데",
      "L7 강남 바이 롯데",
      "L7 홍대 바이 롯데",
      "L7 해운대 바이 롯데",
      "L7 청량리 바이 롯데",
    ],
    롯데시티호텔: ["롯데시티호텔 마포", "롯데시티호텔 김포공항"],
  },
};

const { height: SCREEN_H } = Dimensions.get("window");
const ACCENT = "#8a6a54";

export default function HotelSelect({
  navigation,
  maxSelect = 3,
  onChange,
}) {
  const [tab, setTab] = useState("country");
  const [selectedCountry, setSelectedCountry] = useState("한국");
  const [selectedBrand, setSelectedBrand] = useState("시그니엘");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState([]);

  // ✅ 훅은 컴포넌트 안에서 호출
  const hotelList = useBookingStore((s) => s.hotelList);
  const setHotelList = useBookingStore((s) => s.setHotelList);

  // slide up/down 애니메이션
  const animY = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    Animated.timing(animY, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animY]);
  
  useEffect(() => {
    if (Array.isArray(hotelList) && hotelList.length > 0) {
      setPicked(hotelList);
    }
  }, [hotelList]);
  
  const slideDownClose = () => {
    Animated.timing(animY, {
      toValue: SCREEN_H,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) navigation.goBack();
    });
  };

  const countryHotels = useMemo(
    () => HOTEL_DATA[selectedCountry] ?? {},
    [selectedCountry]
  );

  const filterByQuery = (list) =>
    query.trim().length === 0
      ? list
      : list.filter((t) => t.toLowerCase().includes(query.toLowerCase()));

  const setPickedAndEmit = (next) => {
    setPicked(next);
    onChange && onChange(next);
  };

  const togglePick = (name) => {
    setPicked((prev) => {
      const has = prev.includes(name);
      let next = has ? prev.filter((x) => x !== name) : prev;
      if (!has && prev.length < maxSelect) next = [...prev, name];
      onChange && onChange(next);
      return next; 
    });
  };

  const clearPicked = () => {
    setPickedAndEmit([]);
    setHotelList([]); // ✅ 스토어도 비움
  };

  // ✅ 선택 → zustand 저장 → 아래로 닫힘 → DateSelect로 교체
  const goToDateSelect = () => {
    if (picked.length === 0) return;

    // 먼저 전역 스토어에 저장(날짜 선택 없이 닫아도 Reservation에서 표기 유지)
    setHotelList(picked);

    Animated.timing(animY, {
      toValue: SCREEN_H,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      navigation.replace("DateSelect", { popAfterConfirm: 1 });
    });
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
          <Text style={s.headerTitle}>호텔/지역</Text>
          <Text style={s.headerCap}>최대 {maxSelect}개</Text>
        </View>

        <Pressable style={s.closeBtn} onPress={slideDownClose}>
          <Text style={s.closeTxt}>×</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="호텔, 명소, 도시를 검색해 보세요."
            placeholderTextColor="#9A9AA0"
            style={s.searchInput}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsWrap}>
        <View style={s.tabs}>
          <Pressable
            onPress={() => setTab("country")}
            style={[s.tabBtn, tab === "country" && s.tabBtnActive]}
          >
            <Text style={[s.tabTxt, tab === "country" && s.tabTxtActive]}>국가별</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("brand")}
            style={[s.tabBtn, tab === "brand" && s.tabBtnActive]}
          >
            <Text style={[s.tabTxt, tab === "brand" && s.tabTxtActive]}>브랜드별</Text>
          </Pressable>
        </View>
      </View>

      {/* 본문 */}
      <ScrollView contentContainerStyle={[s.scrollPad, { paddingBottom: picked.length > 0 ? 120 : 24 }]}>
        {tab === "country" ? (
          <>
            <View style={s.pillsWrap}>
              {COUNTRIES.map((c) => (
                <Pill key={c} label={c} active={c === selectedCountry} onPress={() => setSelectedCountry(c)} />
              ))}
            </View>

            <Divider />

            {BRANDS.map((brand) => {
              const hotels = filterByQuery(countryHotels[brand] ?? []);
              if (!hotels.length) return null;
              return (
                <View key={brand} style={s.section}>
                  <Text style={s.sectionTitle}>{brand}</Text>
                  <View style={s.chipsWrap}>
                    {hotels.map((h) => (
                      <Chip key={h} label={h} picked={picked.includes(h)} onPress={() => togglePick(h)} />
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.brandRow}>
              {BRANDS.map((b) => (
                <Pill key={b} label={b} active={b === selectedBrand} onPress={() => setSelectedBrand(b)} />
              ))}
            </ScrollView>

            <Divider />

            <View style={s.section}>
              <Text style={s.subTitle}>한국</Text>
              <View style={s.chipsWrap}>
                {(filterByQuery(HOTEL_DATA["한국"][selectedBrand] ?? [])).map((h) => (
                  <Chip key={h} label={h} picked={picked.includes(h)} onPress={() => togglePick(h)} />
                ))}
                {!(HOTEL_DATA["한국"][selectedBrand] ?? []).length && (
                  <Text style={s.emptyTxt}>해당 브랜드의 호텔이 없습니다.</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* 하단 선택 바 */}
      {picked.length > 0 && (
        <View style={s.bottomBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pickedRow}>
            {picked.map((p) => (
              <Pressable key={p} onPress={() => togglePick(p)} style={s.pickedChip}>
                <Text style={s.pickedChipTxt}>{p}</Text>
                <Text style={s.pickedChipX}>×</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={s.actions}>
            <Pressable onPress={clearPicked} style={s.btnOutline}>
              <Text style={s.btnOutlineTxt}>선택해제</Text>
            </Pressable>
            <Pressable onPress={goToDateSelect} style={s.btnPrimary}>
              <Text style={s.btnPrimaryTxt}>선택 ({picked.length})</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

/* ---------- Subcomponents ---------- */
function Pill({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.pill, active ? s.pillActive : s.pillDefault]}>
      <Text style={[s.pillTxt, active && s.pillTxtActive]}>{label}</Text>
    </Pressable>
  );
}

function Chip({ label, picked, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, picked ? s.chipPicked : s.chipDefault]}>
      <Text style={[s.chipTxt, picked && s.chipTxtPicked]}>{label}</Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  header: { height: 112, width: "100%" },
  headerBg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  headerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerCap: { color: "#fff", opacity: 0.9, fontSize: 12 },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeTxt: { color: "#fff", fontSize: 18, lineHeight: 18 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  searchIcon: { marginRight: 6, color: "#9A9AA0" },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  tabsWrap: { paddingHorizontal: 16, paddingTop: 12 },
  tabs: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  tabBtnActive: { backgroundColor: "#F2F2F4" },
  tabTxt: { fontSize: 14, color: "#6B7280" },
  tabTxtActive: { color: "#111", fontWeight: "600" },
  scrollPad: { paddingHorizontal: 16, paddingTop: 8 },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillDefault: { borderColor: "#E5E5EA", backgroundColor: "#fff" },
  pillActive: { borderColor: ACCENT, backgroundColor: ACCENT },
  pillTxt: { fontSize: 14, color: "#111" },
  pillTxtActive: { color: "#fff" },
  divider: { height: 1, backgroundColor: "#EDEDEF", marginVertical: 16 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111" },
  subTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#111" },
  brandRow: { paddingRight: 16, gap: 8 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  chipDefault: { borderColor: "#E5E5EA" },
  chipPicked: { borderColor: ACCENT },
  chipTxt: { fontSize: 14, color: "#111" },
  chipTxtPicked: { color: ACCENT },
  emptyTxt: { color: "#9A9AA0", fontSize: 13 },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EDEDEF",
    paddingTop: 8,
    paddingBottom: 12,
  },
  pickedRow: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 8,
  },
  pickedChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  pickedChipTxt: { color: ACCENT, fontSize: 13, marginRight: 6 },
  pickedChipX: { color: ACCENT, fontSize: 14 },
  pickedEmpty: { color: "#9A9AA0", fontSize: 13, paddingHorizontal: 12 },
  actions: {
    marginTop: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D5D5DA",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnOutlineTxt: { color: "#111", fontSize: 15, fontWeight: "600" },
  btnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT,
  },
  btnPrimaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
