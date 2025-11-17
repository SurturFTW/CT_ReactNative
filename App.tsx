const CleverTap = require('clevertap-react-native');

import React, {useState, useRef, useEffect} from 'react';
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
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
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

const {width: screenWidth} = Dimensions.get('window');

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
  displayUnitContainer: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  displayUnitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  carouselContainer: {
    marginBottom: 15,
    height: 280,
  },
  carouselItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    width: screenWidth - 40,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  carouselImage: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 10,
  },
  carouselText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  carouselKeyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: '#ddd',
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  actionButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  displayUnitInfo: {
    backgroundColor: '#e8f4f8',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  payloadText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  viewButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  CleverTap.addListener(
    CleverTap.CleverTapPushNotificationClicked,
    (e: any) => {
      console.log('Push notification clicked', e);
    },
  );

  let localInApp = {
    inAppType: 'alert',
    titleText: 'Get Notified',
    messageText: 'Enable Notification permission',
    followDeviceOrientation: true,
    positiveBtnText: 'Allow',
    negativeBtnText: 'Cancel',
    fallbackToSettings: true,
  };

  CleverTap.promptPushPrimer(localInApp);

  const onLogin = () => {
    var myStuff = ['bag', 'shoes'];
    var props = {
      Name: 'React Native',
      Identity: '1990',
      Email: 'react.test@abc.com',
      Phone: '+911122334455',
      Gender: 'M',
      DOB: new Date('1992-12-22T06:35:31'),

      // optional fields. controls whether the user will be sent email, push, etc.
      'MSG-email': false,
      'MSG-push': true,
      'MSG-sms': false,
      'MSG-whatsapp': true,
      Stuff: myStuff,
    };
    CleverTap.onUserLogin(props);
    console.log('User Login');
  };

  const onEvent = () => {
    // event with properties
    var prods = {Name: 'XYZ', Price: 123};
    CleverTap.recordEvent('Product Viewed', prods);
    console.log('Event with properties');
  };

  const onPush = () => {
    CleverTap.recordEvent('Notification Event');
    console.log('Push Event');
  };

  const onInbox = () => {
    CleverTap.recordEvent('App Inbox Event');
    console.log('App Inbox Event');
    CleverTap.initializeInbox();
    CleverTap.showInbox();
  };

  const [displayUnits, setDisplayUnits] = useState<any[]>([]);
  const [hasDisplayUnits, setHasDisplayUnits] = useState(false);
  const [showDisplayUnits, setShowDisplayUnits] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: string]: number;
  }>({});
  const carouselRef = useRef<FlatList>(null);
  const carouselRefs = useRef<{[key: string]: FlatList | null}>({});

  const onNative = () => {
    CleverTap.recordEvent('Native Event', {});
    console.log('Native Display Event recorded');
    getAllDisplayUnits();
  };

  // Auto-scroll effect for all carousels
  useEffect(() => {
    if (displayUnits.length === 0) return;

    const intervals: NodeJS.Timeout[] = [];

    displayUnits.forEach((displayUnit, displayUnitIndex) => {
      if (displayUnit.content && displayUnit.content.length > 1) {
        const unitId = displayUnit.wzrk_id || `unit_${displayUnitIndex}`;

        const interval = setInterval(() => {
          setCarouselIndexes(prev => {
            const currentIndex = prev[unitId] || 0;
            const nextIndex = (currentIndex + 1) % displayUnit.content.length;

            // Scroll the carousel
            const carouselRef = carouselRefs.current[unitId];
            if (carouselRef) {
              carouselRef.scrollToIndex({
                index: nextIndex,
                animated: true,
              });
            }

            return {
              ...prev,
              [unitId]: nextIndex,
            };
          });
        }, 3000); // Change slide every 3 seconds

        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [displayUnits]);

  const getAllDisplayUnits = () => {
    try {
      console.log('Getting all display units...');
      CleverTap.getAllDisplayUnits((err: any, displayUnits: any) => {
        if (err) {
          console.log('Error getting display units:', err);
          setDisplayUnits([]);
          setHasDisplayUnits(false);
        } else {
          console.log('Display Units:', displayUnits);
          if (displayUnits && displayUnits.length > 0) {
            setDisplayUnits(displayUnits);
            setHasDisplayUnits(true);
            console.log(`Found ${displayUnits.length} display units`);
          } else {
            setDisplayUnits([]);
            setHasDisplayUnits(false);
            console.log('No display units available');
          }
        }
      });
    } catch (e) {
      console.log('Error in getAllDisplayUnits:', e);
      setDisplayUnits([]);
      setHasDisplayUnits(false);
    }
  };

  const markDisplayUnitAsViewed = (unitId: string) => {
    try {
      CleverTap.recordEvent('Display Unit Viewed', {
        unit_id: unitId,
        source: 'manual_trigger',
        timestamp: new Date().toISOString(),
      });
      console.log(`Display unit viewed: ${unitId}`);
    } catch (e) {
      console.log('Error marking unit as viewed:', e);
    }
  };

  const onContentItemClicked = (item: any, unitId: string) => {
    try {
      CleverTap.recordEvent('Native Display Content Clicked', {
        unit_id: unitId,
        content_key: item.key?.toString() || '',
        media_url: item.media?.url || '',
        action_url: item.action?.hasUrl
          ? Platform.OS === 'ios'
            ? item.action.url?.ios?.text
            : item.action.url?.android?.text
          : '',
        timestamp: new Date().toISOString(),
      });
      console.log('Ferrari F1 carousel content clicked!', {
        key: item.key,
        mediaUrl: item.media?.url,
      });
    } catch (e) {
      console.log('Error recording click:', e);
    }
  };

  const onGetId = () => {
    CleverTap.getCleverTapID((err: any, res: any) => {
      console.log('CleverTapID', res, err);
    });
  };
  const onInApp = () => {
    CleverTap.recordEvent('In-App Event');
    console.log('INAPP NOTIFICATION SHOWN 123');
    CleverTap.addListener(
      CleverTap.CleverTapInAppNotificationShowed,
      (event: any) => {
        console.log('INAPP NOTIFICATION SHOWN 123', event);
      },
    );
  };

  const renderDisplayUnit = ({item, index}: {item: any; index: number}) => {
    const unitId = item.wzrk_id || `unit_${index}`;
    const currentCarouselIndex = carouselIndexes[unitId] || 0;

    const renderCarouselItem = ({
      item: contentItem,
      index: contentIndex,
    }: {
      item: any;
      index: number;
    }) => {
      const handleContentPress = () => {
        console.log('Carousel item pressed:', contentItem.key);
        onContentItemClicked(contentItem, contentItem.key?.toString());
      };

      const handleActionPress = async () => {
        if (contentItem.action?.hasUrl && contentItem.action?.url) {
          const url =
            Platform.OS === 'ios'
              ? contentItem.action.url.ios?.text ||
                contentItem.action.url.ios?.replacements
              : contentItem.action.url.android?.text ||
                contentItem.action.url.android?.replacements;

          if (url) {
            try {
              await Linking.openURL(url);
              onContentItemClicked(contentItem, contentItem.key?.toString());
            } catch (error) {
              console.log('Error opening URL:', error);
              Alert.alert('Error', 'Unable to open link');
            }
          }
        }
      };

      return (
        <TouchableOpacity
          style={styles.carouselItem}
          onPress={handleContentPress}>
          <Text style={styles.carouselKeyText}>
            Item {contentIndex + 1} (Key: {contentItem.key})
          </Text>

          {contentItem.media?.url && (
            <Image
              source={{uri: contentItem.media.url}}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          )}

          {contentItem.recommendedText?.text && (
            <Text style={styles.carouselText} numberOfLines={2}>
              {contentItem.recommendedText.text}
            </Text>
          )}

          {contentItem.action?.hasUrl && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleActionPress}>
              <Text style={styles.actionButtonText}>🏎️ Visit Ferrari</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    };

    const onViewableItemsChanged = ({viewableItems}: any) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index || 0;
        setCarouselIndexes(prev => ({
          ...prev,
          [unitId]: newIndex,
        }));
      }
    };

    const viewabilityConfig = {
      viewAreaCoveragePercentThreshold: 50,
    };

    return (
      <View style={styles.displayUnitContainer}>
        <Text style={styles.displayUnitTitle}>
          Ferrari F1 Carousel {index + 1}
        </Text>

        {/* Display unit metadata */}
        <View style={styles.displayUnitInfo}>
          <Text style={styles.infoText}>Type: {item.type || 'carousel'}</Text>
          <Text style={styles.infoText}>ID: {item.wzrk_id}</Text>
          <Text style={styles.infoText}>Background: {item.bg}</Text>
          <Text style={styles.infoText}>
            Content Items: {item.content?.length || 0}
          </Text>
        </View>

        {/* Carousel content */}
        {item.content && item.content.length > 0 && (
          <View style={styles.carouselContainer}>
            <Text
              style={[
                styles.displayUnitTitle,
                {fontSize: 14, marginBottom: 10},
              ]}>
              Carousel Content ({item.content.length} items):
            </Text>
            <FlatList
              ref={ref => {
                carouselRefs.current[unitId] = ref;
              }}
              data={item.content}
              renderItem={renderCarouselItem}
              keyExtractor={(contentItem, contentIndex) =>
                `content_${contentIndex}_${contentItem.key}`
              }
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(data, index) => ({
                length: screenWidth - 40,
                offset: (screenWidth - 40) * index,
                index,
              })}
            />

            {/* Pagination dots */}
            <View style={styles.paginationContainer}>
              {item.content.map((_: any, dotIndex: number) => (
                <View
                  key={dotIndex}
                  style={[
                    styles.paginationDot,
                    currentCarouselIndex === dotIndex &&
                      styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            markDisplayUnitAsViewed(item.wzrk_id || `unit_${index}`)
          }>
          <Text style={styles.viewButtonText}>Mark Carousel as Viewed</Text>
        </TouchableOpacity>

        {/* Raw payload toggle */}
        <TouchableOpacity
          onPress={() =>
            console.log('Full carousel payload:', JSON.stringify(item, null, 2))
          }>
          <Text style={styles.payloadText}>
            🔍 Tap to see full carousel payload in console
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const toggleDisplayUnits = () => {
    setShowDisplayUnits(!showDisplayUnits);
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

          {hasDisplayUnits && (
            <View>
              <Button
                title={
                  showDisplayUnits
                    ? 'Hide Display Units'
                    : `Show Display Units (${displayUnits.length})`
                }
                onPress={toggleDisplayUnits}
              />

              {showDisplayUnits && (
                <View style={{flex: 1}}>
                  <FlatList
                    data={displayUnits}
                    renderItem={renderDisplayUnit}
                    keyExtractor={(item, index) => `display_unit_${index}`}
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
