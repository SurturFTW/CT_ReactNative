import {NativeModules, Platform} from 'react-native';

const {CleverTapMultiInstance} = NativeModules;

// Web CleverTap SDK import (only for web platform)
let webCleverTap: any = null;
if (Platform.OS === 'web') {
  try {
    webCleverTap = require('clevertap-web-sdk');
  } catch (e) {
    console.warn('CleverTap Web SDK not found. Web platform support disabled.');
  }
}

interface Profile {
  Identity?: string;
  Email?: string;
  Name?: string;
  Phone?: string;
  [key: string]: any;
}

interface EventProps {
  [key: string]: any;
}

interface CleverTapMultiInstanceType {
  initInstance: (
    id: string,
    accountId: string,
    token: string,
    region?: string,
  ) => Promise<boolean>;
  pushEvent: (id: string, event: string, props?: EventProps) => void;
  pushProfile: (id: string, profile?: Profile) => void;
  getCleverTapID: (id: string) => Promise<string>;
  pushAppLaunchedEvent: (id: string) => void;
  pushScreenViewedEvent: (id: string, screenName: string) => void;
}

// Web implementation
class WebCleverTapMulti implements CleverTapMultiInstanceType {
  private instances: Map<string, any> = new Map();

  async initInstance(
    id: string,
    accountId: string,
    token: string,
    region: string = 'us1',
  ): Promise<boolean> {
    if (!webCleverTap) {
      throw new Error('CleverTap Web SDK not available');
    }

    try {
      const config = {
        account: accountId,
        token: token,
        region: region,
        enablePersonalization: true,
      };

      const instance = webCleverTap.init(config);
      this.instances.set(id, instance);

      // Push app launched system event
      instance.event.push('App Launched');

      return true;
    } catch (error) {
      console.error('Failed to initialize CleverTap web instance:', error);
      throw error;
    }
  }

  pushEvent(id: string, event: string, props?: EventProps): void {
    const instance = this.instances.get(id);
    if (!instance) {
      console.warn(`CleverTap web instance '${id}' not found`);
      return;
    }

    if (props) {
      instance.event.push(event, props);
    } else {
      instance.event.push(event);
    }
  }

  pushProfile(id: string, profile?: Profile): void {
    const instance = this.instances.get(id);
    if (!instance) {
      console.warn(`CleverTap web instance '${id}' not found`);
      return;
    }

    if (profile) {
      instance.profile.push(profile);
    }
  }

  async getCleverTapID(id: string): Promise<string> {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`CleverTap web instance '${id}' not found`);
    }

    return new Promise((resolve) => {
      instance.getCleverTapID((cleverTapID: string) => {
        resolve(cleverTapID || '');
      });
    });
  }

  pushAppLaunchedEvent(id: string): void {
    this.pushEvent(id, 'App Launched');
  }

  pushScreenViewedEvent(id: string, screenName: string): void {
    this.pushEvent(id, 'Screen Viewed', {'Screen Name': screenName});
  }
}

// Native mobile implementation wrapper
class NativeCleverTapMulti implements CleverTapMultiInstanceType {
  async initInstance(
    id: string,
    accountId: string,
    token: string,
    region: string = 'us1',
  ): Promise<boolean> {
    if (!CleverTapMultiInstance) {
      throw new Error('CleverTap native module not available');
    }
    return CleverTapMultiInstance.initInstance(id, accountId, token, region);
  }

  pushEvent(id: string, event: string, props?: EventProps): void {
    if (!CleverTapMultiInstance) {
      console.warn('CleverTap native module not available');
      return;
    }
    CleverTapMultiInstance.pushEvent(id, event, props);
  }

  pushProfile(id: string, profile?: Profile): void {
    if (!CleverTapMultiInstance || !profile) {
      console.warn('CleverTap native module not available or profile is empty');
      return;
    }
    CleverTapMultiInstance.pushProfile(id, profile);
  }

  async getCleverTapID(id: string): Promise<string> {
    if (!CleverTapMultiInstance) {
      throw new Error('CleverTap native module not available');
    }
    return CleverTapMultiInstance.getCleverTapID(id);
  }

  pushAppLaunchedEvent(id: string): void {
    if (!CleverTapMultiInstance) {
      console.warn('CleverTap native module not available');
      return;
    }
    CleverTapMultiInstance.pushAppLaunchedEvent(id);
  }

  pushScreenViewedEvent(id: string, screenName: string): void {
    if (!CleverTapMultiInstance) {
      console.warn('CleverTap native module not available');
      return;
    }
    CleverTapMultiInstance.pushScreenViewedEvent(id, screenName);
  }
}

// Export the appropriate implementation based on platform
export const CleverTapMulti: CleverTapMultiInstanceType =
  Platform.OS === 'web' ? new WebCleverTapMulti() : new NativeCleverTapMulti();
