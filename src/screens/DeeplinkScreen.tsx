import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppButton from '../components/AppButton';
import {colors} from '../styles/theme';
import {recordCustomEvent} from '../utils/cleverTapEvents';

type Props = {
  url: string;
  onBack: () => void;
};

export default function DeeplinkScreen({url, onBack}: Props) {
  useEffect(() => {
    console.log('Promo Deeplink URL:', url);
    recordCustomEvent('Inbox', {
      url: url,
    });
  }, [url]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deeplink Received</Text>
      <Text style={styles.url}>{url}</Text>
      <AppButton title="← Back to App" variant="primary" onPress={onBack} />
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
    color: colors.title,
  },
  url: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
  },
});
