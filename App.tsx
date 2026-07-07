import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Button,
  Linking,
  useColorScheme,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import CustomInboxScreen from './src/screens/CustomInboxScreen';
import DeeplinkScreen from './src/screens/DeeplinkScreen';
import DisplayUnitRenderer from './src/components/DisplayUnitRenderer';
import {
  initializeCleverTap,
  setupCleverTapListeners,
  promptPushPrimer,
  showInboxUI,
} from './src/services/cleverTapSetup';
import {loginUser, logoutUser} from './src/services/userService';
import {
  getAllDisplayUnits,
  recordNativeDisplayEvent,
} from './src/services/displayUnitService';
import {
  recordCustomEvent,
  getUserCleverTapID,
} from './src/utils/cleverTapEvents';
import {recordEvent} from 'clevertap-react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [displayUnits, setDisplayUnits] = useState<any[]>([]);
  const [showDisplayUnits, setShowDisplayUnits] = useState(false);
  const [showCustomInbox, setShowCustomInbox] = useState(false);
  const [deeplinkUrl, setDeeplinkUrl] = useState<string | null>(null);
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: string]: number;
  }>({});
  const carouselRefs = useRef<{[key: string]: any}>({});

  useEffect(() => {
    initializeCleverTap();
    setupCleverTapListeners();
    promptPushPrimer();

    // Handle deeplink when app is already open
    const subscription = Linking.addEventListener('url', ({url}) => {
      if (url.startsWith('ctdemo://')) {
        setDeeplinkUrl(url);
      }
    });

    // Handle deeplink that launched the app from a cold start
    Linking.getInitialURL().then(url => {
      if (url && url.startsWith('ctdemo://')) {
        setDeeplinkUrl(url);
      }
    });

    return () => subscription.remove();
  }, []);

  const handleLogin = () => {
    loginUser({
      Name: 'React Native',
      Identity: '1990',
      Email: 'react.test@abc.com',
      Phone: '+911122334455',
      Gender: 'M',
      DOB: new Date('1992-12-22T06:35:31'),
      'MSG-email': false,
      'MSG-push': true,
      'MSG-sms': false,
      'MSG-whatsapp': true,
      Stuff: ['bag', 'shoes'],
    });
  };

  const handleGetDisplayUnits = async () => {
    const units = await getAllDisplayUnits();
    setDisplayUnits(units);
  };

  const handleNativeDisplay = () => {
    recordNativeDisplayEvent('Native Event');
    handleGetDisplayUnits();
  };

  const handleNativeDisplay2 = () => {
    recordNativeDisplayEvent('Native Event 2');
    handleGetDisplayUnits();
  };

  if (deeplinkUrl) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <DeeplinkScreen url={deeplinkUrl} onBack={() => setDeeplinkUrl(null)} />
      </SafeAreaView>
    );
  }

  if (showCustomInbox) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Button
          title="← Back to App"
          onPress={() => setShowCustomInbox(false)}
        />
        <CustomInboxScreen />
      </SafeAreaView>
    );
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
          style={{backgroundColor: isDarkMode ? Colors.black : Colors.white}}>
          <Button title="Login" onPress={handleLogin} />
          <Button
            title="Custom Event"
            onPress={() =>
              recordCustomEvent('Product Viewed', {
                Name: 'XYZ',
                'Product ID': 123,
              })
            }
          />

          <Button
            title="Multi-Value Event"
            onPress={() =>
              // Basic event with multi-value (array) property
              recordEvent('Collection Viewed', {
                Platform: 'android',
                Collection_Handle: 'rareism-eoss',
                Collection_ID: '293491048519',
                Collection_Page_Name: 'RAREISM EOSS',
                Collection_Title: 'RAREISM EOSS',
                Collection_URL:
                  'https://thehouseofrare.com/collections/rareism-eoss',
                Vendor_Source: 'APP',
                Login_Status: 'Logged In',
                Vendor_Name: 'RARERABBIT',
                Customer_Type: 'Repeat',
                Category: ['TOP', 'DRESS', 'TROUSER', 'T-SHIRT'],
                Fabric: ['COTTON', 'POLYESTER', 'COTTON BLEND'],
                Color: ['BLACK', 'MULTI', 'BLUE'],
                CLOSURE: ['PULL-ON', 'BUTTON', 'ZIPPER'],
                COLLAR: ['CREW NECK', 'V-NECK', 'SPREAD COLLAR'],
                FIT: ['REGULAR', 'RELAXED', 'FIT AND FLARE'],
                OCCASION: ['CASUAL', 'BRUNCH', 'FORMAL'],
                PATTERN: ['PLAIN', 'FLORAL PRINT', 'ABSTRACT PRINT'],
                SLEEVE: ['FULL SLEEVE', 'HALF SLEEVE', 'SLEEVELESS'],
              })
            }
          />

          <Button
            title="Notification Event"
            onPress={() => recordCustomEvent('Notification Event')}
          />
          <Button
            title="App Inbox Event"
            onPress={() => recordCustomEvent('App Inbox Event')}
          />
          <Button
            title="Show Inbox"
            onPress={() =>
              showInboxUI({
                tabs: ['Offers', 'Promotions'],
                navBarTitle: 'My App Inbox',
                navBarTitleColor: '#FF0000',
                navBarColor: '#FFFFFF',
              })
            }
          />
          <Button
            title="Custom Inbox"
            onPress={() => setShowCustomInbox(true)}
          />
          <Button title="Native Display" onPress={handleNativeDisplay} />
          <Button title="Native Display 2" onPress={handleNativeDisplay2} />
          <Button
            title="In App"
            onPress={() => recordCustomEvent('In-App Event')}
          />
          <Button title="Get CT Id" onPress={getUserCleverTapID} />
          <Button title="Log out" onPress={logoutUser} />

          {displayUnits.length > 0 && (
            <View>
              <Button
                title={
                  showDisplayUnits
                    ? 'Hide Display Units'
                    : `Show Display Units (${displayUnits.length})`
                }
                onPress={() => setShowDisplayUnits(!showDisplayUnits)}
              />
              {showDisplayUnits && (
                <DisplayUnitRenderer
                  displayUnits={displayUnits}
                  carouselIndexes={carouselIndexes}
                  setCarouselIndexes={setCarouselIndexes}
                  carouselRefs={carouselRefs}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
