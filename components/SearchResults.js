// components/SearchResults.js (revamped UI)
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import useBookingStore from "../stores/bookingStore";
import { getHotelByName } from "../stores/hotelCatalog";
import Color from "../components/styles/color";

function HotelSummary({ name, star, address }) {
  return (
    <View style={s.hotelSummary}>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={s.hotelName}>{name}</Text>
        <View style={s.hotelInfo}>
          <Text style={{ color: "#5b5048" }}>호텔성급</Text>
          <Text style={{ color: "#e3e3e3" }}> | </Text>
          <Text style={{ color: "#5b5048" }}>{star}</Text>
        </View>
        <View style={s.hotelAddr}>
          <Text style={{ color: "#5b5048" }}>주소</Text>
          <Text style={{ color: "#e3e3e3" }}> | </Text>
          <Text style={{ overflow: "" }}>{address}</Text>
        </View>
        <View style={s.checkInfo}>
          <Text style={{ color: "#5b5048" }}>체크인/아웃</Text>
          <Text style={{ color: "#e3e3e3" }}> | </Text>
          <Text style={{ color: "#111" }}>15:00 / 11:00</Text>
        </View>
        <View style={{ flexDirection: "column", marginTop: 10 }}>
          <Pressable style={s.likeBtn}>
            <Text style={s.likeTxt}>♡ 관심</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SearchResults({ navigation }) {
  const hotelList = useBookingStore((s) => s.hotelList);
  const [tab, setTab] = useState("room");

  const hotels = useMemo(() => {
    const picked = Array.isArray(hotelList) ? hotelList : [];
    if (!picked.length) return [];
    return picked.map((name) => getHotelByName(name)).filter(Boolean);
  }, [hotelList]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backTxt}>‹</Text>
        </Pressable>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View style={s.session}>
          <Text style={s.sessionText}>객실 선택</Text>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Pressable style={s.num1Btn}>
              <Text style={s.num1Txt}>1</Text>
            </Pressable>
            <Pressable style={s.num2Btn}>
              <Text style={s.num2Txt}>2</Text>
            </Pressable>
            <Pressable style={s.num3Btn}>
              <Text style={s.num3Txt}>3</Text>
            </Pressable>
            <Pressable style={s.num4Btn}>
              <Text style={s.num4Txt}>4</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ padding: 0 }}>
          {hotels[0] && (
            <HotelSummary
              name={hotels[0].name}
              address={hotels[0].address}
              star={hotels[0].star}
            />
          )}
          <Pressable style={s.fastBtn}>
            <Text style={s.fastTxt}>최저가로 바로 예약하기 →</Text>
          </Pressable>

          {/* Tabs */}
          <View style={s.tabsRow}>
            <Pressable
              onPress={() => setTab("room")}
              style={[s.tabLBtn, tab === "room" && s.tabActive]}
            >
              <Text style={[s.tabTxt, tab === "room" && s.tabTxtActive]}>
                룸 프로모션
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab("pkg")}
              style={[s.tabRBtn, tab === "pkg" && s.tabActive]}
            >
              <Text style={[s.tabTxt, tab === "pkg" && s.tabTxtActive]}>
                패키지
              </Text>
            </Pressable>
          </View>

          {/* Filters row */}
          <View style={s.filtersRow}>
            <Pressable style={s.filterChip}>
              <Text>낮은 요금순 ▾</Text>
            </Pressable>
            <Pressable style={s.filterChip}>
              <Text>침대타입 ▾</Text>
            </Pressable>
            <Pressable style={s.filterChip}>
              <Text>전망타입 ▾</Text>
            </Pressable>
            <Pressable style={[s.filterChip, { width: 34 }]}>
              <Text>↻</Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 16,
              paddingTop: 12,
              paddingBottom: 16,
            }}
          >
            <Pressable style={s.taxCheck}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>✓</Text>
            </Pressable>
            <Text style={{ marginLeft: 8, color: "#5b5048" }}>
              세금, 봉사료 포함 보기
            </Text>
          </View>
        </View>

        {/* Room list */}
        <View style={{ paddingHorizontal: 16 }}>
          {[1, 2, 3].map((n) => (
            <View key={n} style={s.roomCard}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={s.roomTitle}>그랜드 디럭스 더블 액세서블 룸</Text>
              </View>
              <View style={s.memberBox}>
                <Text style={s.memberTxt}>
                  리워즈 회원요금{String.fromCharCode(10)}787,710 KRW
                </Text>
              </View>
              <View style={s.normalBox}>
                <Text style={s.normalTxt}>
                  일반요금{String.fromCharCode(10)}847,000 KRW
                </Text>
              </View>
              <Pressable style={s.roomCta}>
                <Text style={s.roomCtaTxt}>객실 더보기 →</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {hotels.length === 0 && (
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 16, color: "#666" }}>
              선택한 호텔이 없습니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },

  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  backTxt: {
    fontSize: 22,
    color: "#111",
  },

  session: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
  },

  sessionText: {
    fontSize: 18,
    color: Color.primary,
    fontWeight: 700,
  },

  num1Btn: {
    borderWidth: 1,
    borderColor: Color.primary,
    width: 24,
    height: 24,
    borderRadius: 24,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  num1Txt: {
    color: Color.primary,
    fontFamily: "Serif",
  },
  num2Btn: {
    width: 24,
    height: 24,
    backgroundColor: Color.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  num2Txt: {
    color: Color.text.white,
  },
  num3Btn: {
    width: 24,
    height: 24,
    backgroundColor: Color.gray,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  num3Txt: {
    color: Color.text.gray,
  },
  num4Btn: {
    width: 24,
    height: 24,
    backgroundColor: Color.gray,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  num4Txt: {
    color: Color.text.gray,
  },
  hotelSummary: {
    backgroundColor: "#eee",
  },

  hotelThumb: {
    width: 110,
    height: 110,
  },

  hotelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    paddingTop: 16,
  },

  hotelInfo: {
    flexDirection: "row",
    marginTop: 15,
  },

  hotelAddr: {
    flexDirection: "row",
    marginTop: 10,
  },

  checkInfo: {
    flexDirection: "row",
    marginTop: 10,
  },

  likeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 6,
    marginRight: 16,
    marginTop: 8,
  },

  likeTxt: {
    color: "#444",
  },

  fastBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#c96e45",
    borderRadius: 6,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
  },

  fastTxt: {
    color: "#fff",
    fontWeight: "700",
    alignSelf: "center",
  },

  tabsRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
  },

  tabLBtn: {
    paddingVertical: 13,
    paddingHorizontal: 60,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tabRBtn: {
    paddingVertical: 13,
    paddingHorizontal: 66.6,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tabActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },

  tabTxt: {
    color: "#000",
  },

  tabTxtActive: {
    color: "#fff",
    fontWeight: "600",
  },

  filtersRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
    flexWrap: "wrap",
    paddingLeft: 16,
    paddingRight: 16,
  },

  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  taxCheck: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#8a6a54",
    alignItems: "center",
    justifyContent: "center",
  },

  roomCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 16,
  },

  roomTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  memberBox: {
    backgroundColor: "#8a6a54",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 12,
  },

  memberTxt: {
    color: "#fff",
    fontWeight: "700",
  },

  normalBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    marginTop: 4,
  },

  normalTxt: {
    color: "#111",
    fontWeight: "700",
  },

  roomCta: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#111",
  },

  roomCtaTxt: {
    color: "#fff",
    fontWeight: "600",
  },
});
