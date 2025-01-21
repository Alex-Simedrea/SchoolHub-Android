import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import tw from 'twrnc';
import React from 'react';

export default function HighlightCard({ value, label }: { value: string; label: string }) {
  const theme = useTheme();

  return (
    <View
      style={tw.style(`flex-1 gap-0.5 rounded-3xl px-5 py-4`, {
        backgroundColor: theme.colors.elevation.level1
      })}
    >
      <Text variant='displaySmall' style={tw`font-semibold`}>
        {value}
      </Text>
      <Text variant='bodyLarge'>{label}</Text>
    </View>
  );
}
