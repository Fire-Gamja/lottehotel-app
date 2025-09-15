import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import SearchIcon from '../assets/ico/search.svg';
import NextIcon from '../assets/ico/next.svg';

const { width } = Dimensions.get('window');

const banners = [
  { image: require('../assets/banner1.webp'), texts: ['Shine Muscat Delight', '자세히 보기 →'] },
  { image: require('../assets/banner2.webp'), texts: ['Exclusive Benefits', '자세히 보기 →'] },
  { image: require('../assets/banner3.webp'), texts: ['City Break Offers', '자세히 보기 →'] },
  { image: require('../assets/banner4.webp'), texts: ['Special Packages', '자세히 보기 →'] },
];

export default function AnimatedBanner() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imageOffset = useSharedValue(0);
  const textAnims = [useSharedValue(1), useSharedValue(1)];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // fade out current texts
      textAnims.forEach(anim => {
        anim.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      });

      setTimeout(() => {
        const nextIndex = (index + 1) % banners.length;
        runOnJS(setIndex)(nextIndex);

        // slide image
        imageOffset.value = withTiming(-nextIndex * width, { duration: 500, easing: Easing.out(Easing.cubic) });

        // fade in next texts staggered
        textAnims.forEach((anim, i) => {
          anim.value = withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
            delay: i * 200,
          });
        });
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [index, isPaused]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageOffset.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, animatedImageStyle]}>
        {banners.map((banner, i) => (
          <Image key={i} source={banner.image} style={styles.image} />
        ))}
      </Animated.View>

      {/* Banner texts */}
      <View style={styles.textContainer}>
        {banners[index].texts.map((t, i) => {
          const animatedTextStyle = useAnimatedStyle(() => ({
            opacity: textAnims[i].value,
            transform: [{ translateY: interpolate(textAnims[i].value, [0, 1], [20, 0]) }],
          }));
          const textStyle = i === 0 ? styles.mainText : styles.subText;
          return (
            <Animated.View key={i} style={[{ marginBottom: 4 }, animatedTextStyle]}>
              <Text style={textStyle}>{t}</Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Indicator (current/total + pause/play) */}
      <View style={styles.indicatorWrap}>
        <Text style={styles.indicatorText}>{`${index + 1}/${banners.length}`}</Text>
        <View style={styles.indicatorDivider} />
        <TouchableOpacity onPress={() => setIsPaused(p => !p)}>
          <Text style={styles.indicatorText}>{isPaused ? '>' : '||'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar overlay */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.searchBar}
        onPress={() => navigation.navigate('ReservationModal')}
      >
        <View style={styles.searchLeft}>
          <SearchIcon width={22} height={22} />
          <Text style={styles.searchPlaceholder}>호텔, 명소, 도시를 검색해 보세요</Text>
        </View>
        <NextIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 410,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  slider: {
    flexDirection: 'row',
    width: width * banners.length,
    height: '100%',
  },
  image: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    position: 'absolute',
    top: 240,
    left: 16,
  },
  mainText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  subText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    top: 12,
  },
  indicatorWrap: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  searchBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  searchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchPlaceholder: {
    color: '#444',
    fontSize: 14,
    fontWeight: '500',
  },
});
