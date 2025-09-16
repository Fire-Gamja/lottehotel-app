// App.js
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// stores and components
import useHomeStore from './stores/homeStore';
import useBookingStore from './stores/bookingStore';
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
import GuestsSelect from './components/GuestsSelect'
import SearchResults from './components/SearchResults'
import ResumePill from './components/ResumePill'

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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    startSlideInterval();
    return () => clearSlideInterval();
  }, [startSlideInterval, clearSlideInterval]);

  return (
    <View style={{ flex: 1 }}>
      {/* 화면 상단에 항상 고정되는 헤더 */}
      <TopBar />
      {/* 컨텐츠는 헤더 높이 + 안전영역만큼 아래에서 시작 */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        bounces={false}
        overScrollMode="never"
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          setIsScrolled(y > 1);
        }}
        scrollEventThrottle={16}
      >
        <View style={{ position: 'relative' }}>
          <Banner />
          <ResumePill />
        </View>
        <Promotion />
        <TimeSaleBanner />
        <PromotionSection />
        <SpecialOffers />
        <Bottom />
      </ScrollView>
    </View>
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
            try { useBookingStore.getState().clearCurrentDraft(); } catch (err) { }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ✅ 전역 상태바도 여기서 지정 */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
          <Stack.Screen
            name="HotelSelect"
            component={HotelSelect}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animationEnabled: false,
            }}
          />
          <Stack.Screen
            name="DateSelect"
            component={DateSelect}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animationEnabled: false,
            }}
          />
          <Stack.Screen
            name="GuestsSelect"
            component={GuestsSelect}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animationEnabled: false,
            }}
          />
          <Stack.Screen
            name="SearchResults"
            component={SearchResults}
            style={{
              margin: 0,
              padding: 0,
            }}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animationEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 70,
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
