import React, { memo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Color from "./styles/color";

const H_PADDING = 16;

/* =================== 공통 헤더 =================== */
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
        <Text style={styles.stepLabel}>예약정보 입력</Text>
        <View style={styles.stepDots}>
          <View style={[styles.stepDot, styles.stepPast]}><Text style={styles.stepNumPast}>1</Text></View>
          <View style={[styles.stepDot, styles.stepPast]}><Text style={styles.stepNumPast}>2</Text></View>
          <View style={[styles.stepDot, styles.stepPast]}><Text style={styles.stepNumPast}>3</Text></View>
          <View style={[styles.stepDot, styles.stepCurrent]}><Text style={styles.stepNumCurrent}>4</Text></View>
        </View>
      </View>
    </View>
  );
});

/* =================== Input =================== */
function Input({ label, required, value, onChangeText, placeholder }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "700", marginBottom: 4 }}>
        {label}{required && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 10,
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

/* =================== Section =================== */
function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: "800", marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

/* =================== KRW 포맷 =================== */
const fmtKRW = (n) =>
  Math.round(Number(n || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* =================== 메인 =================== */
export default function PayPage({ navigation, route }) {
  const { priceType, room, summary } = route?.params || {};
  const [showDetails, setShowDetails] = useState(false);

  // 입력 상태
  const [inputs, setInputs] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    arrivalTime: "",
  });

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // 유효성 검사
  const validate = () => {
    if (!inputs.lastName || !inputs.firstName || !inputs.email || !inputs.phone) {
      Alert.alert("입력 오류", "필수 항목을 모두 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleReserve = () => {
    if (!validate()) return;
    Alert.alert("예약 완료", "예약 정보가 정상적으로 입력되었습니다.");
    // TODO: 실제 결제/예약 API 연동
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: H_PADDING, paddingBottom: 40 }}>
        {/* 예약자 정보 입력 */}
        <Section title="예약자 정보">
          <Input
            label="성(여권명)"
            required
            value={inputs.lastName}
            onChangeText={(v) => handleChange("lastName", v)}
          />
          <Input
            label="이름(여권명)"
            required
            value={inputs.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
          />
          <Input
            label="이메일"
            required
            value={inputs.email}
            onChangeText={(v) => handleChange("email", v)}
          />
          <Input
            label="연락처"
            required
            value={inputs.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />
          <Input
            label="도착 예정 시간"
            placeholder="15:00"
            value={inputs.arrivalTime}
            onChangeText={(v) => handleChange("arrivalTime", v)}
          />
        </Section>

        {/* 예약 내역 (토글 박스) */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>예약 내역</Text>
            <Pressable onPress={() => setShowDetails((v) => !v)} hitSlop={8}>
              <Text style={styles.arrow}>{showDetails ? "⌃" : "⌄"}</Text>
            </Pressable>
          </View>

          {/* 기본 요약 */}
          <Text style={styles.summaryText}>
            {summary?.hotelName || "시그니엘 서울"}{"\n"}
            {summary?.period || "09월 19일(금) ~ 09월 20일(토) / 1박"}{"\n"}
            성인 {summary?.guests || 2}명
          </Text>

          {/* 펼침 상세 */}
          {showDetails && (
            <View style={styles.detailBox}>
              <Text style={styles.detailRow}>객실명: {room?.name || "-"}</Text>
              <Text style={styles.detailRow}>요금 타입: {priceType || "-"}</Text>
              {!!summary?.option && (
                <Text style={styles.detailRow}>추가 옵션: {summary.option}</Text>
              )}
              <Text style={styles.detailRow}>
                총 요금: {fmtKRW(summary?.totalAmount || 0)} KRW
              </Text>
            </View>
          )}
        </View>

        {/* 예약하기 버튼 */}
        <Pressable style={styles.reserveBtn} onPress={handleReserve}>
          <Text style={styles.reserveBtnTxt}>예약하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  headerWrap: { paddingHorizontal: H_PADDING, paddingTop: 8, backgroundColor: "#fff" },
  headerRow: { height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
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

  summaryBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  summaryTitle: { fontSize: 16, fontWeight: "700", color: "#333" },
  arrow: { fontSize: 18, color: "#555", padding: 4 },
  summaryText: { fontSize: 14, color: "#333", lineHeight: 20 },

  detailBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#ddd" },
  detailRow: { fontSize: 13, color: "#555", marginBottom: 6 },

  reserveBtn: {
    marginTop: 20,
    backgroundColor: Color.primary || "#978773",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  reserveBtnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
