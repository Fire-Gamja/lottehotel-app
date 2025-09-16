import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import SearchIcon from '../assets/ico/search.svg';
import NextIcon from '../assets/ico/next.svg';

const { width } = Dimensions.get('window');

const banners = [
  { image: require('../assets/banner1.webp'), title: 'Shine Muscat Delight', subtitle: '자세히 보기' },
  { image: require('../assets/banner2.webp'), title: 'Exclusive Benefits', subtitle: '자세히 보기' },
  { image: require('../assets/banner3.webp'), title: 'City Break Offers', subtitle: '자세히 보기' },
  { image: require('../assets/banner4.webp'), title: 'Special Packages', subtitle: '자세히 보기' },
];

export default function Banner() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const offset = useSharedValue(0);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const next = (index + 1) % banners.length;
      setIndex(next);
      offset.value = withTiming(-next * width, { duration: 500, easing: Easing.out(Easing.cubic) });
    }, 4000);
    return () => clearInterval(id);
  }, [index, paused]);

  useEffect(() => {
    offset.value = withTiming(-index * width, { duration: 0 });
  }, []);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View style={s.container}>
      <Animated.View style={[s.slider, sliderStyle]}>
        {banners.map((b, i) => (
          <Image key={i} source={b.image} style={s.image} resizeMode="cover" />
        ))}
      </Animated.View>

      <View style={s.textWrap}>
        <Text style={s.title}>{banners[index].title}</Text>
        <Text style={s.subtitle}>{banners[index].subtitle}</Text>
      </View>

      <View style={s.indicator}>
        <Text style={s.indicatorTxt}>{`${index + 1}/${banners.length}`}</Text>
        <TouchableOpacity onPress={() => setPaused(p => !p)}>
          <Text style={[s.indicatorTxt, { marginLeft: 8 }]}>{paused ? '▶' : 'II'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={s.searchBar}
        onPress={() => navigation.navigate('ReservationModal')}
      >
        <View style={s.searchLeft}>
          <SearchIcon width={22} height={22} />
          <Text style={s.searchPlaceholder}>호텔, 명소, 도시를 검색해 보세요</Text>
        </View>
        <NextIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { height: 410, width: '100%', overflow: 'hidden', backgroundColor: '#000' },
  slider: { flexDirection: 'row', width: width * banners.length, height: '100%' },
  image: { width, height: '100%' },
  textWrap: { position: 'absolute', left: 16, bottom: 90 },
  title: { fontSize: 24, color: '#fff', fontWeight: '700' },
  subtitle: { marginTop: 6, fontSize: 16, color: '#fff', fontWeight: '500' },
  indicator: { position: 'absolute', right: 16, bottom: 90, paddingHorizontal: 10, height: 30, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', alignItems: 'center' },
  indicatorTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  searchBar: { position: 'absolute', left: 16, right: 16, bottom: 16, height: 56, backgroundColor: '#fff', borderRadius: 28, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 6 },
  searchLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchPlaceholder: { color: '#444', fontSize: 16, fontWeight: '500' },
});

