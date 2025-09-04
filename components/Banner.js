import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TopBar from './TopBar';
import Searchico from '../assets/ico/search.svg';
import Nextico from '../assets/ico/next.svg';

const bannerImages = [
  require('../assets/banner1.webp'),
  require('../assets/banner2.webp'),
  require('../assets/banner3.webp'),
  require('../assets/banner4.webp'),
];

export default function Banner({ slideIndex }) {
  return (
    <ImageBackground
      source={bannerImages[slideIndex - 1]}
      style={styles.bannerBackground}
      resizeMode="cover"
    >
      <TopBar />
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
        <View style={{ paddingLeft:8}}>
          <Searchico style={{paddingLeft: 20}}/>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bannerBackground: {
    position: 'relative',
    height: 410,
    paddingTop: 56, // TopBar 높이만큼 패딩
    paddingHorizontal: 16,
    justifyContent: 'space-between',
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
  },
  slideText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
