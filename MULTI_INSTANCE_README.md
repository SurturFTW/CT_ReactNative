# CleverTap Multi-Instance Implementation

## Overview

This React Native application implements CleverTap Multi-Instance functionality across Android, iOS, and Web platforms. It supports both custom events and system events tracking for multiple CleverTap dashboard instances simultaneously.

## Features

### ✅ Cross-Platform Support
- **Android**: Native Kotlin implementation
- **iOS**: Native Swift implementation  
- **Web**: CleverTap Web SDK integration

### ✅ Multi-Instance Management
- Initialize multiple CleverTap instances with different account credentials
- Track events and profiles separately for each instance
- Get CleverTap IDs for each instance

### ✅ Event Tracking
- **Custom Events**: User-defined events with custom properties
- **System Events**: Automatic app lifecycle and screen view events
  - App Launched events
  - Screen Viewed events

## Implementation Details

### TypeScript Bridge (`clevertapMulti.ts`)
- Platform-aware implementation that switches between native modules (iOS/Android) and web SDK
- Unified interface for all platforms
- Proper error handling and fallbacks

### Android Implementation
- **Module**: `CleverTapMultiInstanceModule.kt`
- **Package**: `CleverTapMultiInstancePackage.kt`
- Features: Instance management, event tracking, profile updates, system events

### iOS Implementation
- **Module**: `CleverTapMultiInstance.swift`
- **Bridge**: `CleverTapMultiInstance.m`
- Features: Instance management, event tracking, profile updates, system events

### Web Implementation
- Uses `clevertap-web-sdk` package
- Seamless integration with web applications
- Same API interface as native platforms

## API Reference

### Initialize Instance
```typescript
await CleverTapMulti.initInstance(
  'instance-id',
  'account-id', 
  'token',
  'region'
);
```

### Push Custom Event
```typescript
CleverTapMulti.pushEvent('instance-id', 'Event Name', {
  property1: 'value1',
  property2: 'value2'
});
```

### Push User Profile
```typescript
CleverTapMulti.pushProfile('instance-id', {
  Name: 'John Doe',
  Email: 'john@example.com',
  Phone: '+1234567890'
});
```

### Get CleverTap ID
```typescript
const cleverTapId = await CleverTapMulti.getCleverTapID('instance-id');
```

### System Events
```typescript
// App launch event
CleverTapMulti.pushAppLaunchedEvent('instance-id');

// Screen view event
CleverTapMulti.pushScreenViewedEvent('instance-id', 'Screen Name');
```

## Usage Example

```typescript
import {CleverTapMulti} from './clevertapMulti';

// Initialize multiple instances
await CleverTapMulti.initInstance('dashboard1', 'ACCOUNT-1', 'TOKEN-1', 'us1');
await CleverTapMulti.initInstance('dashboard2', 'ACCOUNT-2', 'TOKEN-2', 'eu1');

// Push events to both instances
CleverTapMulti.pushEvent('dashboard1', 'Product Viewed', {name: 'Product A'});
CleverTapMulti.pushEvent('dashboard2', 'Product Viewed', {name: 'Product A'});

// System events are automatically tracked
CleverTapMulti.pushAppLaunchedEvent('dashboard1');
CleverTapMulti.pushAppLaunchedEvent('dashboard2');
```

## Testing

The implementation includes comprehensive tests that cover:
- Instance initialization
- Event pushing
- Profile updates
- CleverTap ID retrieval
- System events

Run tests with:
```bash
npm test
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. For iOS, install pods:
   ```bash
   cd ios && pod install
   ```

3. For Android, make sure you have the CleverTap SDK configured in your build.gradle

## Platform-Specific Notes

### Android
- Requires CleverTap Android SDK
- Uses `CleverTapInstanceConfig` for multi-instance setup
- Enables personalization for system events

### iOS
- Requires CleverTap iOS SDK
- Uses `CleverTapInstanceConfig` for multi-instance setup
- Integrated with React Native bridge

### Web
- Uses `clevertap-web-sdk` package
- Automatically detects web platform and switches implementation
- Maintains same API interface as native platforms