// components/SearchResults.js (revamped UI)
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import useBookingStore from '../stores/bookingStore';
import { getHotelByName } from '../stores/hotelCatalog';

function getImageForCity(city) {
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
      default:
        return require('../assets/seoul_1.webp');
    }
  } catch (e) {
    return require('../assets/seoul_1.webp');
  }
}

function HotelSummary({ name, address, city }) {
  const img = getImageForCity(city);
  return (
    <View style={s.hotelSummary}>
      <Image source={img} style={s.hotelThumb} resizeMode="cover" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={s.hotelName}>{name}</Text>
        <Text style={s.hotelInfo}>호텔성급 5성급</Text>
        <Text style={s.hotelAddr}>{address}</Text>
        <Text style={s.checkInfo}>체크인/아웃 · 15:00 / 11:00</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Pressable style={s.likeBtn}><Text style={s.likeTxt}>♡ 관심</Text></Pressable>
          <Pressable style={s.fastBtn}><Text style={s.fastTxt}>최저가로 바로 예약하기 →</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

export default function SearchResults({ navigation }) {
  const hotelList = useBookingStore((s) => s.hotelList);
  const [tab, setTab] = useState('room');

  const hotels = useMemo(() => {
    const picked = Array.isArray(hotelList) ? hotelList : [];
    if (!picked.length) return [];
    return picked.map((name) => getHotelByName(name)).filter(Boolean);
  }, [hotelList]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.backBtn}><Text style={s.backTxt}>‹</Text></Pressable>
        <Text style={s.headerTitle}>객실 선택</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView bounces={false} overScrollMode="never" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ padding: 16 }}>
          {hotels[0] && (
            <HotelSummary name={hotels[0].name} address={hotels[0].address} city={hotels[0].city} />
          )}

          {/* Tabs */}
          <View style={s.tabsRow}>
            <Pressable onPress={() => setTab('room')} style={[s.tabBtn, tab==='room' && s.tabActive]}>
              <Text style={[s.tabTxt, tab==='room' && s.tabTxtActive]}>룸 프로모션</Text>
            </Pressable>
            <Pressable onPress={() => setTab('pkg')} style={[s.tabBtn, tab==='pkg' && s.tabActive]}>
              <Text style={[s.tabTxt, tab==='pkg' && s.tabTxtActive]}>패키지</Text>
            </Pressable>
          </View>

          {/* Filters row */}
          <View style={s.filtersRow}>
            <Pressable style={s.filterChip}><Text>낮은 요금순 ▾</Text></Pressable>
            <Pressable style={s.filterChip}><Text>침대타입 ▾</Text></Pressable>
            <Pressable style={s.filterChip}><Text>전망타입 ▾</Text></Pressable>
            <Pressable style={[s.filterChip, { width: 34 }]}><Text>↻</Text></Pressable>
          </View>
          <View style={{ flexDirection:'row', alignItems:'center', marginTop: 10 }}>
            <Pressable style={s.taxCheck}><Text style={{ color:'#fff', fontWeight:'700' }}>✓</Text></Pressable>
            <Text style={{ marginLeft: 8, color:'#5b5048' }}>세금, 봉사료 포함 보기</Text>
          </View>
        </View>

        {/* Room list */}
        <View style={{ paddingHorizontal: 16 }}>
          {[1,2,3].map((n) => (
            <View key={n} style={s.roomCard}>
              <View style={{ flexDirection:'row', alignItems:'center', marginBottom:8 }}>
                <Text style={s.roomTitle}>그랜드 디럭스 더블 액세서블 룸</Text>
              </View>
              <View style={s.memberBox}><Text style={s.memberTxt}>리워즈 회원요금{String.fromCharCode(10)}787,710 KRW</Text></View>
              <View style={s.normalBox}><Text style={s.normalTxt}>일반요금{String.fromCharCode(10)}847,000 KRW</Text></View>
              <Pressable style={s.roomCta}><Text style={s.roomCtaTxt}>객실 더보기 →</Text></Pressable>
            </View>
          ))}
        </View>

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
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 22, color: '#111' },

  hotelSummary: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  hotelThumb: { width: 110, height: 110 },
  hotelName: { fontSize: 18, fontWeight: '700', color: '#111' },
  hotelInfo: { color: '#816C5B', marginTop: 4 },
  hotelAddr: { color: '#666', marginTop: 4 },
  checkInfo: { color: '#666', marginTop: 4 },
  likeBtn: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginRight: 8 },
  likeTxt: { color: '#444' },
  fastBtn: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#c96e45', borderRadius: 6 },
  fastTxt: { color: '#fff', fontWeight: '700' },

  tabsRow: { flexDirection: 'row', marginTop: 16 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: '#ddd', marginRight: 8 },
  tabActive: { backgroundColor: '#000', borderColor: '#000' },
  tabTxt: { color: '#000' },
  tabTxtActive: { color: '#fff', fontWeight: '600' },

  filtersRow: { flexDirection: 'row', marginTop: 12, gap: 8, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  taxCheck: { width: 18, height: 18, borderRadius: 4, backgroundColor: '#8a6a54', alignItems: 'center', justifyContent: 'center' },

  roomCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee', marginBottom: 16 },
  roomTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  memberBox: { backgroundColor: '#8a6a54', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 12 },
  memberTxt: { color: '#fff', fontWeight: '700' },
  normalBox: { borderWidth: 1, borderColor: '#ddd', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: 12, marginTop: 4 },
  normalTxt: { color: '#111', fontWeight: '700' },
  roomCta: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, backgroundColor: '#111' },
  roomCtaTxt: { color: '#fff', fontWeight: '600' },
});

