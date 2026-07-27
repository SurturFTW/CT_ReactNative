import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Linking,
} from 'react-native';

import CustomInboxScreen from './src/screens/CustomInboxScreen';
import DeeplinkScreen from './src/screens/DeeplinkScreen';
import PromoDeeplinkScreen from './src/screens/PromoDeeplinkScreen';
import DisplayUnitRenderer from './src/components/DisplayUnitRenderer';
import AppButton from './src/components/AppButton';
import Section from './src/components/Section';
import {colors} from './src/styles/theme';
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

const HOME_DEEPLINK_URL = 'ctdemo://home';
const DEEPLINK_PAGE_URL = 'ctdemo://deeplink';
const PROMO_DEEPLINK_URL = 'ctdemo://promo';
const PROMO_DEEPLINK_TEST_URL =
  'ctdemo://promo?id=123&source=push&campaign=summer_sale';

function App(): React.JSX.Element {
  const [displayUnits, setDisplayUnits] = useState<any[]>([]);
  const [showDisplayUnits, setShowDisplayUnits] = useState(false);
  const [showCustomInbox, setShowCustomInbox] = useState(false);
  const [deeplinkUrl, setDeeplinkUrl] = useState<string | null>(null);
  const [promoDeeplinkUrl, setPromoDeeplinkUrl] = useState<string | null>(null);
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: string]: number;
  }>({});
  const carouselRefs = useRef<{[key: string]: any}>({});

  const handleDeeplink = (url: string) => {
    if (url === HOME_DEEPLINK_URL || url.startsWith(`${HOME_DEEPLINK_URL}/`)) {
      setDeeplinkUrl(null);
      setPromoDeeplinkUrl(null);
      setShowCustomInbox(false);
      setShowDisplayUnits(false);
      return;
    }

    if (
      url === PROMO_DEEPLINK_URL ||
      url.startsWith(`${PROMO_DEEPLINK_URL}?`) ||
      url.startsWith(`${PROMO_DEEPLINK_URL}/`)
    ) {
      setPromoDeeplinkUrl(url);
      return;
    }

    if (url === DEEPLINK_PAGE_URL || url.startsWith(`${DEEPLINK_PAGE_URL}/`)) {
      setDeeplinkUrl(url);
    }
  };

  useEffect(() => {
    initializeCleverTap();
    setupCleverTapListeners();
    promptPushPrimer();

    // Handle deeplink when app is already open
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeeplink(url);
    });

    // Handle deeplink that launched the app from a cold start
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeeplink(url);
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
      <SafeAreaView style={styles.flex}>
        <DeeplinkScreen url={deeplinkUrl} onBack={() => setDeeplinkUrl(null)} />
      </SafeAreaView>
    );
  }

  if (promoDeeplinkUrl) {
    return (
      <SafeAreaView style={styles.flex}>
        <PromoDeeplinkScreen
          url={promoDeeplinkUrl}
          onBack={() => setPromoDeeplinkUrl(null)}
        />
      </SafeAreaView>
    );
  }

  if (showCustomInbox) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.backButtonWrap}>
          <AppButton
            title="← Back to App"
            variant="primary"
            onPress={() => setShowCustomInbox(false)}
          />
        </View>
        <CustomInboxScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, styles.background, {paddingTop: 50}]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.background}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CleverTap RN Demo</Text>
          <Text style={styles.headerSubtitle}>
            Exercise SDK features and deeplink scenarios
          </Text>
        </View>

        <Section title="Profile">
          <AppButton title="Login" variant="primary" onPress={handleLogin} />
          <AppButton title="Get CT Id" onPress={getUserCleverTapID} />
          <AppButton title="Log out" variant="danger" onPress={logoutUser} />
        </Section>

        <Section title="Events">
          <AppButton
            title="Custom Event"
            onPress={() =>
              recordCustomEvent('Product Viewed', {
                Name: 'XYZ',
                'Product ID': 123,
              })
            }
          />
          <AppButton
            title="Multi-Value Event"
            onPress={() =>
              recordCustomEvent('Collection Viewed', {
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
          <AppButton
            title="Notification Event"
            onPress={() => recordCustomEvent('Notification Event')}
          />
          <AppButton
            title="App Inbox Event"
            onPress={() => recordCustomEvent('App Inbox Event')}
          />
          <AppButton
            title="In App Event"
            onPress={() => recordCustomEvent('In-App Event')}
          />
        </Section>

        <Section title="App Inbox">
          <AppButton
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
          <AppButton
            title="Custom Inbox"
            onPress={() => setShowCustomInbox(true)}
          />
        </Section>

        <Section title="Deeplinks">
          <AppButton
            title="Home Deeplink"
            onPress={() => Linking.openURL(HOME_DEEPLINK_URL)}
          />
          <AppButton
            title="Deeplink Page"
            onPress={() => Linking.openURL(DEEPLINK_PAGE_URL)}
          />
          <AppButton
            title="Promo Deeplink (with params)"
            onPress={() => Linking.openURL(PROMO_DEEPLINK_TEST_URL)}
          />
        </Section>

        <Section title="Display Units">
          <AppButton title="Native Display" onPress={handleNativeDisplay} />
          <AppButton title="Native Display 2" onPress={handleNativeDisplay2} />
          {displayUnits.length > 0 && (
            <AppButton
              title={
                showDisplayUnits
                  ? 'Hide Display Units'
                  : `Show Display Units (${displayUnits.length})`
              }
              onPress={() => setShowDisplayUnits(!showDisplayUnits)}
            />
          )}
          {showDisplayUnits && (
            <DisplayUnitRenderer
              displayUnits={displayUnits}
              carouselIndexes={carouselIndexes}
              setCarouselIndexes={setCarouselIndexes}
              carouselRefs={carouselRefs}
            />
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  background: {backgroundColor: colors.background},
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.title,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.subtitle,
    marginTop: 4,
  },
  backButtonWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default App;
