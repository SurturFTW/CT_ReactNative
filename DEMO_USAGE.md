# CleverTap Multi-Instance Demo

This demonstrates how the CleverTap Multi-Instance implementation works across platforms.

## Example Usage

```typescript
import {CleverTapMulti} from './clevertapMulti';

// 1. Initialize multiple CleverTap instances
const initializeInstances = async () => {
  try {
    // Initialize production dashboard
    await CleverTapMulti.initInstance(
      'production',
      'PROD-ACCOUNT-ID',
      'PROD-TOKEN',
      'us1'
    );

    // Initialize staging dashboard  
    await CleverTapMulti.initInstance(
      'staging',
      'STAGE-ACCOUNT-ID', 
      'STAGE-TOKEN',
      'eu1'
    );

    console.log('✅ All instances initialized');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
};

// 2. Track user login across instances
const trackUserLogin = () => {
  const userProfile = {
    Identity: 'user123',
    Name: 'John Doe',
    Email: 'john@example.com',
    Phone: '+1234567890',
    Age: 30,
    City: 'New York'
  };

  // Send to both instances
  CleverTapMulti.pushProfile('production', userProfile);
  CleverTapMulti.pushProfile('staging', userProfile);
  
  console.log('✅ User profile sent to all instances');
};

// 3. Track custom events
const trackPurchase = () => {
  const purchaseEvent = {
    'Product Name': 'Premium Subscription',
    'Price': 99.99,
    'Currency': 'USD',
    'Category': 'Subscription',
    'Payment Method': 'Credit Card'
  };

  // Track in both dashboards
  CleverTapMulti.pushEvent('production', 'Purchase', purchaseEvent);
  CleverTapMulti.pushEvent('staging', 'Purchase', purchaseEvent);
  
  console.log('✅ Purchase event tracked in all instances');
};

// 4. Track system events
const trackScreenNavigation = (screenName: string) => {
  // Automatically track screen views in all instances
  CleverTapMulti.pushScreenViewedEvent('production', screenName);
  CleverTapMulti.pushScreenViewedEvent('staging', screenName);
  
  console.log(`✅ Screen "${screenName}" tracked in all instances`);
};

// 5. Get CleverTap IDs
const getInstanceIds = async () => {
  try {
    const productionId = await CleverTapMulti.getCleverTapID('production');
    const stagingId = await CleverTapMulti.getCleverTapID('staging');
    
    console.log('Production CleverTap ID:', productionId);
    console.log('Staging CleverTap ID:', stagingId);
    
    return { productionId, stagingId };
  } catch (error) {
    console.error('❌ Failed to get CleverTap IDs:', error);
  }
};

// Complete demo flow
export const runMultiInstanceDemo = async () => {
  console.log('🚀 Starting CleverTap Multi-Instance Demo');
  
  // Step 1: Initialize
  await initializeInstances();
  
  // Step 2: Track app launch system event
  CleverTapMulti.pushAppLaunchedEvent('production');
  CleverTapMulti.pushAppLaunchedEvent('staging');
  console.log('✅ App launch tracked');
  
  // Step 3: User login
  trackUserLogin();
  
  // Step 4: Screen navigation
  trackScreenNavigation('Home Screen');
  trackScreenNavigation('Product Catalog');
  
  // Step 5: Custom events
  trackPurchase();
  
  // Step 6: Get IDs
  await getInstanceIds();
  
  console.log('🎉 Multi-Instance Demo Complete!');
};
```

## Platform Detection

The implementation automatically detects the platform and uses the appropriate CleverTap SDK:

```typescript
// Automatically chooses implementation based on platform
if (Platform.OS === 'web') {
  // Uses clevertap-web-sdk
  const webInstance = webCleverTap.init(config);
} else {
  // Uses native Android/iOS modules
  const nativeInstance = CleverTapMultiInstance.initInstance(params);
}
```

## Features Demonstrated

### ✅ Multi-Instance Management
- Multiple dashboard instances with separate configurations
- Isolated event tracking per instance
- Individual CleverTap ID management

### ✅ Cross-Platform Compatibility  
- **Android**: Native Kotlin module
- **iOS**: Native Swift module
- **Web**: CleverTap Web SDK

### ✅ Event Types
- **Custom Events**: User-defined events with properties
- **System Events**: App launches, screen views
- **Profile Events**: User identification and profile updates

### ✅ Error Handling
- Promise-based async operations
- Proper error propagation
- Graceful fallbacks for missing modules

### ✅ Testing Support
- Comprehensive mocking for unit tests
- Platform-aware test cases
- Isolated testing environment

This multi-instance implementation provides a robust, scalable solution for tracking user behavior across multiple CleverTap dashboards simultaneously.