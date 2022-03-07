package org.egov.utils;

public class JsonPathConstant {
	
	public static final String signOutAccessToken = "$.request.access_token";
	public static final String request = "$.request";
	public static final String userInfo = "$.request.RequestInfo.userInfo";
	public static final String requestInfo = "$.request.RequestInfo";
	public static final String accessTokenKey = "authToken";
	public static final String signOutUri = "/user/_logout";
	public static final String signOutUriJsonPath = "$.sourceUri";

}
