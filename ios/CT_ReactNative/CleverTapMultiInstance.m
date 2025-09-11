#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CleverTapMultiInstance, NSObject)

RCT_EXTERN_METHOD(initInstance:(NSString *)instanceId
                  accountId:(NSString *)accountId
                  token:(NSString *)token
                  region:(NSString *)region
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(pushEvent:(NSString *)instanceId
                  eventName:(NSString *)eventName
                  props:(NSDictionary *)props)

RCT_EXTERN_METHOD(pushProfile:(NSString *)instanceId
                  profile:(NSDictionary *)profile)

RCT_EXTERN_METHOD(getCleverTapID:(NSString *)instanceId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(pushAppLaunchedEvent:(NSString *)instanceId)

RCT_EXTERN_METHOD(pushScreenViewedEvent:(NSString *)instanceId
                  screenName:(NSString *)screenName)

@end