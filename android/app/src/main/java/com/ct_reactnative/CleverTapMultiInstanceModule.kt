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
    fun initInstance(instanceName: String, accountId: String, token: String, region: String) {
        val config = CleverTapInstanceConfig.createInstance(reactContext, accountId, token, region)
        val ct = CleverTapAPI.instanceWithConfig(reactContext, config)
        instances[instanceName] = ct
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
}
