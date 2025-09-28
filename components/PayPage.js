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
  Modal,
} from "react-native";
import Color from "./styles/color";

const H_PADDING = 16;

const COUNTRY_CODES = [
  { label: "대한민국 (+82)", code: "+82" },
  { label: "미국 (+1)", code: "+1" },
  { label: "일본 (+81)", code: "+81" },
  { label: "중국 (+86)", code: "+86" },
];

const CARD_TYPES = ["Visa", "Mastercard", "American Express", "국내 신용카드"];

const ONLINE_CARD_OPTIONS = [
  { id: "domestic-card", label: "국내 신용카드" },
  { id: "international-card", label: "해외 신용카드" },
];

const ONLINE_WALLETS = [
  { id: "lpay", label: "L.pay", color: "#0070ff" },
  { id: "npay", label: "N pay", color: "#03c75a" },
  { id: "kakaopay", label: "카카오페이", color: "#191919" },
  { id: "tosspay", label: "toss pay", color: "#0064ff" },
  { id: "payco", label: "PAYCO", color: "#ff3b30" },
  { id: "samsungpay", label: "SAMSUNG pay", color: "#1428a0" },
  { id: "ssgpay", label: "SSGPAY", color: "#c8513f" },
];

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
function Input({ label, required, value, onChangeText, placeholder, renderTop, ...textInputProps }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        {label}{required && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      {renderTop ? <View style={{ marginBottom: 8 }}>{renderTop()}</View> : null}
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
        {...textInputProps}
      />
    </View>
  );
}

