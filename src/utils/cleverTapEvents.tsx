import {Platform, Alert, Linking} from 'react-native';

const CleverTap = require('clevertap-react-native');

export const recordDisplayUnitClick = async (item: any, unitId: string) => {
  try {
    CleverTap.recordEvent('Display Unit Clicked', {
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

    CleverTap.pushDisplayUnitClickedEventForID(unitId);

    console.log('Display unit content clicked!', {
      unitId,
      key: item.key,
      mediaUrl: item.media?.url,
    });
  } catch (e) {
    console.log('Error recording click:', e);
  }
};

export const markDisplayUnitAsViewed = (unitId: string) => {
  try {
    CleverTap.recordEvent('Display Unit Viewed', {
      unit_id: unitId,
      source: 'manual_trigger',
      timestamp: new Date().toISOString(),
    });

    CleverTap.pushDisplayUnitViewedEventForID(unitId);
    console.log(`Display unit viewed: ${unitId}`);
  } catch (e) {
    console.log('Error marking unit as viewed:', e);
  }
};

export const handleActionPress = async (contentItem: any, unitId: string) => {
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
        await recordDisplayUnitClick(contentItem, unitId);
      } catch (error) {
        console.log('Error opening URL:', error);
        Alert.alert('Error', 'Unable to open link');
      }
    }
  }
};

export const recordCustomEvent = (eventName: string, properties?: any) => {
  CleverTap.recordEvent(eventName, properties || {});
  console.log(`${eventName} recorded`);
};

export const getUserCleverTapID = () => {
  return new Promise(resolve => {
    CleverTap.getCleverTapID((err: any, res: any) => {
      console.log('CleverTapID:', res, err);
      resolve(res);
    });
  });
};
