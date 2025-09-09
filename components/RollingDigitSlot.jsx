import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';

export default function RollingDigitSlot({ digit }) {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(null);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (digit !== displayDigit) {
      setNextDigit(digit); // 다음 숫자 저장
      translateY.setValue(-26); // 새 숫자를 위에 숨겨두고
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start(() => {
        setDisplayDigit(digit); // 애니메이션 후 숫자 교체
        setNextDigit(null); // 다음 숫자 제거
      });
    }
  }, [digit]);

  return (
    <View style={{ height: 26, overflow: 'hidden' }}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Text style={styles.digit}>{nextDigit ?? displayDigit}</Text>
        <Text style={styles.digit}>{displayDigit}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  digit: {
    height: 26,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
    width: 16,
  },
});
