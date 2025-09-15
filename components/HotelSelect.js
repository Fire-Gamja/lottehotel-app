// HotelSelect.js
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import useBookingStore from "../stores/bookingStore";

// --- 검색 카탈로그 ---
const HOTELS = [
  { name: "시그니엘 서울", city: "서울", address: "서울특별시 송파구 올림픽로 300 롯데월드타워 76-101층", country: "한국" },
  { name: "롯데호텔 서울", city: "서울", address: "서울특별시 중구 을지로 30", country: "한국" },
  { name: "롯데호텔 월드", city: "서울", address: "서울특별시 송파구 올림픽로 240", country: "한국" },
  { name: "롯데호텔 부산", city: "부산", address: "부산광역시 부산진구 가야대로 772", country: "한국" },
  { name: "롯데호텔 제주", city: "제주", address: "제주특별자치도 서귀포시 중문관광로72번길 35", country: "한국" },
  { name: "롯데호텔 울산", city: "울산", address: "울산광역시 남구 삼산로 282", country: "한국" },
  { name: "L7 명동 바이 롯데", city: "서울", address: "서울특별시 중구 퇴계로 137", country: "한국" },
  { name: "L7 강남 바이 롯데", city: "서울", address: "서울특별시 강남구 테헤란로 415", country: "한국" },
  { name: "L7 홍대 바이 롯데", city: "서울", address: "서울특별시 마포구 양화로 141", country: "한국" },
  { name: "L7 해운대 바이 롯데", city: "부산", address: "부산광역시 해운대구 해운대로 620", country: "한국" },
  { name: "L7 청량리 바이 롯데", city: "서울", address: "서울특별시 동대문구 왕산로 200", country: "한국" },
  { name: "롯데시티호텔 마포", city: "서울", address: "서울특별시 마포구 마포대로 109", country: "한국" },
  { name: "롯데시티호텔 김포공항", city: "서울", address: "서울특별시 강서구 하늘길 38", country: "한국" },
  { name: "롯데시티호텔 제주", city: "제주", address: "제주특별자치도 제주시 도령로 83", country: "한국" },
  { name: "롯데시티호텔 대전", city: "대전", address: "대전광역시 유성구 엑스포로123번길 33 (도룡동)", country: "한국" },
  { name: "롯데시티호텔 구로", city: "서울", address: "서울특별시 구로구 디지털로 300", country: "한국" },
  { name: "롯데시티호텔 울산", city: "울산", address: "울산광역시 남구 삼산로 204 (삼산동)", country: "한국" },
  { name: "롯데시티호텔 명동", city: "서울", address: "서울특별시 중구 삼일대로 362 (장교동, 명동)", country: "한국" },
  { name: "롯데리조트 속초", city: "속초", address: "강원특별자치도 속초시 대포항길 186 (대포동)", country: "한국" },
  { name: "롯데리조트 부여", city: "부여", address: "충청남도 부여군 규암면 백제문로 400", country: "한국" },
  { name: "롯데호텔앤리조트 김해", city: "김해", address: "경상남도 김해시 장유로 505 (신문동)", country: "한국" },
  { name: "롯데리조트 제주 아트빌라스", city: "제주", address: "제주특별자치도 서귀포시 색달중앙로252번길 124", country: "한국" },
];

const COUNTRIES = ["한국", "미국", "러시아", "일본", "베트남", "미얀마", "우즈베키스탄"];
const BRANDS = ["시그니엘", "롯데호텔", "L7 호텔 바이 롯데", "롯데시티호텔", "롯데리조트", "ASSOCIATED PARTNERS"];

const HOTEL_DATA = {
  한국: {
    시그니엘: ["시그니엘 서울", "시그니엘 부산"],
    롯데호텔: ["롯데호텔 서울", "롯데호텔 월드", "롯데호텔 부산", "롯데호텔 제주", "롯데호텔 울산"],
    "L7 호텔 바이 롯데": ["L7 명동 바이 롯데", "L7 강남 바이 롯데", "L7 홍대 바이 롯데", "L7 해운대 바이 롯데", "L7 청량리 바이 롯데"],
    롯데시티호텔: ["롯데시티호텔 마포", "롯데시티호텔 김포공항", "롯데시티호텔 제주", "롯데시티호텔 대전", "롯데시티호텔 구로", "롯데시티호텔 울산", "롯데시티호텔 명동"],
    롯데리조트: ["롯데리조트 속초", "롯데리조트 부여", "롯데리조트 제주 아트빌라스", "롯데호텔앤리조트 김해"],
  },
  미국: {
    롯데호텔: ["롯데뉴욕팰리스", "롯데호텔 시애틀", "롯데호텔 괌"],
    "ASSOCIATED PARTNERS": ["뉴요커 호텔 바이 롯데호텔"],
    "L7 호텔 바이 롯데": ["L7 시카고 바이 롯데"],
  },
  러시아: { 롯데호텔: ["롯데호텔 모스크바", "롯데호텔 상트페테르부르크", "롯데호텔 블라디보스토크", "롯데호텔 사마라"] },
  일본: { 롯데호텔: ["롯데아라이리조트"], 롯데시티호텔: ["롯데시티호텔 긴시초"] },
  베트남: { 롯데호텔: ["롯데호텔 사이공", "롯데호텔 하노이"], "L7 호텔 바이 롯데": ["L7 웨스트 레이크 하노이 바이 롯데"] },
  미얀마: { 롯데호텔: ["롯데호텔 양곤"] },
  우즈베키스탄: { 롯데시티호텔: ["롯데시티호텔 타슈켄트팰리스"] },
};

