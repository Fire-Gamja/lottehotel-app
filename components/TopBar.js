import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import useHomeStore from '../stores/homeStore';

// Import SVG components
import LogoSvg from '../assets/ico/logo.svg';
import MenuSvg from '../assets/ico/menu.svg';

export default function TopBar() {
  // Zustand store에서 스크롤 상태 가져오기
  const isScrolled = useHomeStore((state) => state.isScrolled);

  // Reanimated를 사용한 배경색 애니메이션
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isScrolled ? '#FFFFFF' : 'transparent', {
        duration: 200,
      }),
    };
  });

  // SVG 아이콘 색상을 결정합니다 (스크롤되면 검은색, 아니면 흰색)
  const iconColor = isScrolled ? '#000000' : '#FFFFFF';

  return (
    <Animated.View style={[styles.header, animatedHeaderStyle, isScrolled && styles.scrolledShadow]}>
      <LogoSvg width={150} height={20} fill={iconColor} />
      <TouchableOpacity>
        <MenuSvg width={24} height={24} fill={iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    height: 56,
  },
  scrolledShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});