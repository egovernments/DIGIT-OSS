package org.egovernment.rainmaker;

import android.app.Activity;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.webkit.JavascriptInterface;
import android.Manifest;

/**
 * Created by varun on 09/04/18.
 */

public class AppJavaScriptProxy  {
	private Activity activity = null;
	private SmsReceiver smsReceiver = null;
	private boolean hasSmsReceiverRegistered = false;

	public AppJavaScriptProxy(MainActivity activity) {
		this.activity = activity;
	}

	@JavascriptInterface
	public boolean hasSMSAccess() {
		String permission = Manifest.permission.RECEIVE_SMS;
		int res = activity.getApplicationContext().checkCallingOrSelfPermission(permission);
		return (res == PackageManager.PERMISSION_GRANTED);
	}


	public void requestSMSReadPermission() {
		int GET_MY_PERMISSION = 1;
		if (!hasSMSAccess()) {
			if (ActivityCompat.shouldShowRequestPermissionRationale(activity,
					Manifest.permission.RECEIVE_SMS)) {
		/* do nothing*/
			} else {
				ActivityCompat.requestPermissions(activity,
						new String[]{Manifest.permission.READ_SMS, Manifest.permission.RECEIVE_SMS}, GET_MY_PERMISSION);
			}
		}
	}


    @JavascriptInterface
    public boolean requestSMS() {
	    requestSMSReadPermission();
		smsReceiver = new SmsReceiver();
		activity.getApplicationContext().registerReceiver(smsReceiver, new IntentFilter("android.provider.Telephony.SMS_RECEIVED"));
		hasSmsReceiverRegistered = true;
		return true;
	}

	@JavascriptInterface
	public boolean smsReceiverRunning() {
		return hasSmsReceiverRegistered;
	}

	@JavascriptInterface
	public void stopSMSReceiver() {
		activity.getApplicationContext().unregisterReceiver(smsReceiver);
		hasSmsReceiverRegistered = false;
		smsReceiver = null;
	}



}
