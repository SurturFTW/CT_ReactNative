const CleverTap = require('clevertap-react-native');

import React from 'react';
import type { PropsWithChildren } from 'react';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);

        const locationGranted =
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;

        const notificationsGranted = granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED;

        if (!locationGranted) {
          Alert.alert('Location permission denied');
        }

        if (!notificationsGranted) {
          Alert.alert('Notifications permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  // Function Call to request permissions
  requestPermissions();

  const onLogin = () => {
    var myStuff = ['bag', 'shoes']
    var props = {
      'Name': 'React Native',                    // String
      'Identity': '777',                         // String or number
      'Email': 'react@native.com',                 // Email address of the user
      'Phone': '+911122334455',                   // Phone (with the country code, starting with +)
      'Gender': 'M',                             // Can be either M or F
      'DOB': new Date(),    // Date of Birth. Set the Date object to the appropriate value first

      // optional fields. controls whether the user will be sent email, push, etc.
      'MSG-email': false,                        // Disable email notifications
      'MSG-push': true,                          // Enable push notifications
      'MSG-sms': false,                          // Disable SMS notifications
      'MSG-whatsapp': true,                      // Enable WhatsApp notifications
      'Stuff': myStuff                           //Array of Strings for user properties
    }
    CleverTap.onUserLogin(props);
  }

  const onEvent = () => {
    // event with properties
    var prods = { 'Name': 'XYZ', 'Price': 123 }
    CleverTap.recordEvent('Product Viewed', prods);
  }


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
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Login" onPress={() => onLogin()} />
          <Button title='Event' onPress={() => onEvent()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

export default App;
