import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Button,
  useColorScheme,
  Dimensions,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import CustomInboxScreen from './src/screens/CustomInboxScreen';
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
import styles from './src/styles/appStyles';

const {width: screenWidth} = Dimensions.get('window');

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [displayUnits, setDisplayUnits] = useState<any[]>([]);
  const [showDisplayUnits, setShowDisplayUnits] = useState(false);
  const [showCustomInbox, setShowCustomInbox] = useState(false);
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: string]: number;
  }>({});
  const carouselRefs = useRef<{[key: string]: any}>({});

  // Initialize CleverTap on mount
  // ...existing code...
  useEffect(() => {
    initializeCleverTap();
    setupCleverTapListeners();
    promptPushPrimer();
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
              recordCustomEvent('Product Viewed', {Name: 'XYZ', Price: 123})
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
