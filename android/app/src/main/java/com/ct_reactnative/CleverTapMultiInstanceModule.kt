package com.ct_reactnative

import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapInstanceConfig
import com.facebook.react.bridge.*

class CleverTapMultiInstanceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        val instances: MutableMap<String, CleverTapAPI> = mutableMapOf()
    }

    override fun getName(): String = "CleverTapMultiInstance"

    // ✅ Init a new CleverTap instance
    @ReactMethod
    fun initInstance(instanceName: String, accountId: String, token: String, region: String, promise: Promise) {
        try {
            val config = CleverTapInstanceConfig.createInstance(reactContext, accountId, token, region)
            val ct = CleverTapAPI.instanceWithConfig(reactContext, config)
            
            // Enable system events capturing
            ct.enablePersonalization()
            
            instances[instanceName] = ct
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", "Failed to initialize CleverTap instance: ${e.message}", e)
        }
    }

    // ✅ Push Event
    @ReactMethod
    fun pushEvent(instanceName: String, eventName: String, props: ReadableMap?) {
        instances[instanceName]?.let { ct ->
            if (props != null) {
                ct.pushEvent(eventName, props.toHashMap())
            } else {
                ct.pushEvent(eventName)
            }
        }
    }

    // ✅ Push Profile
    @ReactMethod
    fun pushProfile(instanceName: String, profile: ReadableMap) {
        instances[instanceName]?.pushProfile(profile.toHashMap())
    }

    // ✅ Get CleverTap ID
    @ReactMethod
    fun getCleverTapID(instanceName: String, promise: Promise) {
        instances[instanceName]?.let { ct ->
            val cleverTapID = ct.cleverTapID
            promise.resolve(cleverTapID ?: "")
        } ?: run {
            promise.reject("INSTANCE_NOT_FOUND", "CleverTap instance '$instanceName' not found")
        }
    }

    // ✅ Push system event for app launch
    @ReactMethod
    fun pushAppLaunchedEvent(instanceName: String) {
        instances[instanceName]?.pushEvent("App Launched")
    }

    // ✅ Push system event for screen view
    @ReactMethod 
    fun pushScreenViewedEvent(instanceName: String, screenName: String) {
        instances[instanceName]?.pushEvent("Screen Viewed", hashMapOf("Screen Name" to screenName))
    }
}
