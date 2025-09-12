import React from 'react';
import { View, Platform } from 'react-native';
import HomeIcon from '../assets/svg/home.svg';
import HomeSelectedIcon from '../assets/svg/home_selected.svg';
import SearchIcon from '../assets/svg/search.svg';
import SearchSelectedIcon from '../assets/svg/search_selected.svg';
import ReservationIcon from '../assets/svg/reservation.svg';
import FindIcon from '../assets/svg/find.svg';
import FindSelectedIcon from '../assets/svg/find_selected.svg';
import MyIcon from '../assets/svg/my.svg';
import MySelectedIcon from '../assets/svg/my_selected.svg';

export default function BottomTabIcon({ routeName, focused }) {

    let IconComponent;

    switch (routeName) {
        case '홈':
            IconComponent = focused ? HomeSelectedIcon : HomeIcon;
            break;
        case '호텔찾기':
            IconComponent = focused ? SearchSelectedIcon : SearchIcon;
            break;
        case '예약하기':
            IconComponent = ReservationIcon;
            break;
        case '예약조회':
            IconComponent = focused ? FindSelectedIcon : FindIcon;
            break;
        case '내정보':
            IconComponent = focused ? MySelectedIcon : MyIcon;
            break;
        default:
            IconComponent = HomeIcon;
            break;
    }

    if (routeName === '예약하기') {
        return (
            <View style={{
                position: 'absolute',
                top: Platform.select({ ios: -24, android: -30 }),
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
                        <IconComponent width={20} height={20} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={{
            position: 'absolute',
            top: Platform.select({ ios: 11, android: 10 }),
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        }}>
            <IconComponent width={20} height={20} />
        </View>
    );
}