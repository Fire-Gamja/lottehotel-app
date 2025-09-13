import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const data = {
  Room: {
    mainImage: require('../assets/p_r_header.webp'),
    tags: ['#여름', '#바캉스', '#리워즈', '#휴가'],
    thumbnails: [
      { image: require('../assets/p_r_t_1.webp'), tags: ['#얼리버드', '#사진예약할인'] },
      { image: require('../assets/p_r_t_2.webp'), tags: ['#가족', '#가족여행', '#호캉스', '#행복한하루'] },
      { image: require('../assets/p_r_t_3.webp'), tags: ['#조식', '#모닝뷔페', '#건강한아침', '#맛있는시작'] },
      { image: require('../assets/p_r_t_4.webp'), tags: ['#연인', '#로맨틱', '#데이트'] },
    ],
  },
  Dining: {
    mainImage: require('../assets/p_d_header.webp'),
    tags: ['#여름의시작', '#프리미엄망고빙수', '#달콤한여름'],
    thumbnails: [
      { image: require('../assets/p_d_t_1.webp'), tags: ['#애프터눈티', '#오후의여유', '#티타임'] },
      { image: require('../assets/p_d_t_2.webp'), tags: ['#서울호텔', '#서울다이닝', '#김치맛', '#호텔다이닝'] },
      { image: require('../assets/p_d_t_3.webp'), tags: ['#써머드림', '#부산호텔', '#다이닝', '#중식냉면'] },
      { image: require('../assets/p_d_t_4.jpg'), tags: ['#라운지바', '#시그니처칵테일'] },
    ],
  },
};

export default function PromotionSection() {
  const [selected, setSelected] = useState('Room');
  const content = data[selected];
const repeatedThumbnails = Array.from({ length: 50 }, (_, i) => content.thumbnails[i % content.thumbnails.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promotion & Packages</Text>

      {/* 버튼 영역 */}
      <View style={styles.buttonRow}>
        {['Room', 'Dining'].map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.button, selected === item && styles.buttonActive]}
            onPress={() => setSelected(item)}>
            <Text style={[styles.buttonText, selected === item && styles.buttonTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 메인 이미지 */}
      <Image source={content.mainImage} style={styles.mainImage} resizeMode="cover" />

      {/* 태그 */}
      <Text style={styles.tags}>{content.tags.join(' ')}</Text>

      {/* 썸네일 슬라이더 */}
      <View style={{ marginleft: 16, marginRight: -20, overflow: 'hidden' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailRow}>
          {repeatedThumbnails.map((thumb, idx) => (
            <View key={idx} style={styles.thumbBox}>
              <Image source={thumb.image} style={styles.thumbImage} resizeMode="cover" />
              <Text style={styles.thumbTags}>{thumb.tags.join(' ')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5ff',
    paddingBottom: 60,

  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonActive: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#000',
  },
  buttonTextActive: {
    color: '#fff',
  },
  mainImage: {
    width: '100%',
    height: width * 0.55,
    marginBottom: 8,
  },
  tags: {
    marginBottom: 30,
    color: '#816C5B',
    fontWeight: '700',
    fontSize: 16,
  },
  thumbnailRow: {
    flexDirection: 'row',
  },
  thumbBox: {
    marginRight: 8,
    width: 150,
  },
  thumbImage: {
    width: '100%',
    height: width * 0.2,
  },
  thumbTags: {
    fontSize: 14,
    color: '#816C5B',
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 25,
  },
});
