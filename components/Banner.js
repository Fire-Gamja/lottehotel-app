import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
  delay,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const banners = [
  { image: require('../assets/banner1.webp'), texts: ['Cathay member exclusive', '자세히 보기 →'] },
  { image: require('../assets/banner2.webp'), texts: ['두 번째 이미지 텍스트', '자세히 보기 →'] },
  { image: require('../assets/banner3.webp'), texts: ['세 번째 이미지 텍스트', '자세히 보기 →'] },
  { image: require('../assets/banner4.webp'), texts: ['네 번째 이미지 텍스트', '자세히 보기 →'] },
];

export default function AnimatedBanner() {
  const [index, setIndex] = useState(0);
  const imageOffset = useSharedValue(0);
  const textAnims = [useSharedValue(1), useSharedValue(1)]; // 텍스트마다 SharedValue

  useEffect(() => {
    const interval = setInterval(() => {
      // 모든 텍스트 fade out
      textAnims.forEach(anim => {
        anim.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      });

      setTimeout(() => {
        const nextIndex = (index + 1) % banners.length;
        runOnJS(setIndex)(nextIndex);

        // 이미지 이동
        imageOffset.value = withTiming(-nextIndex * width, { duration: 500, easing: Easing.out(Easing.cubic) });

        // 텍스트 순차적 fade in
        textAnims.forEach((anim, i) => {
          anim.value = withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
            delay: i * 200, // 두 번째 텍스트는 200ms 뒤에 등장
          });
        });
      }, 300); // fade out 끝나고 nextIndex 적용
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: imageOffset.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, animatedImageStyle]}>
        {banners.map((banner, i) => (
          <Image key={i} source={banner.image} style={styles.image} />
        ))}
      </Animated.View>
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
    bottom: 50,
    left: 16,
  },
    mainText: {
    fontSize: 24,       // 메인 텍스트 크기
    color: '#fff',
    fontWeight: '600',
  },
  subText: {
    fontSize: 16,       // 서브 텍스트 크기
    color: '#fff',
    fontWeight: '500',
  },
});
