import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useBookingStore from '../stores/bookingStore';

export default function ResumePill() {
  const navigation = useNavigation();
  const snapshot = useBookingStore((s) => s.resumeSnapshot);
  const loadResumeToCurrent = useBookingStore((s) => s.loadResumeToCurrent);

  if (!snapshot) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        style={({ pressed }) => [styles.pill, pressed && { opacity: 0.9 }]}
        onPress={() => { loadResumeToCurrent(); navigation.navigate('ReservationModal'); }}
      >
        <Text style={styles.pillTxt}>진행 중인 예약 이어하기 ▾</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 110, top: 70 },
  pill: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  pillTxt: { color: '#111', fontWeight: '700' },
});

