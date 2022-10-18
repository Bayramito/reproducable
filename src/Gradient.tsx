import React, {useEffect} from 'react';

import MaskedView from '@react-native-masked-view/masked-view';

import {Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const CeyCeyComponent = ({text, width, height, isActive}) => {
  useEffect(() => {
    progress.value = isActive ? withTiming(1, {duration: 1500}) : withTiming(0);
  }, [isActive]);
  // "#ffB692", "#FA6B17", "#FAEBE5"

  const progress = useDerivedValue(() => {
    return isActive ? withTiming(1, {duration: 500}) : withTiming(0);
  }, [isActive]);
  // "#ffB692", "#FA6B17", "#FAEBE5"
  const rStyle = useAnimatedProps(() => {
    const c1 = interpolateColor(progress.value, [0, 1], ['#BDC3C7', '#ffB692']);
    const c2 = interpolateColor(progress.value, [0, 1], ['#BDC3C7', '#FA6B17']);
    const c3 = interpolateColor(progress.value, [0, 1], ['#BDC3C7', '#ffB692']);
    return {
      colors: [c1, c2, c3],
    };
  });
  return (
    <View
      pointerEvents={'none'}
      style={{
        zIndex: 9999,
        width,
        height,
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
      }}>
      <MaskedView
        style={{width: '100%', flexDirection: 'row', height: '100%'}}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{text}</Text>
          </View>
        }>
        <AnimatedGradient
          animatedProps={rStyle}
          style={{width: '100%', height: 50}}
        />
      </MaskedView>
    </View>
  );
};

export default CeyCeyComponent;
