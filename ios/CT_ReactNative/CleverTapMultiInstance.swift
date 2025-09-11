import Foundation
import CleverTapReact
import CleverTap_iOS_SDK

@objc(CleverTapMultiInstance)
class CleverTapMultiInstance: NSObject {
    static var instances: [String: CleverTap] = [:]
    
    // Initialize a new CleverTap instance
    @objc
    func initInstance(_ instanceId: String, accountId: String, token: String, region: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        
        let config = CleverTapInstanceConfig.init()
        config.accountId = accountId
        config.accountToken = token
        config.accountRegion = region
        
        // Enable personalization and system events
        config.analyticsOnly = false
        
        do {
            let instance = CleverTap.instanceWithConfig(config)
            CleverTapMultiInstance.instances[instanceId] = instance
            
            // Enable system events capturing
            instance?.enablePersonalization()
            
            resolve(true)
        } catch {
            reject("INIT_ERROR", "Failed to initialize CleverTap instance: \(error.localizedDescription)", error)
        }
    }
    
    // Push custom event
    @objc
    func pushEvent(_ instanceId: String, eventName: String, props: [String: Any]?) {
        guard let instance = CleverTapMultiInstance.instances[instanceId] else {
            print("CleverTap instance '\(instanceId)' not found")
            return
        }
        
        if let properties = props {
            instance.recordEvent(eventName, withProps: properties)
        } else {
            instance.recordEvent(eventName)
        }
    }
    
    // Push user profile
    @objc
    func pushProfile(_ instanceId: String, profile: [String: Any]) {
        guard let instance = CleverTapMultiInstance.instances[instanceId] else {
            print("CleverTap instance '\(instanceId)' not found")
            return
        }
        
        instance.onUserLogin(profile)
    }
    
    // Get CleverTap ID
    @objc
    func getCleverTapID(_ instanceId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let instance = CleverTapMultiInstance.instances[instanceId] else {
            reject("INSTANCE_NOT_FOUND", "CleverTap instance '\(instanceId)' not found", nil)
            return
        }
        
        let cleverTapID = instance.profileGetCleverTapID() ?? ""
        resolve(cleverTapID)
    }
    
    // Push system event for app launch
    @objc
    func pushAppLaunchedEvent(_ instanceId: String) {
        guard let instance = CleverTapMultiInstance.instances[instanceId] else {
            print("CleverTap instance '\(instanceId)' not found")
            return
        }
        
        instance.recordEvent("App Launched")
    }
    
    // Push system event for screen view
    @objc
    func pushScreenViewedEvent(_ instanceId: String, screenName: String) {
        guard let instance = CleverTapMultiInstance.instances[instanceId] else {
            print("CleverTap instance '\(instanceId)' not found")
            return
        }
        
        instance.recordEvent("Screen Viewed", withProps: ["Screen Name": screenName])
    }
}