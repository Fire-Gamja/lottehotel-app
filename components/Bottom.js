import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/home_bottom_1.webp'),
  require('../assets/home_bottom_2.webp'),
];

export default function Bottom() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (width - 32));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {images.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>{currentIndex + 1} / {images.length}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>개인보 처리방침</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  sliderWrapper: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingRight: 0,
  },
  image: {
    width: width - 32, // 마진 양쪽 16
    height: 180,
    marginRight: 0,
  },
  indicator: {
    position: 'absolute',
    bottom: 12,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    height: 200,
    top: 20,
    padding: 24,
    backgroundColor: '#000',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
