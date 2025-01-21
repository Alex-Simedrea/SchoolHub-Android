import React from 'react';
import { Stack } from 'expo-router';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import Animated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import tw from 'twrnc';

export default function AnimatedHeaderWrapper({
  children,
  title,
  leftContent,
  rightContent,
  scrollViewProps
}: {
  children: React.ReactNode;
  title: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  scrollViewProps?: React.ComponentProps<typeof Animated.ScrollView>;
}) {
  const theme = useTheme();
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      if (event.contentOffset.y < 25) {
        scrollTo(scrollViewRef, 0, 0, true);
      } else if (event.contentOffset.y < 50) {
        scrollTo(scrollViewRef, 0, 50, true);
      }
    },
    onMomentumEnd: (event) => {
      if (event.contentOffset.y < 25) {
        scrollTo(scrollViewRef, 0, 0, true);
      } else if (event.contentOffset.y < 50) {
        scrollTo(scrollViewRef, 0, 50, true);
      }
    }
  });

  const headerOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 50], [0, 1], 'clamp')
  }));

  const headerColor = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      scrollY.value > 25
        ? theme.colors.elevation.level2
        : theme.colors.background,
      {
        duration: 50
      }
    )
  }));

  const titleOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 25], [1, 0], 'clamp')
  }));

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          header: () => (
            <Appbar.Header mode='small'>
              <Appbar.Content title='Dashboard' />
            </Appbar.Header>
          )
        }}
      />
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Animated.View style={[{ opacity: 1 }, headerColor]}>
          <Appbar.Header
            style={{
              backgroundColor: 'transparent'
            }}
          >
            {leftContent}
            <Appbar.Content
              title={
                <Animated.View style={headerOpacity}>
                  <Text
                    variant='titleLarge'
                    numberOfLines={1}
                    accessible
                    accessibilityRole='header'
                  >
                    {title}
                  </Text>
                </Animated.View>
              }
            />
            {rightContent}
          </Appbar.Header>
        </Animated.View>
        <Animated.ScrollView
          ref={scrollViewRef}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          {...scrollViewProps}
        >
          <Animated.View style={[{ paddingBottom: 16 }, titleOpacity]}>
            <Text variant='headlineSmall'>{title}</Text>
          </Animated.View>
          {children}
        </Animated.ScrollView>
      </View>
    </>
  );
}
