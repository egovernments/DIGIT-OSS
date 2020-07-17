
<%--
  ~    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
  ~    accountability and the service delivery of the government  organizations.
  ~
  ~     Copyright (C) 2017  eGovernments Foundation
  ~
  ~     The updated version of eGov suite of products as by eGovernments Foundation
  ~     is available at http://www.egovernments.org
  ~
  ~     This program is free software: you can redistribute it and/or modify
  ~     it under the terms of the GNU General Public License as published by
  ~     the Free Software Foundation, either version 3 of the License, or
  ~     any later version.
  ~
  ~     This program is distributed in the hope that it will be useful,
  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~     GNU General Public License for more details.
  ~
  ~     You should have received a copy of the GNU General Public License
  ~     along with this program. If not, see http://www.gnu.org/licenses/ or
  ~     http://www.gnu.org/licenses/gpl.html .
  ~
  ~     In addition to the terms of the GPL license to be adhered to in using this
  ~     program, the following additional terms are to be complied with:
  ~
  ~         1) All versions of this program, verbatim or modified must carry this
  ~            Legal Notice.
  ~            Further, all user interfaces, including but not limited to citizen facing interfaces,
  ~            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
  ~            derived works should carry eGovernments Foundation logo on the top right corner.
  ~
  ~            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
  ~            For any further queries on attribution, including queries on brand guidelines,
  ~            please contact contact@egovernments.org
  ~
  ~         2) Any misrepresentation of the origin of the material is prohibited. It
  ~            is required that all modified versions of this material be marked in
  ~            reasonable ways as different from the original version.
  ~
  ~         3) This license does not grant any rights to any user of the program
  ~            with regards to rights under trademark law for use of the trade names
  ~            or trademarks of eGovernments Foundation.
  ~
  ~   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
  ~
  --%>

<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@page import="org.egov.infra.config.core.ApplicationThreadLocals"%>
<%
    String ipAddress = request.getRemoteAddr();
			String proxiedIPAddress = request.getHeader("X-Forwarded-For");
			if (StringUtils.isNotBlank(proxiedIPAddress)) {
				String[] ipAddresses = proxiedIPAddress.split(",");
				ipAddress = ipAddresses[ipAddresses.length - 1].trim();
			}
	String userAgentInfo = request.getHeader("User-Agent");
	String tenantId = ApplicationThreadLocals.getTenantID();
%>
<!DOCTYPE html>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="description" content="eGov Urban Portal" />
<meta name="author" content="eGovernments Foundation" />
<title>eGov Urban Portal Login</title>
<link rel="icon"
	href="<cdn:url value='/resources/global/images/favicon.png'/>"
	sizes="32x32">
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/egov/customloginNew.css?rnd=${app_release_no}'/>">
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/bootstrap/bootstrap.css'/>">
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/font-icons/font-awesome/css/font-awesome.min.css'/>">
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/egov/customlogin.css?rnd=${app_release_no}'/>">
<script src="<cdn:url value='/resources/global/js/jquery/jquery.js'/>"
	type="text/javascript"></script>

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
			<script src="<cdn:url value='/resources/global/js/ie8/html5shiv.min.js'/>"></script>
			<script src="<cdn:url value='/resources/global/js/ie8/respond.min.js'/>"></script>
		<![endif]-->
