package org.egovernment.mseva;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.Manifest;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;

import static android.content.ContentValues.TAG;

/**
 * Created by varun on 09/04/18.
 */

public class AppJavaScriptProxy  {
	private Activity activity = null;

	public AppJavaScriptProxy(MainActivity activity) {
		this.activity = activity;
	}

	@JavascriptInterface
	public boolean isMsewaApp() {
		return true;
	}

	private NotificationManager nm;

	private void createFileDownloadedNotification(File file, String contentType) {
		final int notificationId = 1;
		Context context = this.activity.getApplicationContext();

		Intent notifyIntent = new Intent(Intent.ACTION_VIEW);
		Uri apkURI;

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			apkURI = FileProvider.getUriForFile(
				context,
				context.getApplicationContext()
					.getPackageName() + ".provider", file);
		} else {
			apkURI = Uri.fromFile(file);
		}
		notifyIntent.setDataAndType(apkURI, contentType);

		notifyIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP |
			Intent.FLAG_ACTIVITY_SINGLE_TOP |
			Intent.FLAG_ACTIVITY_NEW_TASK |
			Intent.FLAG_GRANT_READ_URI_PERMISSION);


		PendingIntent p = PendingIntent.getActivity(this.activity, 0, notifyIntent, 0);


		NotificationCompat.Builder b = new NotificationCompat
			.Builder(context, "mSewa_App")
			.setContentIntent(p)
			.setContentTitle("File Downloaded")
			.setSmallIcon(R.drawable.ic_notification)
			.setLargeIcon(BitmapFactory.decodeResource(this.activity.getApplicationContext().getResources(),
				R.mipmap.ic_launcher))
			.setContentText(file.getName());


		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
			if (ContextCompat.checkSelfPermission(this.activity, Manifest.permission.READ_EXTERNAL_STORAGE)
				== PackageManager.PERMISSION_GRANTED) {
				Log.v(TAG, "Permission is granted");
			} else {
				ActivityCompat.requestPermissions(this.activity, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE}, 225);
			}

		}

		nm = (NotificationManager) this.activity.getSystemService(Context.NOTIFICATION_SERVICE);

		if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
			NotificationChannel mChannel = new NotificationChannel("mSewa_App", "mSewa", NotificationManager.IMPORTANCE_HIGH);
			nm.createNotificationChannel(mChannel);
		}


		if (nm != null) {
			nm.notify(notificationId, b.build());
		}

		Toast.makeText(this.activity, "The file has been downloaded to - " + file.getPath(), Toast.LENGTH_LONG).show();
	}

	@JavascriptInterface
	public void downloadBase64File(String base64Data, String filename) throws IOException {
		filename = filename.replace("/", "_");
		MimeTypeMap mime = MimeTypeMap.getSingleton();
		String ext=filename.substring(filename.indexOf(".")+1);
		String contentType = mime.getMimeTypeFromExtension(ext);

//		String currentDateTime = DateFormat.getDateTimeInstance().format(new Date());

		final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
			Environment.DIRECTORY_DOWNLOADS) + "/" + filename);
		byte[] pdfAsBytes = Base64.decode(base64Data.replaceFirst("^data:[^;]+;base64,", ""), 0);
		FileOutputStream os=null;
		try{
			os = new FileOutputStream(dwldsPath, false);
			os.write(pdfAsBytes);
		}catch (Exception e){
			Log.v("Error while creating temp report.");
		}finally {
			os.flush();
			os.close();
		}
		createFileDownloadedNotification(dwldsPath, contentType);
	}

}
