// Reservation.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import useBookingStore from '../stores/bookingStore';

const strip = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmt = (d) =>
  `${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일(${['일', '월', '화', '수', '목', '금', '토'][d.getDay()]})`;
const nights = (s, e) => Math.max(1, Math.round((strip(e) - strip(s)) / 86400000));

const InfoRow = ({ label, value, subValue, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subValue && <Text style={styles.subValue}>{subValue}</Text>}
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

export default function Reservation({ navigation }) {
  const [activeTab, setActiveTab] = useState('객실');

  // ✅ zustand에서 읽기
  const hotelList = useBookingStore((s) => s.hotelList);
  const startDate = useBookingStore((s) => s.startDate);
  const endDate = useBookingStore((s) => s.endDate);
  const setDates = useBookingStore((s) => s.setDates);
  const guests = useBookingStore((s) => s.guests);

  // 호텔 표시
  const buildHotelDisplay = (list) => {
    if (!list || list.length === 0) return '호텔을 선택해 주세요.';
    if (list.length === 1) return list[0];
    return `${list[0]} 외 ${list.length - 1}`;
  };
  const hotelDisplay = buildHotelDisplay(hotelList);

  // 날짜 기본값
  const today = strip(new Date());
  const start = startDate ?? today;
  const end = endDate ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // 인원 표시
  const summarizeGuests = (arr) => {
    const list = (Array.isArray(arr) && arr.length > 0) ? arr : [{ adults: 2, children: 0 }];
    const rooms = list.length;
    const adults = list.reduce((a, r) => a + (r.adults || 0), 0);
    const children = list.reduce((a, r) => a + (r.children || 0), 0);
    return { rooms, adults, children };
  };
  const { rooms, adults, children } = summarizeGuests(guests);

  return (
    <View style={styles.container}>
      {/* 본문 */}
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../assets/ulsan_3.webp')}
          style={styles.header}
          imageStyle={{ opacity: 0.5 }}
        >
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.closeTxt}>×</Text>
            </Pressable>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === '객실' && styles.activeTab]}
                onPress={() => setActiveTab('객실')}
              >
                <Text style={[styles.tabText, activeTab === '객실' && styles.activeTabText]}>객실</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === '다이닝' && styles.activeTab]}
                onPress={() => setActiveTab('다이닝')}
              >
                <Text style={[styles.tabText, activeTab === '다이닝' && styles.activeTabText]}>다이닝</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* 본문 내용: 하단 버튼 높이만큼 여백 추가 */}
        <View style={[styles.scrollContent, { paddingBottom: 80 }]}>
          <InfoRow label="호텔/지역" value={hotelDisplay} onPress={() => navigation.navigate('HotelSelect')} />
          <InfoRow
            label="체크인/아웃"
            value={`${fmt(start)} ~ ${fmt(end)} / ${nights(start, end)}박`}
            onPress={() =>
              navigation.navigate('DateSelect', {
                initialStart: startDate ?? start,
                initialEnd: endDate ?? end,
                popAfterConfirm: 1,
                onPicked: (s, e) => setDates(s, e),
              })
            }
          />
          <InfoRow
            label="객실/인원"
            value={`객실 ${rooms} / 성인 ${adults}, 어린이 ${children}`}
            onPress={() => navigation.navigate('GuestsSelect')}
          />

          <TouchableOpacity style={styles.promoContainer}>
            <Text style={styles.promoText}>프로모션 코드</Text>
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
            <View style={styles.rewardsBanner}>
              <Image source={require('../assets/rewards.jpg')} style={styles.rewardsImage} resizeMode="cover" />
              <View style={styles.rewardsTextContainer}>
                <Text style={styles.rewardsText}>리워즈 회원가입하고 혜택받으세요.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 하단 고정 버튼 */}
      <View style={styles.searchButtonWrap}>
        <Pressable
          style={({ pressed }) => [styles.searchButton, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: '#333' }}
          onPress={() => console.log('검색 실행')}
        >
          <Text style={styles.searchButtonText}>검색</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 150,
    position: 'relative',
    backgroundColor: '#000',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    color: '#fff',
    fontWeight: "100",
    fontSize: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(86, 86, 86, 1)',
    borderRadius: 20,
    marginTop: 80,
  },
  tab: {
    paddingVertical: 11,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  subValue: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#000',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  promoText: {
    marginLeft: 8,
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#555',
  },
  bottomContainer: {
    padding: 10,
  },
  rewardsBanner: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  rewardsImage: {
    width: '100%',
    height: 100,
    opacity: 0.7,
  },
  rewardsTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: 20,
  },
  rewardsText: {
    color: '#fff',
    fontSize: 16,
  },
  searchButtonWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  searchButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});