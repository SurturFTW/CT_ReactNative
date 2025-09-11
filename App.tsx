import React, {useEffect} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

// 👉 Import multi-instance bridge (the TypeScript wrapper we made)
import {CleverTapMulti} from './clevertapMulti';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // ✅ Initialize both dashboards at startup
  useEffect(() => {
    (async () => {
      await CleverTapMulti.initInstance(
        'd1',
        'TEST-865-ZRW-7K7Z',
        'TEST-021-56b',
        'eu1',
      );
      await CleverTapMulti.initInstance(
        'd2',
        'TEST-4R8-7ZK-6K7Z',
        'TEST-31a-b24',
        'eu1',
      );
    })();

    requestPermissionsAndroid();
  }, []);

  const requestPermissionsAndroid = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Location permission denied');
        }

        if (
          granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Notifications permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // ✅ Multi-instance login
  const onLogin = () => {
    const profile = {
      Identity: '1990',
      Name: 'React Native',
      Email: 'react.test@abc.com',
      Phone: '+911122334455',
      Gender: 'M',
    };

    CleverTapMulti.pushProfile('d1', profile);
    CleverTapMulti.pushProfile('d2', profile);

    console.log('User Login sent to both dashboards');
  };

  // ✅ Multi-instance event
  const onEvent = () => {
    CleverTapMulti.pushEvent('d1', 'Product Viewed', {Name: 'XYZ', Price: 123});
    CleverTapMulti.pushEvent('d2', 'Product Viewed', {Name: 'XYZ', Price: 123});

    console.log('Event sent to both dashboards');
  };

  const onGetId = async () => {
    const id1 = await CleverTapMulti.getCleverTapID('d1');
    const id2 = await CleverTapMulti.getCleverTapID('d2');
    console.log('CTID d1:', id1);
    console.log('CTID d2:', id2);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{backgroundColor: isDarkMode ? Colors.black : Colors.white}}>
          <Button title="Login" onPress={onLogin} />
          <Button title="Event" onPress={onEvent} />
          <Button title="Get CleverTap IDs" onPress={onGetId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
