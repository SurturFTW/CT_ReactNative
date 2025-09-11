package com.ct_reactnative

import android.app.Activity
import android.app.Application
import android.os.Bundle
import com.clevertap.android.sdk.CleverTapAPI

class CleverTapLifecycleHelper : Application.ActivityLifecycleCallbacks {
    override fun onActivityResumed(activity: Activity) {
        // Forward lifecycle to ALL CleverTap instances (default + custom)
        CleverTapAPI.onActivityResumed(activity)
    }

    override fun onActivityPaused(activity: Activity) {
        CleverTapAPI.onActivityPaused()
    }

    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}
    override fun onActivityStarted(activity: Activity) {}
    override fun onActivityStopped(activity: Activity) {}
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
    override fun onActivityDestroyed(activity: Activity) {}
}
