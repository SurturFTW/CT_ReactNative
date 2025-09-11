import {NativeModules} from 'react-native';

const {CleverTapMultiInstance} = NativeModules;

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
}

export const CleverTapMulti =
  CleverTapMultiInstance as CleverTapMultiInstanceType;
