import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

type Props = {
  url: string;
  onBack: () => void;
};

export default function DeeplinkScreen({url, onBack}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deeplink Received</Text>
      <Text style={styles.url}>{url}</Text>
      <Button title="← Back to App" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  url: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
