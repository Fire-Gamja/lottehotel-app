import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RollingDigitSlot from '../components/RollingDigitSlot';

export default function TimeSaleBanner() {
    const [time, setTime] = useState({ h: 12, m: 23, s: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => {
                let { h, m, s } = prev;
                if (s > 0) s--;
                else if (m > 0) { m--; s = 59; }
                else if (h > 0) { h--; m = 59; s = 59; }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.wrapper}>
            <View style={styles.timerRowWrap}>
                {/* 시 */}
                <View style={styles.timerCol}>
                    <View style={styles.timerNumRow}>
                        <RollingDigitSlot digit={Math.floor(time.h / 10)} />
                        <RollingDigitSlot digit={time.h % 10} />
                    </View>
                    <Text style={styles.timerLabel}>HOURS</Text>
                </View>
                <Text style={styles.timerColon}> : </Text>

                {/* 분 */}
                <View style={styles.timerCol}>
                    <View style={styles.timerNumRow}>
                        <RollingDigitSlot digit={Math.floor(time.m / 10)} />
                        <RollingDigitSlot digit={time.m % 10} />
                    </View>
                    <Text style={styles.timerLabel}>MINUTES</Text>
                </View>
                <Text style={styles.timerColon}> : </Text>

                {/* 초 */}
                <View style={styles.timerCol}>
                    <View style={styles.timerNumRow}>
                        <RollingDigitSlot digit={Math.floor(time.s / 10)} />
                        <RollingDigitSlot digit={time.s % 10} />
                    </View>
                    <Text style={styles.timerLabel}>SECONDS</Text>
                </View>
            </View>

            {/* 이미지 및 정보 */}
            <View style={styles.imageBox}>
                <Image
                    source={require('../assets/pool.png')}
                    style={styles.bannerImg}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.infoBox}>
                <View style={styles.hotelTag}><Text style={styles.hotelTagText}>롯데호텔 울산</Text></View>
                <Text style={styles.eventTitle}>[Time Sale] Cool Summer Festa</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        margin: 16,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        marginBottom: 50,
    },
    timerRowWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 30,
        paddingBottom: 20,
    },
    timerCol: {
        alignItems: 'center',
        width: 80,
    },
    timerNumRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timerColon: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginHorizontal: -8,
        alignSelf: 'top',
    },
    timerLabel: {
        fontSize: 10,
        color: '#888',
        marginTop: 8,
    },
    imageBox: {
        width: '100%',
        aspectRatio: 2.1,
        // overflow: 'hidden',
        marginBottom: 0,
    },
    bannerImg: {
        width: '100%',
        height: '100%',
    },
    infoBox: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    hotelTag: {
        backgroundColor: '#7c6a58',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginTop: 4,
    },
    hotelTagText: {
        color: '#fff',
        fontSize: 12,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginTop: 14,
        paddingBottom: 30,
    },
});
