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

// 각 항목을 위한 재사용 가능한 컴포넌트
const InfoRow = ({ label, value, subValue }) => (
  <TouchableOpacity style={styles.row}>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subValue && <Text style={styles.subValue}>{subValue}</Text>}
    </View>
    <Ionicons name="chevron-forward-outline" size={24} color="#000" />
  </TouchableOpacity>
);

export default function Reservation({ navigation }) {
  const [activeTab, setActiveTab] = useState('객실');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Background Image */}
      <ImageBackground
        source={require('../assets/ulsan_3.webp')}
        style={styles.header}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          {/* Top part of the header */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Bottom part of the header */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === '객실' && styles.activeTab
              ]}
              onPress={() => setActiveTab('객실')}>
              <Text style={[styles.tabText, activeTab === '객실' && styles.activeTabText]}>객실</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === '다이닝' && styles.activeTab
              ]}
              onPress={() => setActiveTab('다이닝')}>
              <Text style={[styles.tabText, activeTab === '다이닝' && styles.activeTabText]}>다이닝</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          <InfoRow label="호텔/지역" value="호텔을 선택해 주세요." />
          <InfoRow label="체크인/아웃" value="09월 04일(목) ~ 09월 05일(금) / 1박" />
          <InfoRow label="객실/인원" value="객실 1 / 성인 2, 어린이 0" />
          <TouchableOpacity style={styles.promoContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#555" />
            <Text style={styles.promoText}>프로모션 코드</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Fixed Area */}
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
    fontWeight: 'normal',
    color: '#fff',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'regular',
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
    fontWeight: 'regular',
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
    fontWeight: 'regular',
  },
});