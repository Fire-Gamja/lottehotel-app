import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Dimensions, Modal, Pressable, Platform, FlatList,
    Animated
} from 'react-native';
import { useFonts, GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import * as SplashScreen from 'expo-splash-screen';

const { width } = Dimensions.get('window');
const regions = ['서울', '부산', '제주', '울산', '대전'];
const countries = ['한국', '아시아', '미국', '러시아'];

const offerData = {
    서울: [
        { hotel: '시그니엘 서울', title: '[평일 한정] Arrive in Style' },
        { hotel: '시그니엘 서울', title: 'Invitation to SIGNIEL' },
        { hotel: '시그니엘 서울', title: 'World Singature' },
        { hotel: '롯데호텔 서울', title: 'Bed & Breakfast' },
        { hotel: '롯데호텔 월드', title: '[홈페이지 한정] 얼리버드 30일 전' },
        { hotel: '시그니엘 서울', title: 'Sweet Moment' },
        { hotel: '시그니엘 서울', title: '소공30데이' },
    ],
    부산: [
        { hotel: '시그니엘 부산', title: 'Sunset Hour' },
        { hotel: '시그니엘 부산', title: 'The Lounge Deligh Course' },
        { hotel: '시그니엘 부산', title: '차오란 런치 셀렉션' },
        { hotel: '롯데호텔 부산', title: 'City Dive' },
        { hotel: '롯데호텔 부산', title: '24 Hours Staycation' },
    ],
    제주: [
        { hotel: '롯데호텔 제주', title: 'My Little Angel' },
        { hotel: '롯데호텔 제주', title: 'Romantic Holiday' },
        { hotel: '롯데호텔 제주', title: 'Golf and Stay' },
        { hotel: '롯데호텔 제주', title: 'Hello Kitty Camellia Edition' },
        { hotel: '롯데호텔 제주', title: '[4박이상] My Long For' },
    ],
    울산: [
        { hotel: '롯데호텔 울산', title: '레지덴셜 스위트 특별요금' },
        { hotel: '롯데호텔 울산', title: 'Signature Grand Wheel' },
        { hotel: '롯데호텔 울산', title: 'Hello! Whale' },
    ],
    대전: [
        { hotel: '롯데시티호텔 대전', title: 'Once In a Lifetime' },
        { hotel: '롯데시티호텔 대전', title: '특별요금' },
    ],
};

const imageMap = {
    서울: [
        require('../assets/seoul_1.webp'),
        require('../assets/seoul_2.webp'),
        require('../assets/seoul_3.webp'),
        require('../assets/seoul_4.webp'),
        require('../assets/seoul_5.webp'),
        require('../assets/seoul_6.webp'),
        require('../assets/seoul_7.webp'),
    ],
    부산: [
        require('../assets/busan_1.webp'),
        require('../assets/busan_2.webp'),
        require('../assets/busan_3.webp'),
        require('../assets/busan_4.webp'),
        require('../assets/busan_5.webp'),
    ],
    제주: [
        require('../assets/jeju_1.webp'),
        require('../assets/jeju_2.webp'),
        require('../assets/jeju_3.webp'),
        require('../assets/jeju_4.webp'),
        require('../assets/jeju_5.webp'),
    ],
    울산: [
        require('../assets/ulsan_1.webp'),
        require('../assets/ulsan_2.webp'),
        require('../assets/ulsan_3.webp'),
    ],
    대전: [
        require('../assets/dejeon_1.webp'),
        require('../assets/dejeon_2.webp'),
    ],
};

export default function SpecialOffers() {
    const [fontsLoaded] = useFonts({ GreatVibes_400Regular });
    const [selectedRegion, setSelectedRegion] = useState('서울');
    const [selectedCountry, setSelectedCountry] = useState('한국');
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    const offers = offerData[selectedRegion];
    const repeatedOffers = Array.from({ length: 100 }, (_, i) => offers[i % offers.length]);
    const CARD_WIDTH = 220;
    const CARD_MARGIN = 16;
    const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../assets/offers_header.webp')} style={styles.headerBg} resizeMode="cover" />
                <View style={styles.headerOverlay} />
            </View>
            <View style={styles.overlay}>
                <Text style={styles.headerTitle}>Special Offers</Text>

                <TouchableOpacity onPress={() => setShowCountryModal(true)}>
                    <Text style={styles.countrySelect}>{selectedCountry} ▼</Text>
                </TouchableOpacity>

                <View style={styles.regionRow}>
                    {regions.map(region => (
                        <TouchableOpacity
                            key={region}
                            style={[styles.regionButton, selectedRegion === region && styles.regionButtonActive]}
                            onPress={() => setSelectedRegion(region)}>
                            <Text style={[styles.regionText, selectedRegion === region && styles.regionTextActive]}>{region}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Modal visible={showCountryModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        {countries.map(country => (
                            <Pressable key={country} onPress={() => {
                                setSelectedCountry(country);
                                setShowCountryModal(false);
                            }}>
                                <Text style={styles.modalItem}>{country}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setShowCountryModal(false)}>
                            <Text style={styles.modalCancel}>닫기</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={{ marginHorizontal: CARD_MARGIN, marginRight: -16, overflow: 'hidden' }}>
                <FlatList
                    ref={flatListRef}
                    horizontal
                    data={repeatedOffers}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const isFirst = index === 0;
                        const badgeColors = {
                            '시그니엘 서울': '#172A24',
                            '롯데호텔 서울': '#5d5244',
                            '롯데호텔 월드': '#5d5244',
                            '시그니엘 부산': '#172A24',
                            '롯데호텔 부산': '#5d5244',
                            '롯데호텔 제주': '#5d5244',
                            '롯데호텔 울산': '#5d5244',
                            '롯데시티호텔 대전': '#C54C00',
                        };
                        const regionImages = imageMap[selectedRegion];
                        const imageSource = regionImages[index % regionImages.length];

                        return (
                            <View
                                style={[
                                    styles.card,
                                    {
                                        marginLeft: isFirst ? 0 : 0, // 첫 카드도 왼쪽 여백 제거
                                        marginRight: CARD_MARGIN,
                                    },
                                ]}
                            >
                                <Image source={imageSource} style={styles.cardImage} />
                                <View style={[
                                    styles.badge,
                                    { backgroundColor: badgeColors[item.hotel] || '#5d5244' }
                                ]}>
                                    <Text style={styles.badgeText}>{item.hotel}</Text>
                                </View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                            </View>
                        );
                    }}
                    snapToInterval={SNAP_INTERVAL}
                    decelerationRate="fast"
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(event) => {
                        const offsetX = event.nativeEvent.contentOffset.x;
                        const newIndex = Math.round(offsetX / SNAP_INTERVAL);

                        flatListRef.current?.scrollToOffset({
                            offset: newIndex * SNAP_INTERVAL,
                            animated: true,
                        });

                        setCurrentIndex(newIndex);

                        const progress = ((newIndex % offers.length) + 1) / offers.length;

                        Animated.timing(progressAnim, {
                            toValue: progress,
                            duration: 400,
                            useNativeDriver: false, // width 애니메이션은 false!
                        }).start();
                    }}
                />
            </View>

            <View style={styles.progressBarBackground}>
                <Animated.View
                    style={[
                        styles.progressBarFill,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        },
                    ]}
                />
            </View>
            <Text style={styles.pageText}>{(currentIndex % offers.length) + 1} / {offers.length}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },

    headerBg: {
        width: '100%',
        height: '100%',
    },

    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // 검정 + 50% 투명도
    },
    overlay: {
        position: 'absolute',
        top: 20,
        left: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Platform.select({
            ios: 'Noteworthy',
            android: 'sans-serif',
        }),
        color: '#fff',
        marginTop: 20,
        marginBottom: 20,
    },
    countrySelect: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 26,
    },
    regionRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    regionButton: {
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    regionButtonActive: {
        backgroundColor: '#fff',
    },
    regionText: {
        color: '#fff',
        fontSize: 13,
    },
    regionTextActive: {
        color: '#000',
    },
    slider: {
        marginTop: 16,
    },
    card: {
        width: 220,
        marginTop: 20,
    },
    cardImage: {
        width: '100%',
        height: width * 0.3,
    },
    badge: {
        backgroundColor: '#5d5244',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 16,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 16,
    },
    pageText: {
        textAlign: 'right',
        margin: 16,
        color: '#555',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        width: '60%',
    },
    modalItem: {
        fontSize: 16,
        paddingVertical: 10,
        textAlign: 'center',
    },
    modalCancel: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginTop: 12,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#e0e0e0',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 2,
        marginTop: 10,
    },
    progressBarFill: {
        height: 4,
        backgroundColor: '#000',
        borderRadius: 2,
    },
});
