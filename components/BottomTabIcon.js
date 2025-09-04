import React from 'react';
import { View, Platform } from 'react-native'; // Platform을 import 합니다.
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BottomTabIcon({ routeName, focused }) {
    const iconColor = focused ? '#000' : '#aaa';

    let iconName;
    switch (routeName) {
        case '홈': iconName = 'home-outline'; break;
        case '호텔찾기': iconName = 'search-outline'; break;
        case '예약하기': iconName = 'calendar-outline'; break;
        case '예약조회': iconName = 'clipboard-outline'; break;
        case '내정보': iconName = 'person-outline'; break;
        default: iconName = 'ellipse-outline'; break;
    }

    // '예약하기' 버튼 스타일
    if (routeName === '예약하기') {
        return (
            <View style={{
                position: 'absolute',
                top: Platform.select({
                    ios: -25,
                    android: -35, 
                }),
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#000',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name={iconName} size={24} color="#fff" />
                    </View>
                </View>
            </View>
        );
    }

    // 나머지 탭 아이콘 스타일
    return (
        <View style={{
            position: 'absolute',
            // 여기도 Platform.select를 적용합니다.
            top: Platform.select({
                ios: 14,
                android: 20, // 안드로이드에서는 아이콘 위치를 살짝 내립니다.
            }),
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
             }}>
            <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
    );
}
