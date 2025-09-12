import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// stores and components
import useHomeStore from './stores/homeStore';
import TopBar from './components/TopBar';
import Banner from './components/Banner';
import Promotion from './components/Promotion';
import TimeSaleBanner from './components/TimeSaleBanner';
import PromotionSection from './components/PromotionSection';
import SpecialOffers from './components/SpecialOffers';
import BottomTabIcon from './components/BottomTabIcon';
import Bottom from './components/Bottom';
import Reservation from './components/Reservation';
import HotelSelect from './components/HotelSelect';
import DateSelect from './components/DateSelect';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- 애니메이션 설정 ---
const customTransitionSpec = {
  animation: 'timing',
  config: {
    duration: 500,
    easing: Easing.out(Easing.poly(4)),
  },
};

function HomeScreen() {
  const { setIsScrolled, startSlideInterval, clearSlideInterval } = useHomeStore();

  useEffect(() => {
    startSlideInterval();
    return () => clearSlideInterval();
  }, [startSlideInterval, clearSlideInterval]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TopBar />
      <ScrollView
        bounces={false}
        overScrollMode="never"
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          setIsScrolled(y > 30);
        }}
        scrollEventThrottle={16}
      >
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
    <View style={styles.center}>
      <Text>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: ({ focused }) => (
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: focused ? '#000' : '#aaa' }}>
              {route.name}
            </Text>
          </View>
        ),
        tabBarIcon: ({ focused }) => (
          <BottomTabIcon routeName={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="호텔찾기" children={() => <DummyScreen label="호텔찾기" />} />
      <Tab.Screen
        name="예약하기"
        children={() => <DummyScreen label="예약하기" />}
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ReservationModal"
          component={Reservation}
          options={{
            presentation: 'modal',
            transitionSpec: {
              open: customTransitionSpec,
              close: customTransitionSpec,
            },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        {/* ✅ HotelSelect 스크린 추가 */}
        <Stack.Screen
          name="HotelSelect"
          component={HotelSelect}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animationEnabled: false,   // 내부 Animated로만 제어
          }}
        />
        <Stack.Screen
          name="DateSelect"
          component={DateSelect}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animationEnabled: false, // 내부 Animated로만 부드럽게
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    height: 90,
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
