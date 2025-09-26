import React, { memo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import Color from "./styles/color";
import useBookingStore from "../stores/bookingStore";

const DEFAULT_OPTIONS = [
  { id: "breakfast", title: "조식" },
];

const DEFAULT_SUMMARY = {
  hotelName: "시그니엘 서울",
  period: "09월 19일(금) ~ 09월 20일(토) / 1박",
  guestInfo: "객실 1 / 성인 2, 어린이 0",
  totalLabel: "총 요금",
  amount: "1,028,500",
  currency: "KRW",
  actionLabel: "건너뛰기",
};

const H_PADDING = 16;

const Header = memo(function Header({ onBack }) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconBtn}>
          <Text style={styles.iconTxt}>←</Text>
        </Pressable>
        {/* Center title intentionally left empty */}
        <Pressable accessibilityRole="button" style={styles.iconBtn}>
          <Text style={styles.iconTxt}>≡</Text>
        </Pressable>
      </View>

      <View style={styles.stepRow}>
        <Text style={styles.stepLabel}>객실 선택</Text>
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

const OptionSelection = ({ navigation }) => {
  // Use your real state/store here, fallback to defaults for now
  const optionItems = DEFAULT_OPTIONS;
  const bookingSummary = DEFAULT_SUMMARY;

  const handleDismiss = () => {
    // Handle dismiss action, e.g., navigate or update state
    navigation.goBack();
  };

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

        {optionItems.map((item) => (
          <Pressable key={item.id} style={styles.optionRow}>
            <Text style={styles.optionLabel}>{item.title}</Text>
            <Text style={styles.optionIcon}>+</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.summaryShell}>
        <View style={styles.summaryCard}>
          <Pressable accessibilityRole="button" style={styles.summaryToggle}>
            <Text style={styles.summaryToggleText}>^</Text>
          </Pressable>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryHotel}>{bookingSummary.hotelName}</Text>
            <Text style={styles.summaryMeta}>{bookingSummary.period}</Text>
            <Text style={styles.summaryMeta}>{bookingSummary.guestInfo}</Text>

            <View style={styles.summaryFooter}>
              <Text style={styles.summaryLabel}>{bookingSummary.totalLabel}</Text>
              <View style={styles.summaryPriceRow}>
                <Text style={styles.summaryPrice}>{bookingSummary.amount}</Text>
                <Text style={styles.summaryCurrency}>
                  {` ${bookingSummary.currency}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.summaryAction}
          onPress={[handleDismiss]}
        >
          <Text style={styles.summaryActionText}>
            {bookingSummary.actionLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OptionSelection;

const styles = StyleSheet.create({
  // ... your styles as provided
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 140,
  },
  sectionHead: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Color.text?.black || "#111",
    marginBottom: 6,
  },
  sectionUnderline: {
    height: 2,
    backgroundColor: Color.text?.black || "#111",
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d9d9d9",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: Color.text?.black || "#111",
  },
  optionIcon: {
    fontSize: 22,
    fontWeight: "300",
    color: Color.text?.black || "#111",
  },
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },
  summaryToggle: {
    alignSelf: "center",
    marginBottom: 10,
  },
  summaryToggleText: {
    fontSize: 18,
    color: "#999",
  },
  summaryContent: {
    gap: 4,
  },
  summaryHotel: {
    fontSize: 18,
    fontWeight: "800",
    color: Color.text?.black || "#111",
  },
  summaryMeta: {
    fontSize: 14,
    color: "#777",
  },
  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Color.text?.black || "#111",
  },
  summaryPriceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: Color.text?.black || "#111",
  },
  summaryCurrency: {
    fontSize: 14,
    fontWeight: "600",
    color: Color.text?.black || "#111",
  },
  summaryAction: {
    backgroundColor: "#111",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  summaryActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
