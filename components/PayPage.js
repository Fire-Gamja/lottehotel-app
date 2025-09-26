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
const Paypage = ({ navigation }) => {
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
            <Pressable
                accessibilityRole="button"
                style={s.btnPrimary}
                onPress={() => onSelectOption?.("rewards", room, visiblePrice)}
            >
                <Text style={s.btnPrimaryLbl}>리워즈 회원 요금</Text>
                <Text style={s.btnPrimaryPrice}>{`₩${fmtKRW(
                    visiblePrice
                )} KRW`}</Text>
            </Pressable>
        </View>
    );
};


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
});