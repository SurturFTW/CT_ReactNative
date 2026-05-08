const CleverTap = require('clevertap-react-native');

export interface DisplayUnit {
  wzrk_id: string;
  type: string;
  bg: string;
  content: any[];
}

export const getAllDisplayUnits = (): Promise<DisplayUnit[]> => {
  return new Promise(resolve => {
    try {
      console.log('Getting all display units...');
      CleverTap.getAllDisplayUnits((err: any, displayUnits: any) => {
        if (err) {
          console.log('Error getting display units:', err);
          resolve([]);
        } else if (displayUnits && displayUnits.length > 0) {
          console.log(`Found ${displayUnits.length} display units`);
          resolve(displayUnits);
        } else {
          console.log('No display units available');
          resolve([]);
        }
      });
    } catch (e) {
      console.log('Error in getAllDisplayUnits:', e);
      resolve([]);
    }
  });
};

export const recordNativeDisplayEvent = (eventName: string) => {
  CleverTap.recordEvent(eventName, {});
  console.log(`${eventName} recorded`);
};
