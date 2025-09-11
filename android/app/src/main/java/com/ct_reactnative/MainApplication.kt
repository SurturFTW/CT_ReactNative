package com.ct_reactnative

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

import com.clevertap.react.CleverTapPackage
import com.clevertap.react.CleverTapApplication
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapAPI.LogLevel

class MainApplication : CleverTapApplication(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              // packages.add(CleverTapPackage()) // Only needed when not auto-linking
              add(com.ct_reactnative.CleverTapMultiInstancePackage())

              // return packages;
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    CleverTapAPI.setDebugLevel(LogLevel.VERBOSE)
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)

    // ✅ Register lifecycle once here
    registerActivityLifecycleCallbacks(CleverTapLifecycleHelper())

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
}

}
