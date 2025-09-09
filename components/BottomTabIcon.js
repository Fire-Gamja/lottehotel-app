import React from 'react';
import { View, Platform } from 'react-native';
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

    return (
        <View style={{
            position: 'absolute',
            top: Platform.select({
                ios: 14,
                android: 20,
            }),
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
             }}>
            <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
    );
}