/* =================== Section =================== */
function Section({ title, children, collapsible, isOpen = true, onToggle }) {
  const showContent = !collapsible || isOpen;

  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {collapsible && (
          <Pressable accessibilityRole="button" onPress={onToggle} hitSlop={8}>
            <Text style={styles.sectionToggle}>{isOpen ? "-" : "+"}</Text>
          </Pressable>
        )}
      </View>
      {showContent ? <View style={styles.sectionBody}>{children}</View> : null}
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
  const [showGuestInfo, setShowGuestInfo] = useState(true);
  const [showRequestInfo, setShowRequestInfo] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("onsite");
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState("");
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [cardTypeModalVisible, setCardTypeModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [selectedCardType, setSelectedCardType] = useState("");

  // 입력 상태
  const [inputs, setInputs] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    arrivalTime: "",
    service: "",
    countryCode: COUNTRY_CODES[0].code,
    cardNumber: "",
    cardExpiry: "",
    cardType: "",
  });

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    handleChange("countryCode", country.code);
    setCountryModalVisible(false);
  };

  const handleSelectCardType = (type) => {
    setSelectedCardType(type);
    handleChange("cardType", type);
    setCardTypeModalVisible(false);
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === "online") {
      setSelectedCardType("");
      handleChange("cardNumber", "");
      handleChange("cardExpiry", "");
      handleChange("cardType", "");
    } else {
      setSelectedOnlineMethod("");
    }
  };

  const handleSelectOnlineMethod = (id) => {
    setSelectedOnlineMethod((prev) => (prev === id ? "" : id));
  };

  // 유효성 검사
  const validate = () => {
    if (!inputs.lastName || !inputs.firstName || !inputs.email || !inputs.phone) {
      Alert.alert("입력 오류", "필수 항목을 모두 입력해주세요.");
      return false;
    }

    if (paymentMethod === "onsite") {
      if (!inputs.cardNumber || !inputs.cardExpiry || !inputs.cardType) {
        Alert.alert("입력 오류", "카드 정보를 모두 입력해주세요.");
        return false;
      }
    } else {
      if (!selectedOnlineMethod) {
        Alert.alert("입력 오류", "온라인 결제 수단을 선택해주세요.");
        return false;
      }
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
        <Section
          title="예약자 정보"
          collapsible
          isOpen={showGuestInfo}
          onToggle={() => setShowGuestInfo((prev) => !prev)}
        >
          <Input
            label="성(여권명)"
            required
            placeholder={"성(영어)"}
            value={inputs.lastName}
            onChangeText={(v) => handleChange("lastName", v)}
          />
          <Input
            label="이름(여권명)"
            required
            placeholder={"이름(영어)"}
            value={inputs.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
          />
          <Input
            label="이메일"
            required
            placeholder={"이메일 입력"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={inputs.email}
            onChangeText={(v) => handleChange("email", v)}
          />
          <Input
            label="연락처"
            placeholder={"연락처 입력"}
            required
            keyboardType="phone-pad"
            value={inputs.phone}
            onChangeText={(v) => handleChange("phone", v)}
            renderTop={() => (
              <Pressable
                style={styles.countrySelect}
                onPress={() => setCountryModalVisible(true)}
                accessibilityRole="button"
              >
                <Text style={styles.countrySelectText}>{selectedCountry.label}</Text>
                <Text style={styles.countrySelectArrow}>⌄</Text>
              </Pressable>
            )}
          />
          <Input
            label="도착 예정 시간"
            placeholder="15:00"
            value={inputs.arrivalTime}
            onChangeText={(v) => handleChange("arrivalTime", v)}
          />
        </Section>

        <Section
          title="요청 사항"
          collapsible
          isOpen={showRequestInfo}
          onToggle={() => setShowRequestInfo((prev) => !prev)}
        >
          <Text style={styles.requestLabel}>요청 내용</Text>
          <TextInput
            style={styles.requestInput}
            placeholder="예시) 엑스트라 베드를 요청합니다."
            value={inputs.service}
            onChangeText={(v) => handleChange("service", v)}
            maxLength={500}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.requestCounterRow}>
            <Text style={styles.requestCounterCurrent}>
              {inputs.service.length}
              <Text style={styles.requestCounterTotal}> / 500</Text>
            </Text>
          </View>
          <View style={styles.requestNotes}>
            <Text style={styles.requestNote}>- 엑스트라 베드가 필요하신 경우 1박당 60,500원이 부과됩니다.</Text>
            <Text style={styles.requestNote}>(인원 추가요금 별도 / 그랜드디럭스, 코리안타입 및 일부객실 설치 불가)</Text>
            <Text style={styles.requestNote}>- 인원 추가는 예약시점으로 가능하며, 추후 추가시에는 1박 1인당 60,500원입니다.</Text>
            <Text style={styles.requestNote}>- 필요한 유아용품이 있으신 경우 요청사항으로 남겨 주십시오.</Text>
            <Text style={styles.requestNote}>(예: 아기침대, 욕실용 발판 등)</Text>
          </View>
        </Section>

        <Section title="결제 정보">
          <View style={styles.paymentTabRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleSelectPaymentMethod("online")}
              style={[
                styles.paymentTab,
                paymentMethod === "online" ? styles.paymentTabActive : styles.paymentTabInactive,
              ]}
            >
              <Text
                style={[
                  styles.paymentTabText,
                  paymentMethod === "online"
                    ? styles.paymentTabTextActive
                    : styles.paymentTabTextInactive,
                ]}
              >
                온라인 결제
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => handleSelectPaymentMethod("onsite")}
              style={[
                styles.paymentTab,
                paymentMethod === "onsite" ? styles.paymentTabActive : styles.paymentTabInactive,
              ]}
            >
              <Text
                style={[
                  styles.paymentTabText,
                  paymentMethod === "onsite"
                    ? styles.paymentTabTextActive
                    : styles.paymentTabTextInactive,
                ]}
              >
                현장 결제
              </Text>
            </Pressable>
          </View>

          {paymentMethod === "onsite" ? (
            <>
              <Text style={styles.paymentSubTitle}>개런티 카드 정보</Text>

              <Input
                label="신용카드번호"
                required
                placeholder="0000 - 0000 - 0000 - 0000"
                keyboardType="number-pad"
                value={inputs.cardNumber}
                onChangeText={(v) => handleChange("cardNumber", v)}
              />
              <Input
                label="유효기간"
                required
                placeholder="MM / YY"
                value={inputs.cardExpiry}
                onChangeText={(v) => handleChange("cardExpiry", v)}
              />

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                  카드 종류<Text style={{ color: "red" }}> *</Text>
                </Text>
                <Pressable
                  style={styles.cardTypeSelect}
                  onPress={() => setCardTypeModalVisible(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.cardTypeText}>
                    {selectedCardType || "카드 선택"}
                  </Text>
                  <Text style={styles.cardTypeArrow}>⌄</Text>
                </Pressable>
              </View>

              <View style={styles.paymentNotes}>
                <Text style={styles.paymentNote}>- 신용카드 정보는 개런티/위약금 결제를 위해 이용되며, 객실요금은 추후 체크인 시 결제됩니다.</Text>
                <Text style={styles.paymentNote}>- 체크인 시 개런티 카드가 아닌 다른 신용카드 또는 현금 결제도 가능합니다.</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.paymentSubTitle}>결제 수단 선택</Text>
              <View style={styles.paymentChoiceColumn}>
                {ONLINE_CARD_OPTIONS.map((option) => {
                  const selected = selectedOnlineMethod === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="button"
                      onPress={() => handleSelectOnlineMethod(option.id)}
                      style={[
                        styles.paymentChoiceBox,
                        selected && styles.paymentChoiceBoxSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paymentChoiceLabel,
                          selected && styles.paymentChoiceLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.paymentWalletGrid}>
                {ONLINE_WALLETS.map((wallet) => {
                  const selected = selectedOnlineMethod === wallet.id;
                  return (
                    <Pressable
                      key={wallet.id}
                      accessibilityRole="button"
                      onPress={() => handleSelectOnlineMethod(wallet.id)}
                      style={[
                        styles.paymentWalletItem,
                        selected && styles.paymentChoiceBoxSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paymentWalletLabel,
                          wallet.color ? { color: wallet.color } : null,
                        ]}
                      >
                        {wallet.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
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

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>국가 선택</Text>
            {COUNTRY_CODES.map((country) => (
              <Pressable
                key={country.code}
                style={styles.modalItem}
                onPress={() => handleSelectCountry(country)}
              >
                <Text style={styles.modalItemText}>{country.label}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalClose} onPress={() => setCountryModalVisible(false)}>
              <Text style={styles.modalCloseTxt}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={cardTypeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCardTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>카드 종류 선택</Text>
            {CARD_TYPES.map((type) => (
              <Pressable
                key={type}
                style={styles.modalItem}
                onPress={() => handleSelectCardType(type)}
              >
                <Text style={styles.modalItemText}>{type}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalClose} onPress={() => setCardTypeModalVisible(false)}>
              <Text style={styles.modalCloseTxt}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  sectionWrap: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111" },
  sectionToggle: { fontSize: 24, color: "#555" },
  sectionBody: { marginTop: 16 },

  requestLabel: { fontWeight: "700", marginBottom: 8, color: "#111" },
  requestInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 140,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#333",
  },
  requestCounterRow: { marginTop: 8, alignItems: "flex-end" },
  requestCounterCurrent: { fontSize: 12, color: "#111" },
  requestCounterTotal: { fontSize: 12, color: "#999" },
  requestNotes: { marginTop: 16, gap: 6 },
  requestNote: { fontSize: 12, color: "#777", lineHeight: 18 },

  paymentTabRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },
  paymentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentTabInactive: { backgroundColor: "#f2f2f2" },
  paymentTabActive: { backgroundColor: Color.primary || "#978773" },
  paymentTabText: { fontSize: 13, fontWeight: "600" },
  paymentTabTextInactive: { color: "#666" },
  paymentTabTextActive: { color: "#fff" },

  paymentSubTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 16 },
  paymentChoiceColumn: { gap: 12, marginBottom: 20 },
  paymentChoiceBox: {
    borderWidth: 1,
    borderColor: "#cdb89f",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentChoiceBoxSelected: { borderColor: Color.primary || "#978773", backgroundColor: "#f7f3ef" },
  paymentChoiceLabel: { fontSize: 14, color: "#5c5146", fontWeight: "600" },
  paymentChoiceLabelSelected: { color: Color.primary || "#978773" },
  paymentWalletGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  paymentWalletItem: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  paymentWalletLabel: { fontSize: 14, fontWeight: "700", color: "#333" },
  cardTypeSelect: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTypeText: { fontSize: 14, color: "#333" },
  cardTypeArrow: { fontSize: 16, color: "#555" },
  paymentNotes: {
    marginTop: 16,
    backgroundColor: "#f7f5f3",
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  paymentNote: { fontSize: 12, color: "#666", lineHeight: 18 },

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

  countrySelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  countrySelectText: { fontSize: 14, color: "#333" },
  countrySelectArrow: { fontSize: 16, color: "#555" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#111" },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  modalItemText: { fontSize: 14, color: "#333" },
  modalClose: { marginTop: 12, alignSelf: "flex-end" },
  modalCloseTxt: { color: Color.primary || "#978773", fontWeight: "600" },
});

