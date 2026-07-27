import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../styles/theme';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Section({title, children}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 12,
  },
});
