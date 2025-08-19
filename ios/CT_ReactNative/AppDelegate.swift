import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

import CleverTapReact

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "CT_ReactNative"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    CleverTap.autoIntegrate() // integrate CleverTap SDK using the autoIntegrate option
    CleverTapReactManager.sharedInstance()?.applicationDidLaunch(options: launchOptions)

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)

    func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  // Forground Notification
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
	                              completionHandler([.badge, .sound, .alert])
        }
    }


  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
