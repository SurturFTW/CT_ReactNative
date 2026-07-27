import React from 'react';
import {Pressable, Text, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../styles/theme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  variant = 'secondary',
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        styles[`${variant}Container`],
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryContainer: {backgroundColor: colors.primary},
  primaryText: {color: colors.primaryText},
  secondaryContainer: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {color: colors.secondaryText},
  dangerContainer: {backgroundColor: colors.danger},
  dangerText: {color: colors.dangerText},
});
