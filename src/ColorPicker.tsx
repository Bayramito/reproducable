import React, {useCallback} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {decimalToHexString, DEFAULT_PALETTE} from './constants';

interface Props {
  colors?: Array<string>;
  styles?: StyleProp<ViewStyle> | undefined;
  onColorChanged: (hex: string) => void;
  onColorChanging?: (dec: string) => void;
  cicrleSize?: number;
  initial?: number | string;
}

const ColorPicker = ({
  colors,
  styles,
  onColorChanging = () => {},
  onColorChanged = () => {},
  cicrleSize,
}: Props) => {
  // Defs
  const PICKER_SIZE = cicrleSize || 25;
  const INTERNAL_PICKER = PICKER_SIZE * 0.8;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const background = useSharedValue('');
  const active = useSharedValue(0);
  const colorPalette = colors || DEFAULT_PALETTE;

  const didChange = useCallback(
    (val: string) => {
      const hex = decimalToHexString(val);
      onColorChanged(hex);
      console.log(styles.width, hex, val);
    },
    [onColorChanged],
  );

  const onChange = useCallback(
    (color: string) => {
      onColorChanging(color);
    },
    [onColorChanging],
  );

  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(Math.max(translateX.value, 0), styles.width);
  }, [translateX]);

  const onEnd = useCallback(() => {
    'worklet';
    translateY.value = withTiming(0);

    active.value = 0;
    runOnJS(didChange)(background.value);
  }, []);

  const panGestureEevent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx['translateX'] = _.x;
      translateY.value = withTiming(-PICKER_SIZE);

      active.value = withTiming(1);
    },
    onActive: (event, ctx) => {
      translateX.value = ctx['translateX'] + event.translationX;
      active.value = withTiming(1);
    },
    onEnd,
  });

  const tapGestureEvent = useAnimatedGestureHandler({
    onStart: event => {
      translateY.value = withTiming(-(styles.height / 2) - PICKER_SIZE);

      translateX.value = withTiming(event.x);
      active.value = withTiming(1);
    },
    onEnd,
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: adjustTranslateX.value},
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      opacity: active.value,
    };
  });

  const rInternal = useAnimatedStyle(() => {
    const inputRange = colorPalette.map(
      (_, index) => ((index + 1) / colorPalette.length) * styles.width,
    );
    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colorPalette,
    );

    runOnJS(onChange)(backgroundColor);
    if (onColorChanged) {
      background.value = backgroundColor;
    }

    return {
      backgroundColor,
    };
  });

  const compStyles = StyleSheet.create({
    picker: {
      position: 'absolute',
      backgroundColor: '#fff',
      width: PICKER_SIZE,
      height: PICKER_SIZE,
      borderRadius: PICKER_SIZE / 2,
      justifyContent: 'center',
      alignItems: 'center',
      left: -PICKER_SIZE / 2,
    },
    internalPicker: {
      backgroundColor: 'red',
      width: INTERNAL_PICKER,
      height: INTERNAL_PICKER,
      borderRadius: INTERNAL_PICKER / 2,
    },
    arrow: {
      position: 'absolute',
      bottom: -INTERNAL_PICKER / 2,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderLeftWidth: INTERNAL_PICKER / 2,
      borderRightWidth: INTERNAL_PICKER / 2,
      borderTopWidth: INTERNAL_PICKER / 2,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#FFF',
    },
  });

  return (
    <GestureHandlerRootView>
      <TapGestureHandler onGestureEvent={tapGestureEvent as any}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureEevent} minDist={0}>
            <Animated.View style={{justifyContent: 'center'}}>
              <LinearGradient
                colors={colorPalette}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles}
              />
              <Animated.View style={[compStyles.picker, rStyle]}>
                <Animated.View style={[compStyles.internalPicker, rInternal]} />
                <Animated.View style={[compStyles.arrow, arrowStyle]} />
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

export default ColorPicker;
