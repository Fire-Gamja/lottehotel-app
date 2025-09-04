import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform, // Platform 모듈을 사용합니다.
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TopBar from './components/TopBar';
import Banner from './components/Banner';
import Promotion from './components/Promotion';
import TimeSaleBanner from './components/TimeSaleBanner';
import PromotionSection from './components/PromotionSection';
import SpecialOffers from './components/Special Offers';
import BottomTabIcon from './components/BottomTabIcon';
import Bottom from './components/Bottom';
import Reservation from './components/Reservation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 홈 화면 컴포넌트 (기존과 동일)
function HomeScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev < 4 ? prev + 1 : 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar isScrolled={isScrolled} />
      <ScrollView
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          setIsScrolled(y > 30);
        }}
        scrollEventThrottle={16}
      >
        <Banner slideIndex={slideIndex} />
        <Promotion />
        <TimeSaleBanner />
        <PromotionSection />
        <SpecialOffers />
        <Bottom />
      </ScrollView>
    </SafeAreaView>
  );
}

// 더미 화면 컴포넌트 (기존과 동일)
function DummyScreen({ label }) {
  return (
    <View style={styles.center}><Text>{label}</Text></View>
  );
}

// 탭 네비게이터 컴포넌트 (기존과 동일)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: ({ focused }) => (
          <View style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: focused ? '#000' : '#aaa' }}>{route.name}</Text>
          </View>
        ),
        tabBarIcon: ({ focused }) => (
          <BottomTabIcon routeName={route.name} focused={focused} />
        )
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="호텔찾기" children={() => <DummyScreen label="호텔찾기" />} />
      <Tab.Screen
        name="예약하기"
        component={DummyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('ReservationModal');
          },
        })}
      />
      <Tab.Screen name="예약조회" children={() => <DummyScreen label="예약조회" />} />
      <Tab.Screen name="내정보" children={() => <DummyScreen label="내정보" />} />
    </Tab.Navigator>
  );
}

// 최상위 네비게이터 (기존과 동일)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ReservationModal"
          component={Reservation}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 스타일 시트
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 120,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // 이미 잘 적용되어 있습니다.
    backgroundColor: '#fff',
    // iOS 전용 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    // Android 전용 그림자 (이 부분을 추가했습니다)
    elevation: 10,
    overflow: 'visible',
  },
});
