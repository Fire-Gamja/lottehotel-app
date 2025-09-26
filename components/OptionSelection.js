import React, { memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Color from "./styles/color";
import useBookingStore from "../stores/bookingStore";

const DEFAULT_OPTIONS = [
  { id: "breakfast", title: "조식", price: 63000 },
];

const H_PADDING = 16;

/* =================== 헤더 =================== */
const Header = memo(function Header({ onBack }) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconBtn}>
          <Text style={styles.iconTxt}>←</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.iconBtn}>
          <Text style={styles.iconTxt}>≡</Text>
        </Pressable>
      </View>

      <View style={styles.stepRow}>
        <Text style={styles.stepLabel}>옵션 선택</Text>
        <View style={styles.stepDots}>
          <View style={[styles.stepDot, styles.stepPast]}>
            <Text style={styles.stepNumPast}>1</Text>
          </View>
          <View style={[styles.stepDot, styles.stepPast]}>
            <Text style={styles.stepNumPast}>2</Text>
          </View>
          <View style={[styles.stepDot, styles.stepCurrent]}>
            <Text style={styles.stepNumCurrent}>3</Text>
          </View>
          <View style={[styles.stepDot, styles.stepFuture]}>
            <Text style={styles.stepNumFuture}>4</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default function OptionSelection() {
  const route = useRoute();
  const navigation = useNavigation();
  const { priceType, room, summary } = route.params || {};

  const [selectedOption, setSelectedOption] = useState(null);

  // 금액 포맷
  const fmtKRW = (n) =>
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 총 금액 계산
  const baseAmount = summary?.amount
    ? parseInt(summary.amount.replace(/,/g, ""), 10)
    : 0;
  const optionPrice = selectedOption?.price || 0;
  const totalAmount = baseAmount + optionPrice;

  return (
    <View style={styles.screen}>
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>옵션 선택</Text>
          <View style={styles.sectionUnderline} />
        </View>

        {DEFAULT_OPTIONS.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.optionRow,
              selectedOption?.id === item.id && { backgroundColor: "#f6f6f6" },
            ]}
            onPress={() => setSelectedOption(item)}
          >
            <Text style={styles.optionLabel}>{item.title}</Text>
            <Text style={styles.optionIcon}>+</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 하단 요약 + 버튼 */}
      <View style={styles.summaryShell}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHotel}>{summary?.hotelName}</Text>
          <Text style={styles.summaryMeta}>{summary?.period}</Text>
          <Text style={styles.summaryMeta}>총 요금</Text>
          <Text style={styles.summaryPrice}>{fmtKRW(totalAmount)} KRW</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.summaryAction}
          onPress={() =>
            navigation.navigate("PayPage", {
              priceType,
              room,
              summary: {
                ...summary,
                option: selectedOption?.title,
                optionPrice: optionPrice,
                totalAmount: totalAmount,
              },
            })
          }
        >
          <Text style={styles.summaryActionText}>다음 단계</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  headerWrap: { paddingHorizontal: H_PADDING, paddingTop: 8, backgroundColor: "#fff" },
  headerRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: { width: 24, height: 24, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  iconTxt: { fontSize: 24, color: Color.text?.black || "#111" },
  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 6 },
  stepLabel: { color: "#5b5048", fontSize: 12, fontWeight: "600" },
  stepDots: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepPast: { borderWidth: 1, borderColor: Color.primary || "#978773", backgroundColor: "transparent" },
  stepCurrent: { backgroundColor: Color.primary || "#978773" },
  stepFuture: { backgroundColor: "#d9d9d9" },
  stepNumPast: { color: Color.primary || "#978773", fontWeight: "700", fontSize: 12 },
  stepNumCurrent: { color: "#fff", fontWeight: "800", fontSize: 12 },
  stepNumFuture: { color: "#777", fontWeight: "700", fontSize: 12 },

  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 140 },
  sectionHead: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  sectionUnderline: { height: 2, backgroundColor: "#111", width: "100%" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
  },
  optionLabel: { fontSize: 18, fontWeight: "700" },
  optionIcon: { fontSize: 22, fontWeight: "300" },

  summaryShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: "transparent",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 8,
  },
  summaryHotel: { fontSize: 18, fontWeight: "800" },
  summaryMeta: { fontSize: 14, color: "#777" },
  summaryPrice: { fontSize: 20, fontWeight: "800", marginTop: 8 },

  summaryAction: {
    backgroundColor: "#111",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  summaryActionText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
