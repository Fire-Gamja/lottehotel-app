import { View, StyleSheet } from 'react-native';
import LogoSvg from '../assets/ico/logo.svg';
import Menu from '../assets/ico/menu.svg';
export default function TopBar({ isScrolled }) {
  return (
    <View style={[styles.header, isScrolled && styles.scrolled]}>
      <LogoSvg />
      <Menu />
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
    backgroundColor: 'transparent', // 기본: 투명
  },
  scrolled: {
    backgroundColor: '#fff', // 스크롤 후: 흰색
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // 안드로이드 그림자
  },
});