</head>
<body class="page-body index"
	style="height: 580px; background: #F8F9F9;">
	<div class="page-container">
		<div class="padding0 login-main-content">
			<div class = "padding0 login-cont">
				<div class = "login-bg-cont clearfix">
					<div class = "blue-background"></div>
					<div class = "login-content-wrapper page-common-padding col-md-12">
						<div class = "new-login-header padding0 col-md-12">
							<span class="f-medium login-title-1 bold color-white">${sessionScope.citymunicipalityname}</span>
							<a href="http://www.egovernments.org" data-strwindname="egovsite"
								class="open-popup"> 
								<img src="<cdn:url value='/resources/global/images/digit-logo-white.png'/>"
									title="Powered by eGovernments" width = "100" alt="" />
							</a>
						</div>
						<c:set var="tenantId" value="<%=tenantId%>" />
						<div class = "new-login-content padding0 col-md-12">
							<div class = "login-left-cont padding0 col-md-6">
								<span class = "f-light login-title-2 color-white">Building Plan Approvals Made <span class = "f-medium">Easy</span></span>
								<div class = "login-action-cont padding0 f-regular">
									<%-- <a class = "login-create-link padding0 col-md-6" href="#"
										onclick="window.open('/portal/citizen/signup','CTZ',config='height=800, width=1100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no')">
										<div class = "create-button col-md-18">
											<spring:message code="lbl.create.ac.citizen" />
										</div>
									</a> --%>
									<%-- <a class = "login-create-link padding0 col-md-6" href="#"
										onclick="window.open('/bpa/stakeholder/payregfee','BL',config='height=800, width=1100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no')">
										<div class = "create-button col-md-12">
											<spring:message code="lbl.stakeholder.reg.fee.pay" />
										</div>
									</a> --%>
									<c:if test="${tenantId == 'state' }">
									   <a class = "login-create-link padding0 col-md-6" href="#"
											onclick="window.open('/bpa/stakeholder/createbycitizen','BL',config='height=800, width=1100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no')">
											<div class = "create-button col-md-12">
												<spring:message code="lbl.bldng.create.ac" />
											</div>
										</a>
									</c:if>
								</div>
								
								<c:if test="${tenantId == 'state' }">
									<div class = "application-action-cont">
										<div class="application-card bpa-card-new card">
										  <div class="card-body">
										    <div class="md-form clearfix">
											    <div class = "f-regular padding0 col-md-8">
											    	<label class = "login-input-label" for="inputPlaceholderEx">
											    		<spring:message code="lbl.stakeholder.reg.fee.pay" />
											    	</label>
													<input id="stkhldrregfeetxt" style="font-family: Roboto_Regular;" placeholder="Enter Acknowledgement No." type="text" id="inputPlaceholderEx" class="login-input form-control">
											    </div>
											    <div class = "col-md-4">
											    	<button id="stkhldrregfeesearch" style = "width: 170px;" type="button" class="f-medium btn-login-new btn">
											    		<spring:message code="btn.lbl.search" />
											    	</button>
											    </div>
											</div>
											<div class="f-regular error-msg search-stkhldr-error-msg display-hide">Acknowledgement number is mandatory</div>
										  </div>
										</div>
									</div>
								</c:if>
								<%-- <div class = "application-action-cont">
									<div class="application-card bpa-card-new card">
									  <div class="card-body">
									    <div class="md-form clearfix">
										    <div class = "f-regular padding0 col-md-8">
										    	<label class = "login-input-label" for="inputPlaceholderEx">
										    		<spring:message code="lbl.check.application.status" />
										    	</label>
												<input id="appsearchtxt" style="font-family: Roboto_Regular;" placeholder="Enter Application No." type="text" id="inputPlaceholderEx" class="login-input form-control">
										    </div>
										    <div class = "col-md-4">
										    	<button id="appsearch" style = "width: 170px;" type="button" class="f-medium btn-login-new btn">
										    		<spring:message code="btn.lbl.search" />
										    	</button>
										    </div>
										</div>
										<div class="f-regular error-msg search-error-msg display-hide">Application number is mandatory</div>
									  </div>
									</div>
								</div> --%>
							</div>
							<div class = "f-regular login-right-cont padding0 col-md-6">
								<div class = "application-card bpa-card-new card col-md-8">
									<div class = "card-body">
										<div class = "login-card-header">
											<spring:message code="lbl.login" />
										</div>
										<form action="${pageContext.request.contextPath}/j_security_check" 
											method="post" role="form" id="signform"
											<div class = "md-form clearfix">
												<div class = "col-md-12 padding0" style = "margin: 36px 0 16px 0">
													<label class = "login-input-label" for="j_username">Mobile No. / Login ID</label>
													<input name="j_username" id="j_username" 
														style="font-family: Roboto_Regular;" 
														placeholder="Enter Mobile No. / Login ID" 
														required="" type="text" autofocus="autofocus"
														autocomplete="off" class="login-input form-control" />
												</div>
												<div class = "col-md-12 padding0">
													<label class = "login-input-label" for="j_password">Password</label>
													<input name="j_password" id="j_password" required="required"
														style="font-family: Roboto_Regular;" placeholder="Enter Password" 
														type="password" class="login-input form-control"
														autocomplete="new-password" />
												</div>
												<div class = "col-md-12 forgot-password-text">
													<span data-toggle="modal" data-target="#fpassword" data-backdrop="static">FORGOT PASSWORD?</span>
												</div>
												<div class="col-md-12 form-group display-hide" id="counter-section">
													<div class="input-group">
														<div class="input-group-addon style-label">
															<i class="fa fa-map-marker theme-color style-color"></i>
														</div>
														<select class="form-control style-form" name="locationId"
															id="locationId"></select> <label id="locationId-error"
															class="error pull-right" for="locationId"></label>
													</div>
												</div>
												<c:if test="${param.error}">
													<div class="col-md-12 text-center error-msg add-margin">
														<c:set var="security_message"
															value="${sessionScope.SPRING_SECURITY_LAST_EXCEPTION.message}" />
														<c:choose>
															<c:when
																test="${security_message.contains('Maximum sessions')}">
																<spring:message code="msg.multiple.login" />
															</c:when>
															<c:when test="${security_message.contains('expired')}">
																<spring:message code="msg.cred.exprd1" />
																<a href="javascript:void(0);" data-toggle="modal"
																	data-target="#fpassword" data-backdrop="static"> <spring:message
																		code="msg.cred.exprd2" />
																</a>
																<spring:message code="msg.cred.exprd3" />
															</c:when>
															<c:when
																test="${fn:contains(security_message, 'User account is locked')}">
																<spring:message code="msg.acc.locked" />
																<spring:eval
																	expression="@environment.getProperty('captcha.strength')"
																	var="strength" />
																<c:import url="/WEB-INF/views/common/captcha-${strength}.jsp"
																	context="/egi" />
																<c:if
																	test="${fn:contains(security_message, 'Recaptcha Invalid')}">
																	<spring:message code="err.recaptcha.invalid" />
																</c:if>
															</c:when>
															<c:when
																test="${fn:contains(security_message, 'Too many attempts')}">
																<c:set var="attempts"
																	value="${fn:substringAfter(security_message, 'Too many attempts')}" />
																<spring:message code="msg.acc.toomany.attempt"
																	arguments="${attempts}" />
															</c:when>
															<c:otherwise>
																<div class="form-group">
																	<div>
																		<spring:message code="msg.cred.invalid" />
																	</div>
																</div>
															</c:otherwise>
														</c:choose>
													</div>
												</c:if>
												<c:if test="${not empty param.reset}">
													<div class="form-group">
														<c:choose>
															<c:when test="${param.reset}">
																<div class="text-center success-msg font-12">
																	<spring:message code="msg.success.pwd.reset" />
																</div>
															</c:when>
															<c:otherwise>
																<div class="text-center  error-msg font-12">
																	<spring:message code="msg.fail.pwd.reset" />
																</div>
															</c:otherwise>
														</c:choose>
													</div>
												</c:if>
												<input type="hidden" id="ipAddress" name="ipAddress"
													value="<%=ipAddress%>" /> <input type="hidden" id="loginType"
													name="loginType" /> <input type="hidden" name="userAgentInfo"
													value="<%=userAgentInfo%>" />
												<div class = "col-md-12 padding0" style="padding-bottom: 10px;">
												 	<button style = "margin-top:15px;" id="signin-action" type="submit" class="f-medium col-md-12 btn-login-new btn padding0">
												 		<spring:message code="lbl.login" />
												 	</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class = "padding0 bpa-feature-main-cont col-md-12">
				<div class = "bpa-feature-wrapper">
					<%@include file="../../resources/guide/bpa-features.jsp"%>
				</div>
			</div>
			<div style="margin-bottom: 0px;" class="row top-space">
				<div class="text-center error-msg">
					<noscript>You don't have javascript enabled. Make sure
						Javascript is enabled.</noscript>
				</div>
			</div>
		</div>
	</div>
	
	<div class="f-regular login-modal-new modal fade" id="fpassword" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div style = "border: none;" class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title" id="myModalLabel">
						<spring:message code="lbl.recover.pwd" />
					</h4>
				</div>
				<form method="post" role="form" id="forgotPasswordForm">
					<div style = "border: none;" class="modal-body">
						<div class="form-group">
							<div class="input-group col-md-12" style="margin: 0;">
								<!-- <div class="input-group-addon style-label">
									<i class="fa fa-user style-color"></i>
								</div> -->
								<label class = "login-input-label" for="identity">Mobile Number / Login ID</label>
								<input type="text" class="login-input form-control style-form"
									name="identity" id="emailOrMobileNum" required="required"
									placeholder="Mobile Number / Login ID" autocomplete="off"
									style="font-family: Roboto_Regular;" /> 
								<input type="hidden" name="originURL" id="originURL" /> 
								<input type="hidden" name="byOTP" id="byOtp" style="font-family: Roboto_Regular;" />
							</div>
							<div id="emailOrMobileNoReq"
								class="text-right error-msg display-hide">
								<spring:message code="lbl.pwd.recover.un.req" />
							</div>
							<div class="text-right" style="font-size: 12px; color: #6b4f2c;">
								<spring:message code="lbl.pwd.reset.link" />
							</div>
						</div>
					</div>
					<div style="background-color: transparent; border: none;" class="modal-footer">
						<div class="form-group text-right">
							<button type="button" class="f-medium btn-login-new btn btn-primary recovrbtn">
								<spring:message code="btn.lbl.recover.link" />
							</button>
							<button type="button" id="recoveryotpbtn"
								class="f-medium btn-login-new btn btn-primary recovrbtn">
								<spring:message code="btn.lbl.recover.otp" />
							</button>
							<button type="button" class="f-medium btn-login-new btn btn-default"
								data-dismiss="modal">
								<spring:message code="lbl.close" />
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="f-regular login-modal-new modal fade" id="cookieornoscript" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div style = "border: none;" class="modal-header">
					<h4 class="modal-title">Enable Cookies</h4>
				</div>
				<div class="modal-body">Your browser seems to have cookies
					disabled. Make sure cookies are enabled or try opening a new
					browser window.</div>
			</div>
		</div>
	</div>
	<c:if test="${not empty param.recovered}">
		<div class="f-regular login-modal-new modal fade" data-backdrop="static" id="resetpwd">
			<div class="modal-dialog">
				<div class="modal-content">
					<div style = "border: none;" class="modal-header">
						<h4 class="modal-title">
							<spring:message code="lbl.recover.pwd" />
						</h4>
					</div>
					<form class = "f-regular" method="post" role="form">
						<c:choose>
							<c:when test="${param.recovered}">
								<c:if test="${param.byOTP}">
									<div class="modal-body f-regular">
										<div class="form-group">
											<div class="col-md-12 input-group" style="margin: 0;">
												<!-- <div class="input-group-addon style-label">
													<i class="fa fa-key theme-color style-color"></i>
												</div> -->
												<label class = "login-input-label" for="token">New Password</label>
												<input style="display: none" type="password"> <input
													type="password" class="login-input form-control style-form"
													name="token" id="token" placeholder="Enter your OTP"
													autocomplete="new-password" required="required"
													style="font-family: Roboto_Regular;"  /> 
													<span class="mandatory set-mandatory"></span>
											</div>
											<div class="text-right font-12">OTP sent to your
												registered mobile / email
											</div>
										</div>
									</div>
									<div style = "background-color: transparent; border: none;" class="modal-footer">
										<button type="button"
											class="f-medium btn-login-new btn btn-custom recovrbtn text-right"
											id="otprecoverybtn">
											<spring:message code="title.reset.password" />
										</button>
									</div>
								</c:if>
								<c:if test="${not param.byOTP}">
									<div class="modal-body f-regular">
										<div class="text-center font-12">
											<spring:message
												code="msg.success.pwd.recov.otp.${param.byOTP}" />
										</div>
									</div>
									<div style = "background-color: transparent; border: none;" class="modal-footer">
										<button type="button" class="f-medium btn-login-new btn btn-default text-right"
											data-dismiss="modal">Close</button>
									</div>
								</c:if>
							</c:when>
							<c:otherwise>
								<div class="modal-body f-regular ">
									<div class="text-center error-msg">
										<spring:message code="msg.fail.pwd.recov" />
									</div>
								</div>
								<div style = "background-color: transparent; border: none;" class="modal-footer">
									<button type="button" class="f-medium btn-login-new btn btn-default text-right"
										data-dismiss="modal">Close</button>
								</div>
							</c:otherwise>
						</c:choose>
					</form>
				</div>
			</div>
		</div>
		<script>
			$(document).ready(function() {
				$('#resetpwd').modal('show', {
					backdrop : 'static'
				});
			});
		</script>
	</c:if>

	<script
		src="<cdn:url value='/resources/global/js/bootstrap/bootstrap.js'/>"
		type="text/javascript"></script>
	<script
		src="<cdn:url value='/resources/global/js/egov/custom.js?rnd=${app_release_no}'/>"
		type="text/javascript"></script>
	<script
		src="<cdn:url value='/resources/global/js/jquery/plugins/jquery.validate.min.js'/>"></script>
	<script
		src="<cdn:url value='/resources/js/app/login.js?rnd=${app_release_no}'/>"
		type="text/javascript"></script>
</body>
</html>