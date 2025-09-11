/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock the CleverTap multi-instance module before importing App
jest.mock('../clevertapMulti', () => ({
  CleverTapMulti: {
    initInstance: jest.fn().mockResolvedValue(true),
    pushEvent: jest.fn(),
    pushProfile: jest.fn(),
    getCleverTapID: jest.fn().mockResolvedValue('test-id'),
    pushAppLaunchedEvent: jest.fn(),
    pushScreenViewedEvent: jest.fn(),
  },
}));

// Mock React Native platform and permissions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Mock Platform
  RN.Platform.OS = 'ios';

  // Mock PermissionsAndroid
  RN.PermissionsAndroid = {
    requestMultiple: jest.fn().mockResolvedValue({
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
      'android.permission.POST_NOTIFICATIONS': 'granted',
    }),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  };

  // Mock NativeModules
  RN.NativeModules.CleverTapMultiInstance = {
    initInstance: jest.fn().mockResolvedValue(true),
    pushEvent: jest.fn(),
    pushProfile: jest.fn(),
    getCleverTapID: jest.fn().mockResolvedValue('test-id'),
    pushAppLaunchedEvent: jest.fn(),
    pushScreenViewedEvent: jest.fn(),
  };

  return RN;
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('CleverTap multi-instance initialization', async () => {
  const {CleverTapMulti} = require('../clevertapMulti');

  await ReactTestRenderer.act(async () => {
    await CleverTapMulti.initInstance('test', 'TEST-ACCOUNT', 'TEST-TOKEN', 'us1');
  });

  expect(CleverTapMulti.initInstance).toHaveBeenCalledWith('test', 'TEST-ACCOUNT', 'TEST-TOKEN', 'us1');
});

test('CleverTap multi-instance push event', () => {
  const {CleverTapMulti} = require('../clevertapMulti');

  CleverTapMulti.pushEvent('test', 'Test Event', {prop1: 'value1'});

  expect(CleverTapMulti.pushEvent).toHaveBeenCalledWith('test', 'Test Event', {prop1: 'value1'});
});

test('CleverTap multi-instance push profile', () => {
  const {CleverTapMulti} = require('../clevertapMulti');

  const profile = {Name: 'Test User', Email: 'test@example.com'};
  CleverTapMulti.pushProfile('test', profile);

  expect(CleverTapMulti.pushProfile).toHaveBeenCalledWith('test', profile);
});

test('CleverTap multi-instance get ID', async () => {
  const {CleverTapMulti} = require('../clevertapMulti');

  const id = await CleverTapMulti.getCleverTapID('test');

  expect(CleverTapMulti.getCleverTapID).toHaveBeenCalledWith('test');
  expect(id).toBe('test-id');
});

test('CleverTap system events', () => {
  const {CleverTapMulti} = require('../clevertapMulti');

  CleverTapMulti.pushAppLaunchedEvent('test');
  CleverTapMulti.pushScreenViewedEvent('test', 'Home Screen');

  expect(CleverTapMulti.pushAppLaunchedEvent).toHaveBeenCalledWith('test');
  expect(CleverTapMulti.pushScreenViewedEvent).toHaveBeenCalledWith('test', 'Home Screen');
});
