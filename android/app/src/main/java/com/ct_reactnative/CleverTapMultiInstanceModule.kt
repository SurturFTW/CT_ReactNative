package com.ct_reactnative

import android.content.Context
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapInstanceConfig
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator

class CleverTapMultiInstanceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val instances: MutableMap<String, CleverTapAPI> = mutableMapOf()

    init {
        val context: Context = reactContext.applicationContext

        val config1 = CleverTapInstanceConfig.createInstance(
            context, "TEST-865-ZRW-7K7Z", "TEST-021-56b", "eu1"
        )
        instances["dashboard1"] = CleverTapAPI.instanceWithConfig(context, config1)

        val config2 = CleverTapInstanceConfig.createInstance(
            context, "TEST-4R8-7ZK-6K7Z", "TEST-31a-b24", "eu1"
        )
        instances["dashboard2"] = CleverTapAPI.instanceWithConfig(context, config2)
    }

    override fun getName(): String = "CleverTapMultiInstance"

    @ReactMethod
    fun recordEvent(instanceKey: String, eventName: String, props: ReadableMap?) {
        val instance = instances[instanceKey]
        if (instance != null) {
            if (props != null) {
                val map = mutableMapOf<String, Any>()
                val iterator = props.keySetIterator()
                while (iterator.hasNextKey()) {
                    val key = iterator.nextKey()
                    when (props.getType(key)) {
                        com.facebook.react.bridge.ReadableType.String -> map[key] = props.getString(key) ?: ""
                        com.facebook.react.bridge.ReadableType.Number -> map[key] = props.getDouble(key)
                        com.facebook.react.bridge.ReadableType.Boolean -> map[key] = props.getBoolean(key)
                        else -> {} // skip unsupported types
                    }
                }
                instance.pushEvent(eventName, map)
            } else {
                instance.pushEvent(eventName)
            }
        }
    }


    @ReactMethod
    fun recordUserLogin(instanceKey: String, profile: ReadableMap) {
        val instance = instances[instanceKey]
        if (instance != null) {
            val profileMap = mutableMapOf<String, Any>()
            val iterator = profile.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                when (profile.getType(key)) {
                    com.facebook.react.bridge.ReadableType.String -> profileMap[key] = profile.getString(key) ?: ""
                    com.facebook.react.bridge.ReadableType.Number -> profileMap[key] = profile.getDouble(key)
                    com.facebook.react.bridge.ReadableType.Boolean -> profileMap[key] = profile.getBoolean(key)
                    else -> {}
                }
            }
            instance.onUserLogin(profileMap)
        }
    }

}
