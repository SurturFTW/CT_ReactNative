package com.ct_reactnative

import android.content.Context
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapInstanceConfig
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
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
                        ReadableType.String -> map[key] = props.getString(key) ?: ""
                        ReadableType.Number -> map[key] = props.getDouble(key)
                        ReadableType.Boolean -> map[key] = props.getBoolean(key)
                        else -> map[key] = props.getDynamic(key).toString()
                    }
                }
                instance.pushEvent(eventName, map)
            } else {
                instance.pushEvent(eventName)
            }
        }
    }

    @ReactMethod
    fun recordUserLogin(instanceKey: String, profile: ReadableMap?) {
        val instance = instances[instanceKey] ?: return

        if (profile == null) return // Do nothing if profile is null

        val profileMap = mutableMapOf<String, Any>()
        val iterator: ReadableMapKeySetIterator = profile.keySetIterator()
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            when (profile.getType(key)) {
                ReadableType.String -> {
                    val value = profile.getString(key) ?: ""
                    if (key == "DOB") {
                        // Convert DOB string to Date
                        try {
                            val formatter = java.text.SimpleDateFormat(
                                "yyyy-MM-dd'T'HH:mm:ss",
                                java.util.Locale.getDefault()
                            )
                            profileMap[key] = formatter.parse(value) ?: value
                        } catch (e: Exception) {
                            profileMap[key] = value
                        }
                    } else {
                        profileMap[key] = value
                    }
                }
                ReadableType.Number -> profileMap[key] = profile.getDouble(key)
                ReadableType.Boolean -> profileMap[key] = profile.getBoolean(key)
                ReadableType.Array -> {
                    val arr = profile.getArray(key) ?: continue // skip if null
                    val list = mutableListOf<Any>()
                    for (i in 0 until arr.size()) {
                        when (arr.getType(i)) {
                            ReadableType.String -> list.add(arr.getString(i) ?: "")
                            ReadableType.Number -> list.add(arr.getDouble(i))
                            ReadableType.Boolean -> list.add(arr.getBoolean(i))
                            else -> {}
                        }
                    }
                    profileMap[key] = list
                }
                else -> profileMap[key] = profile.getDynamic(key).toString()
            }
        }
        instance.onUserLogin(profileMap)
    }
}
