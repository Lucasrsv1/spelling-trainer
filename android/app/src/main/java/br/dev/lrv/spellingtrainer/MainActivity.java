package br.dev.lrv.spellingtrainer;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	protected void onCreate (Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		handleIncomingIntent(getIntent());

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
			Window window = getWindow();
			window.setNavigationBarColor(Color.parseColor("#020202"));
		}
	}

	@Override
	protected void onNewIntent (Intent intent) {
		super.onNewIntent(intent);
		handleIncomingIntent(intent);
	}

	private void handleIncomingIntent (Intent intent) {
		if (Intent.ACTION_VIEW.equals(intent.getAction()) && intent.getData() != null) {
			String uri = intent.getData().toString();

			// Pass the URI to JavaScript
			final String jsCode = "window.dispatchEvent(new CustomEvent('file-opened', { detail: '" + escapeJsString(uri) + "' }));";

			this.bridge.getWebView().post(() -> {
				this.bridge.getWebView().evaluateJavascript(jsCode, null);
			});
		}
	}

	// Escape special characters in the URI for safe injection into JS
	private String escapeJsString (String input) {
		if (input == null) return "";

		return input.replace("\\", "\\\\")
					.replace("'", "\\'")
					.replace("\"", "\\\"")
					.replace("\n", "\\n")
					.replace("\r", "\\r");
	}
}
