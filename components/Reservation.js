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
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    <Ionicons name="chevron-forward-outline" size={24} color="#000" />
  </TouchableOpacity>
);

export default function Reservation({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('객실');

  // ✅ HotelSelect에서 미리 저장해둔 값 (DateSelect에서 날짜를 선택하지 않고 닫아도 유지됨)
  const { hotelList, startDate, endDate } = useBookingStore();

  // "첫번째 호텔 외 N" 포맷터
  const buildHotelDisplay = (list) => {
    if (!list || list.length === 0) return "호텔을 선택해 주세요.";
    if (list.length === 1) return list[0];
    return `${list[0]} 외 ${list.length - 1}`;
  };

  const hotelDisplay = buildHotelDisplay(hotelList);

  // 기본값: 오늘/익일 + DateSelect에서 확정 시 덮어쓰기
  const today = strip(new Date());
  const start = startDate ?? today;
  const end   = endDate   ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/ulsan_3.webp')}
        style={styles.header}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={30} color="#fff" />
          </TouchableOpacity>

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

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <InfoRow
            label="호텔/지역"
            value={hotelDisplay}
            onPress={() => navigation.navigate('HotelSelect')}
          />

          <InfoRow
            label="체크인/아웃"
            value={`${fmt(start)} ~ ${fmt(end)} / ${nights(start, end)}박`}
            onPress={() =>
              navigation.navigate('DateSelect', {
                initialStart: dates.start,
                initialEnd: dates.end,
                popAfterConfirm: 1,
                onPicked: (s, e) => setDates({ start: s, end: e }),
              })
            }
          />

          <InfoRow label="객실/인원" value="객실 1 / 성인 2, 어린이 0" />

          <TouchableOpacity style={styles.promoContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#555" />
            <Text style={styles.promoText}>프로모션 코드</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.rewardsBanner}>
          <Image
            source={require('../assets/rewards.jpg')}
            style={styles.rewardsImage}
            resizeMode="cover"
          />
          <View style={styles.rewardsTextContainer}>
            <Text style={styles.rewardsText}>리워즈 회원가입하고 혜택받으세요.</Text>
          </View>
        </View>

        <View style={{ marginHorizontal: -20 }}>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 120,
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
  closeButton: {
    alignSelf: 'flex-end',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(86, 86, 86, 1)',
    borderRadius: 30,
    marginBottom: 6,
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
  scrollView: {
    flex: 1,
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
    padding: 20,
  },
  rewardsBanner: {
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    marginBottom: 30,
  },
  rewardsImage: {
    width: '100%',
    height: 80,
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
  searchButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 0,
    alignItems: 'center',
    width: '100%',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
