import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useBookingStore from "../stores/bookingStore";

export default function ResumeBanner() {
  const navigation = useNavigation();
  const snapshot = useBookingStore((s) => s.resumeSnapshot);
  const loadResumeToCurrent = useBookingStore((s) => s.loadResumeToCurrent);
  const dismissResume = useBookingStore((s) => s.dismissResume);
  const [expanded, setExpanded] = useState(false);

  if (!snapshot) return null;

  const start = snapshot.startDate ? new Date(snapshot.startDate) : null;
  const end = snapshot.endDate ? new Date(snapshot.endDate) : null;
  const dateStr =
    start && end
      ? `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${
          end.getMonth() + 1
        }월 ${end.getDate()}일`
      : "날짜 미지정";

  const continueReservation = () => {
    loadResumeToCurrent();
    navigation.navigate("ReservationModal");
  };

  if (!expanded) {
    return (
      <View style={s.wrapCollapsed}>
        <Pressable style={s.pill} onPress={() => setExpanded(true)}>
          <Text style={s.pillTxt}>진행 중인 예약 이어하기 ▾</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.wrapExpanded}>
      <View style={s.card}>
        <Pressable style={s.cardClose} onPress={() => setExpanded(false)}>
          <Text style={{ fontSize: 20 }}>×</Text>
        </Pressable>
        <Text style={s.hotelName}>
          {(snapshot.hotelList && snapshot.hotelList[0]) || "호텔 미선택"}
        </Text>
        <Text style={s.dateText}>{dateStr}</Text>
        <Pressable onPress={continueReservation} style={s.linkBtn}>
          <Text style={s.linkTxt}>이어서 예약하기</Text>
        </Pressable>
        <Pressable
          onPress={dismissResume}
          style={[s.linkBtn, { marginTop: 6 }]}
        >
          <Text style={[s.linkTxt, { color: "#111" }]}>숨기기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapCollapsed: { paddingHorizontal: 16, paddingTop: 8 },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  pillTxt: { color: "#111", fontWeight: "600" },
  wrapExpanded: { paddingHorizontal: 16, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardClose: { position: "absolute", right: 8, top: 6, padding: 8 },
  hotelName: { fontSize: 16, fontWeight: "700", marginBottom: 6, paddingTop: 16 },
  dateText: { color: "#444", marginBottom: 12 },
  linkBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  linkTxt: { color: "#fff", fontWeight: "600" },
});
