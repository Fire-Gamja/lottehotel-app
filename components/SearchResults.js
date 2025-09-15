// components/SearchResults.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import useBookingStore from '../stores/bookingStore';
import { HOTELS, getHotelByName } from '../stores/hotelCatalog';

function getImageForCity(city) {
  // Use static requires for bundlers
  try {
    switch (city) {
      case '서울':
        return require('../assets/seoul_3.webp');
      case '부산':
        return require('../assets/busan_3.webp');
      case '울산':
        return require('../assets/ulsan_3.webp');
      case '제주':
        return require('../assets/jeju_3.webp');
      case '대전':
        return require('../assets/dejeon_2.webp');
      case '속초':
        return require('../assets/home_bottom_2.webp');
      default:
        return require('../assets/seoul_1.webp');
    }
  } catch (e) {
    return require('../assets/seoul_1.webp');
  }
}

function HotelCard({ name, address, city }) {
  const img = getImageForCity(city);
  return (
    <View style={s.card}>
      <Image source={img} style={s.cardImg} resizeMode="cover" />
      <View style={s.cardBody}>
        <Text style={s.cardTitle}>{name}</Text>
        <Text style={s.cardSub}>{address}</Text>
        <View style={s.badgesRow}>
          <Text style={[s.badge, s.badgePrimary]}>무료 취소</Text>
          <Text style={[s.badge, s.badgeOutline]}>조식 포함</Text>
          <Text style={[s.badge, s.badgeOutline]}>최저가 보장</Text>
        </View>
        <View style={s.actionsRow}>
          <View>
            <Text style={s.priceHint}>세금/봉사료 포함</Text>
            <Text style={s.price}>₩ 250,000 ~</Text>
          </View>
          <Pressable style={s.ctaBtn} android_ripple={{ color: '#d56f3e' }}>
            <Text style={s.ctaTxt}>요금 보기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SearchResults({ navigation }) {
  const hotelList = useBookingStore((s) => s.hotelList);
  const startDate = useBookingStore((s) => s.startDate);
  const endDate = useBookingStore((s) => s.endDate);
  const guests = useBookingStore((s) => s.guests);

  const picked = Array.isArray(hotelList) ? hotelList : [];
  const hotels = useMemo(() => {
    if (!picked.length) return [];
    return picked
      .map((name) => getHotelByName(name))
      .filter(Boolean);
  }, [picked]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backTxt}>←</Text>
        </Pressable>
        <Text style={s.headerTitle}>검색 결과</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView bounces={false} overScrollMode="never" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={s.summary}>
          <Text style={s.summaryTxt}>
            선택한 호텔 {hotels.length}개
          </Text>
        </View>

        {hotels.map((h) => (
          <HotelCard key={h.name} name={h.name} address={h.address} city={h.city} />
        ))}

        {hotels.length === 0 && (
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>선택한 호텔이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: '#111' },
  summary: { paddingHorizontal: 16, paddingVertical: 12 },
  summaryTxt: { color: '#444' },

  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  cardImg: { width: '100%', height: 160 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  cardSub: { marginTop: 6, color: '#666' },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12 },
  badgePrimary: { backgroundColor: '#f1e3db', color: '#a24b22' },
  badgeOutline: { borderWidth: 1, borderColor: '#eee', color: '#666' },
  actionsRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceHint: { color: '#9a9aa0', fontSize: 12 },
  price: { marginTop: 4, fontSize: 18, fontWeight: '700', color: '#222' },
  ctaBtn: { backgroundColor: '#c96e45', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 4 },
  ctaTxt: { color: '#fff', fontWeight: '600' },
});

