import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppButton from '../components/AppButton';
import {colors} from '../styles/theme';
import {parseQueryParams} from '../utils/urlUtils';

type Props = {
  url: string;
  onBack: () => void;
};

export default function PromoDeeplinkScreen({url, onBack}: Props) {
  const params = parseQueryParams(url);
  const entries = Object.entries(params);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Promo Deeplink Received</Text>
      <Text style={styles.subtitle}>
        Tests a deeplink carrying query parameters (e.g. a campaign or product
        promo link).
      </Text>

      <View style={styles.paramsCard}>
        {entries.length === 0 ? (
          <Text style={styles.empty}>No query parameters found</Text>
        ) : (
          entries.map(([key, value]) => (
            <View key={key} style={styles.paramRow}>
              <Text style={styles.paramKey}>{key}</Text>
              <Text style={styles.paramValue}>{value}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.url}>{url}</Text>
      <AppButton title="← Back to App" variant="primary" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.title,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
    marginBottom: 20,
  },
  paramsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  paramKey: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.paramKey,
  },
  paramValue: {
    fontSize: 14,
    color: colors.paramValue,
  },
  empty: {
    fontSize: 14,
    color: colors.subtitle,
    textAlign: 'center',
  },
  url: {
    fontSize: 12,
    color: colors.subtitle,
    textAlign: 'center',
    marginBottom: 20,
  },
});
