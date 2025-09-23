import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import Color from "./styles/color";

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

const OptionSelection = ({
  navigation,
  route,
  currentStep = 3,
  totalSteps = 4,
  options,
  summary,
}) => {
  const params = route?.params || {};
  const resolvedStep = params.currentStep ?? currentStep;
  const resolvedTotal = params.totalSteps ?? totalSteps;
  const optionItems = params.options || options || DEFAULT_OPTIONS;
  const bookingSummary = {
    ...DEFAULT_SUMMARY,
    ...summary,
    ...(params.summary || {}),
  };

  const steps = useMemo(() => {
    return new Array(resolvedTotal).fill(null).map((_, index) => {
      const number = index + 1;
      if (number < resolvedStep) {
        return "past";
      }
      if (number === resolvedStep) {
        return "current";
      }
      return "future";
    });
  }, [resolvedStep, resolvedTotal]);

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleDismiss = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={handleBack}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>{"<"}</Text>
          </Pressable>

          <Pressable accessibilityRole="button" style={styles.iconButton}>
            <Text style={styles.iconText}>{"≡"}</Text>
          </Pressable>
        </View>

        <View style={styles.stepRow}>
          <Text style={styles.stepLabel}>옵션 선택</Text>
          <View style={styles.stepDots}>
            {steps.map((state, index) => (
              <View
                key={index}
                style={[
                  styles.stepDot,
                  state === "past" && styles.stepDotPast,
                  state === "current" && styles.stepDotCurrent,
                  state === "future" && styles.stepDotFuture,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    state === "current" && styles.stepNumberCurrent,
                    state === "past" && styles.stepNumberPast,
                    state === "future" && styles.stepNumberFuture,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

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
          onPress={handleDismiss}
        >
          <Text style={styles.summaryActionText}>
            {bookingSummary.actionLabel}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OptionSelection;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
    color: Color.text?.black || "#111",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Color.text?.black || "#111",
  },
  stepDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotPast: {
    borderWidth: 1,
    borderColor: Color.text?.black || "#111",
    backgroundColor: "#fff",
  },
  stepDotCurrent: {
    backgroundColor: Color.primary || "#978773",
  },
  stepDotFuture: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f1f1f1",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepNumberPast: {
    color: Color.text?.black || "#111",
  },
  stepNumberCurrent: {
    color: "#fff",
  },
  stepNumberFuture: {
    color: "#bbb",
  },
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
