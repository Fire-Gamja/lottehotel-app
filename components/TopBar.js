import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LogoSvg from '../assets/ico/logo.svg';
import Menu from '../assets/ico/menu.svg';

// 1. Store를 import 합니다.
import useHomeStore from '../stores/homeStore';

// 2. 더 이상 부모로부터 props({ isScrolled })를 받지 않습니다.
export default function TopBar() {
  // 3. 필요한 isScrolled 상태를 Store에서 직접 가져옵니다.
  const isScrolled = useHomeStore((state) => state.isScrolled);

  return (
    // 4. Store에서 가져온 isScrolled 상태를 사용하여 스타일을 적용합니다.
    <View style={[styles.header, isScrolled && styles.scrolled]}>
      <LogoSvg />
      <TouchableOpacity>
        <Menu />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    height: 56,
    backgroundColor: 'transparent',
  },
  scrolled: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

