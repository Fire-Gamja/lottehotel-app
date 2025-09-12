import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import useHomeStore from '../stores/homeStore';

import Searchico from '../assets/ico/search.svg';
import Nextico from '../assets/ico/next.svg';

const { width } = Dimensions.get('window');

const bannerImages = [
  require('../assets/banner1.webp'),
  require('../assets/banner2.webp'),
  require('../assets/banner3.webp'),
  require('../assets/banner4.webp'),
];

export default function Banner() {
  const slideIndex = useHomeStore((state) => state.slideIndex);
  const translateX = useSharedValue(0);

  // 이미지 인덱스 변경 시 슬라이드 애니메이션
  useEffect(() => {
    translateX.value = withTiming(-(slideIndex - 1) * width, { duration: 400 });
  }, [slideIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.bannerContainer}>
      <Animated.View style={[styles.imageRow, animatedStyle]}>
        {bannerImages.map((img, idx) => (
          <Image key={idx} source={img} style={styles.bannerImage} />
        ))}
      </Animated.View>

      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "transparent"]}
        style={styles.gradientOverlay}
      />

      <View style={styles.bannerTextBlock}>
        <Text style={styles.bannerTitle}>Cathay member exclusive</Text>
        <View style={styles.bannerSubRow}>
          <Text style={styles.linkText}>자세히 보기 →</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <View style={{ paddingLeft: 8 }}>
          <Searchico />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="호텔, 명소, 도시를 검색해 보세요"
          placeholderTextColor="#999"
        />
        <Nextico />
      </View>

      <View style={styles.slideIndicator}>
        <Text style={styles.slideText}>{slideIndex} / 4  ⏸</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: 410,
    paddingTop: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    overflow: 'hidden', // 슬라이드가 밖으로 튀어나가지 않게
  },
  imageRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bannerImage: {
    width: width,
    height: 410,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  bannerTextBlock: {
    marginTop: 145,
    zIndex: 2,
  },
  bannerTitle: {
    fontFamily: 'pretendard',
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  bannerSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
  searchBox: {
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 62,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 16,
    fontSize: 14,
  },
  slideIndicator: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  slideText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
