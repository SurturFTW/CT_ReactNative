import {Platform, PermissionsAndroid, Alert} from 'react-native';

const CleverTap = require('clevertap-react-native');

export const initializeCleverTap = async () => {
  try {
    CleverTap.registerForPush();
    CleverTap.setDebugLevel(3);
    CleverTap.initializeInbox();

    CleverTap.createNotificationChannel(
      'test',
      'Clever Tap React Native Testing',
      'CT React Native Testing',
      5,
      true,
    );

    await requestAndroidPermissions();
  } catch (e) {
    console.log('Error initializing CleverTap:', e);
  }
};

export const requestAndroidPermissions = async () => {
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

      if (!locationGranted) console.warn('Location permission denied');
      if (!notificationsGranted)
        console.warn('Notifications permission denied');

      return notificationsGranted;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true;
};

export const setupCleverTapListeners = () => {
  CleverTap.addListener(
    CleverTap.CleverTapPushNotificationClicked,
    (e: any) => {
      console.log('Push Notification Clicked:', e);
      Alert.alert('Notification Clicked', JSON.stringify(e));
    },
  );

  CleverTap.addListener(
    CleverTap.CleverTapInAppNotificationShowed,
    (event: any) => {
      console.log('In-App Notification Showed:', event);
    },
  );

  CleverTap.addListener(
    CleverTap.CleverTapInAppNotificationDismissed,
    (event: any) => {
      console.log('In-App Notification Dismissed:', event);
    },
  );
};

export const checkNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const permission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return permission;
    } catch (err) {
      console.warn('Error checking notification permission:', err);
      return false;
    }
  }
  return true; // iOS handles this differently
};

export const promptPushPrimer = async () => {
  // Only show primer if notification permission is NOT already granted
  const hasPermission = await checkNotificationPermission();

  if (!hasPermission) {
    const localInApp = {
      inAppType: 'alert',
      titleText: 'Get Notified',
      messageText: 'Enable Notification permission',
      followDeviceOrientation: true,
      positiveBtnText: 'Allow',
      negativeBtnText: 'Cancel',
      fallbackToSettings: true,
    };
    CleverTap.promptPushPrimer(localInApp);
  } else {
    console.log('Notification permission already granted');
  }
};

export const showInboxUI = (config: any) => {
  CleverTap.showInbox(config);
};
