// Reservation.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// navigation prop을 받아옵니다.
export default function Reservation({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 닫기 버튼 추가 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()} // 뒤로가기 기능으로 모달을 닫습니다.
      >
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>예약하기</Text>
        <Text style={styles.subtitle}>
          여기에 예약 관련 UI (날짜 선택, 호텔 검색 등)가 들어갈 예정입니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});