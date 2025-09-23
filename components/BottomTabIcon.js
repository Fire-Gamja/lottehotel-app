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

const ICONS = {
  Home: { default: HomeIcon, focused: HomeSelectedIcon },
  FindHotel: { default: SearchIcon, focused: SearchSelectedIcon },
  ReservationEntry: { default: ReservationIcon, focused: ReservationIcon },
  BookingLookup: { default: FindIcon, focused: FindSelectedIcon },
  MyPage: { default: MyIcon, focused: MySelectedIcon },
};

const LEGACY_ROUTE_MAP = {
  '\uD648': 'Home',
  '\uD638\uD154\uCC3E\uAE30': 'FindHotel',
  '\uC608\uC57D\uD558\uAE30': 'ReservationEntry',
  '\uC608\uC57D\uC870\uD68C': 'BookingLookup',
  '\uB9C8\uC774\uD398\uC774\uC9C0': 'MyPage',
};

const PRIMARY_ROUTES = new Set(['ReservationEntry']);

const resolveRouteKey = (routeName) => LEGACY_ROUTE_MAP[routeName] || routeName;

export default function BottomTabIcon({ routeName, focused }) {
  const key = resolveRouteKey(routeName);
  const entry = ICONS[key] || ICONS.Home;
  const IconComponent = focused ? entry.focused : entry.default;
  const isPrimary = PRIMARY_ROUTES.has(key);

  if (isPrimary) {
    return (
      <View
        style={{
          position: 'absolute',
          top: Platform.select({ ios: -24, android: -30 }),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconComponent width={20} height={20} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: Platform.select({ ios: 11, android: 10 }),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <IconComponent width={20} height={20} />
    </View>
  );
}
