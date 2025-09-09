import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function DummyIcon() {
  return <View style={{width:45, height:45, backgroundColor:'#eee', borderRadius:12}} />;
}

export default function Promotion() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconRow}>
        <View style={styles.iconBlock}>
          <DummyIcon />
          <Text style={styles.iconText}>프로모션</Text>
        </View>
        <View style={styles.iconBlock}>
          <DummyIcon />
          <Text style={styles.iconText}>이벤트</Text>
        </View>
        <View style={styles.iconBlock}>
          <DummyIcon />
          <Text style={styles.iconText}>쿠폰</Text>
        </View>
        <View style={styles.iconBlock}>
          <DummyIcon />
          <Text style={styles.iconText}>e-SHOP</Text>
        </View>
        <View style={styles.iconBlock}>
          <DummyIcon />
          <Text style={styles.iconText}>최근 본 상품</Text>
        </View>
      </View>
      <View style={styles.bannerBox}>
        <Image
          source={require('../assets/rewards.jpg')}
          style={styles.bannerImg}
          resizeMode="cover"
        />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerText}>설레는 첫 만남,{'\n'}리워즈 신규 가입 이벤트</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 36,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBlock: {
    alignItems: 'center',
    width: 64,
  },
  iconText: {
    marginTop: 6,
    fontSize: 13,
    color: '#222',
  },
  bannerBox: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  bannerImg: {
    width: '100%',
    height: 125,
  },
  bannerTextWrap: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 125,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    justifyContent: 'center',
  },
});
