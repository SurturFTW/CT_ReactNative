import CleverTap from 'clevertap-react-native';

import {NativeModules} from 'react-native';
const {CleverTapMultiInstance} = NativeModules;

import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
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

CleverTap.registerForPush();
CleverTap.setDebugLevel(3);

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

function Section({children, title}: SectionProps): React.JSX.Element {
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
  const listenerRef = useRef<any>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Clean up listeners on component unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
      }
    };
  }, []);

  const requestPermissionsAndroid = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);

        const locationGranted =
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED;

        const notificationsGranted =
          granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] ===
          PermissionsAndroid.RESULTS.GRANTED;

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
  requestPermissionsAndroid();

  CleverTap.registerForPush();
  CleverTap.promptForPushPermission(true);

  let localInApp = {
    inAppType: 'alert',
    titleText: 'Get Notified',
    messageText: 'Enable Notification permission',
    followDeviceOrientation: true,
    positiveBtnText: 'Allow',
    negativeBtnText: 'Cancel',
    fallbackToSettings: true, //Setting this parameter to true will open an in-App to redirect you to Mobile's OS settings page.
  };

  CleverTap.promptPushPrimer(localInApp);

  const onLogin = () => {
    var myStuff = ['bag', 'shoes'];
    var props = {
      Name: 'React Native', // String
      Identity: '1990', // String or number
      Email: 'react.test@abc.com', // Email address of the user
      Phone: '+911122334455', // Phone (with the country code, starting with +)
      Gender: 'M', // Can be either M or F
      DOB: new Date('1992-12-22T06:35:31'), // Date of Birth. Set the Date object to the appropriate value first

      // optional fields. controls whether the user will be sent email, push, etc.
      'MSG-email': false, // Disable email notifications
      'MSG-push': true, // Enable push notifications
      'MSG-sms': false, // Disable SMS notifications
      'MSG-whatsapp': true, // Enable WhatsApp notifications
      Stuff: myStuff, //Array of Strings for user properties
    };
    // CleverTap.onUserLogin(props);
    CleverTapMultiInstance.recordUserLogin('dashboard1', props);
    CleverTapMultiInstance.recordUserLogin('dashboard2', props);
    console.log('User Login');
  };

  const onEvent = () => {
    // event with properties
    var prods = {Name: 'XYZ', Price: 123};
    // CleverTap.recordEvent('Product Viewed', prods);
    CleverTapMultiInstance.recordEvent('dashboard1', 'Product Viewed', prods);
    CleverTapMultiInstance.recordEvent('dashboard2', 'Product Viewed', prods);
    console.log('Event with properties');
  };

  const onPush = () => {
    // CleverTap.recordEvent('Notification Event');
    CleverTapMultiInstance.recordEvent(
      'dashboard1',
      'Notification Event',
      null,
    );
    CleverTapMultiInstance.recordEvent(
      'dashboard2',
      'Notification Event',
      null,
    );
    console.log('Push Event');
  };

  const onInbox = () => {
    CleverTap.recordEvent('App Inbox Event', null);
    console.log('App Inbox Event');
    // CleverTap.initializeInbox();
    CleverTap.showInbox({});
  };

  const onNative = () => {
    CleverTap.recordEvent('Native Display Event', null);
    console.log('Native Display Event');
    CleverTap.getAllDisplayUnits((err: any, res: any) => {
      console.log('Native Display units:', res, err);
    });
  };

  const onGetId = () => {
    CleverTap.getCleverTapID((err: any, res: any) => {
      CleverTapMultiInstance.getCleverTapID(
        'dashboard1',
        (err1: any, res1: any) => {
          console.log('CleverTapID dashboard1', res1, err1);
        },
      );
      CleverTapMultiInstance.getCleverTapID(
        'dashboard2',
        (err2: any, res2: any) => {
          console.log('CleverTapID dashboard2', res2, err2);
        },
      );
    });
  };

  const onInApp = () => {
    try {
      // Remove existing listener before adding new one
      if (listenerRef.current) {
        listenerRef.current.remove();
      }

      // Record events with error handling
      CleverTapMultiInstance.recordEvent('dashboard1', 'In-App Event', null);
      CleverTapMultiInstance.recordEvent('dashboard2', 'In-App Event', null);

      console.log('INAPP NOTIFICATION TRIGGERED');

      // Add listener and store reference for cleanup
      listenerRef.current = CleverTap.addListener(
        CleverTap.CleverTapInAppNotificationShowed,
        (event: any) => {
          console.log('INAPP NOTIFICATION SHOWN', event);
        },
      );
    } catch (error) {
      console.error('Error in onInApp:', error);
    }
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
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Login" onPress={() => onLogin()} />
          <Button title="Event" onPress={() => onEvent()} />
          <Button title="Push Notification" onPress={() => onPush()} />
          <Button title="App Inbox" onPress={() => onInbox()} />
          <Button title="Native Display" onPress={() => onNative()} />
          <Button title="In App" onPress={() => onInApp()} />
          <Button title="Get CT Id" onPress={() => onGetId()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