const { height: SCREEN_H } = Dimensions.get("window");
const ACCENT = "#8a6a54";

export default function HotelSelect({ navigation, maxSelect = 3 }) {
  const [tab, setTab] = useState("country");
  const [selectedCountry, setSelectedCountry] = useState("한국");
  const [selectedBrand, setSelectedBrand] = useState("시그니엘");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState([]);
  const [searchBarBottom, setSearchBarBottom] = useState(0);
  const [kbHeight, setKbHeight] = useState(0);

  const hotelList = useBookingStore((s) => s.hotelList);
  const setHotelList = useBookingStore((s) => s.setHotelList);

  const animY = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    Animated.timing(animY, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animY]);

  // 키보드 높이 추적
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKbHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKbHeight(0));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 이전에 고른 호텔 유지
  useEffect(() => {
    if (Array.isArray(hotelList) && hotelList.length > 0) setPicked(hotelList);
  }, [hotelList]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HOTELS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        (h.city && h.city.toLowerCase().includes(q))
    );
  }, [query]);

  const slideDownClose = () => {
    Animated.timing(animY, {
      toValue: SCREEN_H,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.goBack());
  };

  const countryHotels = useMemo(() => HOTEL_DATA[selectedCountry] ?? {}, [selectedCountry]);
  const filterByQuery = (list) =>
    query.trim().length === 0 ? list : list.filter((t) => t.toLowerCase().includes(query.toLowerCase()));

  const togglePick = (name) => {
    setPicked((prev) => {
      const has = prev.includes(name);
      if (has) return prev.filter((x) => x !== name);
      if (prev.length < maxSelect) return [...prev, name];
      return prev;
    });
  };

  const clearPicked = () => {
    setPicked([]);
    setHotelList([]);
  };

  const goToDateSelect = () => {
    if (picked.length === 0) return;
    setHotelList(picked);
    Animated.timing(animY, {
      toValue: SCREEN_H,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && navigation.replace("DateSelect", { popAfterConfirm: 1 }));
  };

  // 하단 바 높이(선택 칩/버튼) — 검색 오버레이 bottom 계산에 사용
  const bottomBarHeight = picked.length > 0 ? 120 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Animated.View style={[s.container, { transform: [{ translateY: animY }] }]}>
        {/* Header */}
        <View style={s.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop" }}
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
        <View
          style={s.searchWrap}
          onLayout={(e) => {
            const { y, height } = e.nativeEvent.layout;
            setSearchBarBottom(y + height);
          }}
        >
          <View style={s.searchBox}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="호텔, 명소, 도시를 검색해 보세요."
              placeholderTextColor="#9A9AA0"
              style={s.searchInput}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {!!query && (
              <Pressable
                accessibilityLabel="Clear search"
                onPress={() => {
                  setQuery("");
                  Keyboard.dismiss();
                }}
                style={s.clearBtn}
              >
                <Text style={s.clearTxt}>×</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* 검색 결과 오버레이 (검색 중일 때만 표시) */}
        {query.trim().length > 0 && (
          <View
            style={[
              s.resultsOverlay,
              {
                top: searchBarBottom,
                bottom: kbHeight + bottomBarHeight -150 , // 키보드+하단바 피해서
              },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={false}
              overScrollMode="never"
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            >
              {searchResults.length === 0 ? (
                <Text style={{ color: "#9A9AA0" }}>검색 결과가 없어요.</Text>
              ) : (
                searchResults.map((h) => (
                  <Pressable
                    key={h.name}
                    onPress={() => {
                      togglePick(h.name);
                      setQuery("");
                      Keyboard.dismiss();
                    }}
                    style={s.resultRow}
                  >
                    <Text style={s.resultIcon}>🏨</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.resultName}>{h.name}</Text>
                      <Text style={s.resultAddr} numberOfLines={1}>
                        {h.address}
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* 본문 (탭/카테고리) */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={0}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (query) setQuery("");
              Keyboard.dismiss();
            }}
            accessible={false}
          >
            <View style={{ flex: 1 }}>
              {/* Tabs */}
              <View style={s.tabsWrap}>
                <View style={s.tabs}>
                  <Pressable onPress={() => setTab("country")} style={[s.tabBtn, tab === "country" && s.tabBtnActive]}>
                    <Text style={[s.tabTxt, tab === "country" && s.tabTxtActive]}>국가별</Text>
                  </Pressable>
                  <Pressable onPress={() => setTab("brand")} style={[s.tabBtn, tab === "brand" && s.tabBtnActive]}>
                    <Text style={[s.tabTxt, tab === "brand" && s.tabTxtActive]}>브랜드별</Text>
                  </Pressable>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                contentContainerStyle={[s.scrollPad, { paddingBottom: bottomBarHeight || 24 }]}
              >
                {tab === "country" ? (
                  <>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      bounces={false}
                      overScrollMode="never"
                      contentContainerStyle={s.countryRow}
                    >
                      {COUNTRIES.map((c) => (
                        <Pill key={c} label={c} active={c === selectedCountry} onPress={() => setSelectedCountry(c)} />
                      ))}
                    </ScrollView>

                    <Divider />

                    {BRANDS.map((brand) => {
                      const hotels = filterByQuery(HOTEL_DATA[selectedCountry]?.[brand] ?? []);
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
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      bounces={false}
                      overScrollMode="never"
                      contentContainerStyle={s.brandRow}
                    >
                      {BRANDS.map((b) => (
                        <Pill key={b} label={b} active={b === selectedBrand} onPress={() => setSelectedBrand(b)} />
                      ))}
                    </ScrollView>

                    <Divider />

                    {Object.keys(HOTEL_DATA).map((country) => {
                      const hotels = HOTEL_DATA[country]?.[selectedBrand] ?? [];
                      const filtered = filterByQuery(hotels);
                      if (!filtered.length) return null;
                      return (
                        <View key={country} style={s.section}>
                          <Text style={s.subTitle}>{country}</Text>
                          <View style={s.chipsWrap}>
                            {filtered.map((h) => (
                              <Chip key={h} label={h} picked={picked.includes(h)} onPress={() => togglePick(h)} />
                            ))}
                          </View>
                        </View>
                      );
                    })}
                  </>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {/* 하단 선택 바 */}
        {picked.length > 0 && (
          <View style={s.bottomBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} overScrollMode="never" contentContainerStyle={s.pickedRow}>
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
                <Text style={s.btnPrimaryTxt}>선택</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
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
  container: { flex: 1, backgroundColor: "#fff", overflow: "hidden" },
  header: { height: 150, width: "100%" },
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
  closeBtn: { position: "absolute", top: 8, right: 12, alignItems: "center", justifyContent: "center" },
  closeTxt: { color: "#fff", fontWeight: "100", fontSize: 40 },

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
    position: "relative",
  },
  searchIcon: { marginRight: 6, color: "#9A9AA0" },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  clearBtn: {
    position: "absolute",
    right: 8,
    top: 16,
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clearTxt: { fontSize: 24, color: "#9A9AA0", fontWeight: "300"  },

  // 검색 결과 오버레이
  resultsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 30,
    elevation: 40, // Android
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EDEDEF",
  },

  tabsWrap: { paddingHorizontal: 16, paddingTop: 12 },
  tabs: { flexDirection: "row", borderWidth: 1, borderColor: "#E5E5EA", borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  tabBtnActive: { backgroundColor: "#F2F2F4" },
  tabTxt: { fontSize: 14, color: "#6B7280" },
  tabTxtActive: { color: "#111", fontWeight: "600" },

  scrollPad: { paddingHorizontal: 16, paddingTop: 8 },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  pillDefault: { borderColor: "#E5E5EA", backgroundColor: "#fff" },
  pillActive: { borderColor: ACCENT, backgroundColor: ACCENT },
  pillTxt: { fontSize: 14, color: "#111" },
  pillTxtActive: { color: "#fff" },

  divider: { height: 1, backgroundColor: "#EDEDEF", marginVertical: 16 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#111" },
  subTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#111" },
  brandRow: { paddingRight: 16, gap: 8 },
  countryRow: { paddingRight: 16, gap: 8 },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12
  },
  resultIcon: { fontSize: 20, width: 24, textAlign: "center" },
  resultName: { fontSize: 16, color: "#111", marginBottom: 4 },
  resultAddr: { fontSize: 13, color: "#6B7280" },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, backgroundColor: "#fff" },
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
    paddingTop: 12,
  },
  pickedRow: { paddingHorizontal: 12, paddingBottom: 6, gap: 8 },
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
  actions: { marginTop: 6, flexDirection: "row" },
  btnOutline: { flex: 1, height: 60, borderWidth: 1, borderColor: "#D5D5DA", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  btnOutlineTxt: { color: "#111", fontSize: 15, fontWeight: "600" },
  btnPrimary: { flex: 1, height: 60, alignItems: "center", justifyContent: "center", backgroundColor: "#111" },
  btnPrimaryTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
