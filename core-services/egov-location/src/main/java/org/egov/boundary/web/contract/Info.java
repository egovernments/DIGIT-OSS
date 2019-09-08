package org.egov.boundary.web.contract;

import org.joda.time.DateTime;

public class Info {

	private String api_id = null;

	private String ver = null;

	private DateTime ts = null;

	private String key = null;

	public String getApi_id() {
		return api_id;
	}

	public void setApi_id(String api_id) {
		this.api_id = api_id;
	}

	public String getVer() {
		return ver;
	}

	public void setVer(String ver) {
		this.ver = ver;
	}

	public DateTime getTs() {
		return ts;
	}

	public void setTs(DateTime ts) {
		this.ts = ts;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
