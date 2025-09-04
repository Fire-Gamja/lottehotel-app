import React, { useEffect } from 'react'; // useState 제거
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 컴포넌트 import
import TopBar from './components/TopBar';
import Banner from './components/Banner';
import Promotion from './components/Promotion';
import TimeSaleBanner from './components/TimeSaleBanner';
import PromotionSection from './components/PromotionSection';
import SpecialOffers from './components/Special Offers';
import Bottom from './components/Bottom';
import BottomTabIcon from './components/BottomTabIcon';
import Reservation from './components/Reservation';

// Zustand Store import
import useHomeStore from './stores/homeStore';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen() {
  // Store에서 상태 변경 함수와 인터벌 제어 함수를 가져옵니다.
  const { setIsScrolled, startSlideInterval, clearSlideInterval } = useHomeStore();

  // 화면이 처음 나타날 때 배너 자동 넘김을 시작하고,
  // 화면이 사라질 때 자동 넘김을 정지합니다.
  useEffect(() => {
    startSlideInterval();
    return () => {
      clearSlideInterval();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 이제 props를 전달하지 않습니다. */}
      <TopBar />
      <ScrollView
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          // 스크롤이 발생하면 Store의 상태를 직접 업데이트합니다.
          setIsScrolled(y > 30);
        }}
        scrollEventThrottle={16}
      >
        {/* 이제 props를 전달하지 않습니다. */}
        <Banner />
        <Promotion />
        <TimeSaleBanner />
        <PromotionSection />
        <SpecialOffers />
        <Bottom />
      </ScrollView>
    </SafeAreaView>
  );
}

function DummyScreen({ label }) {
  return (
    <View style={styles.center}><Text>{label}</Text></View>
  );
}

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
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'visible',
  },
});

