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
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="/includes/taglibs.jsp"%>
<%@ taglib uri="/WEB-INF/tags/cdn.tld" prefix="cdn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><spring:message code="title.remittance.pending.search.form"/> </title>
<style>
.table thead:first-child>tr:first-child th {
    border-bottom: none;
    background: #f8f8f8;
    color: #767676;
    font-weight: bold;
    background-color: #f2851f;
    color: white;
}

div.dataTables_wrapper div.dataTables_filter {
    text-align: right;
    margin-bottom: -24px;
}
</style>
<script type="text/javascript">
var fromDateMandetoryAlertMsg = '<spring:message code="msg.please.select.from.date"/>';
var toDateMandetoryAlertMsg = '<spring:message code="msg.please.select.to.date"/>';
var fromDateToDateAlertMsg = '<spring:message code="msg.fromDate.must.be.lower.than.toDate"/>';
</script>
</head>
<body>
<form:form role="form" modelAttribute="remittanceReportModel"
	id="remittancePendingReportForm"
	cssClass="form-horizontal form-groups-bordered"
	enctype="multipart/form-data">
	<div class="main-content">
		<div class="row">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-body">
					<div class="row form-section pending-remittance-search-form">
					<div class="panel-heading">
						<div class="subheadnew"  style="text-align: center"><spring:message code="lbl.remittance.pending.report" /></div>
					</div>
					<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.fromDate"/>:<span class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">
								<form:input path="fromDate" id="fromDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off" data-inputmask="'mask': 'd/m/y'"  placeholder="DD/MM/YYYY"/>
								<form:errors path="fromDate" cssClass="add-margin error-msg" />
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.toDate"/>:<span class="mandatory"></span></label>
							<div class="col-sm-3 add-margin">
								<form:input id="toDate" path="toDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off" data-inputmask="'mask': 'd/m/y'"  placeholder="DD/MM/YYYY" />
								<form:errors path="toDate" cssClass="add-margin error-msg" />
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.service"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="service" path=""
									data-first-option="false" id="serviceId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${businessServices}" var="bs">
										<c:set var="service" value="${bs.businessService}" />
										<c:set var="split" value="${fn:split(service, '.')}" />
										<c:set var="str3" value="${fn:join(split, ' - ')}" />
										<option value="${bs.code}">${str3}</option>
									</c:forEach>
								</form:select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.payment.type"/>:</span></label>
							<div class="col-sm-3 add-margin">
								<form:select name="instrumentType" path=""
									data-first-option="false" id="instrumentTypeId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${instrumentTypes }" var="insType">
										<option value="${insType.key}">${insType.value}</option>
									</c:forEach>
								</form:select>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.user.id"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="createdBy" path=""
									data-first-option="false" id="userId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${userList}" var="ul">
										<option value="${ul.id}">${ul.user.name}</option>
									</c:forEach>
								</form:select>
							</div>
						</div>
					
						<div class="form-group">
							<div class="text-center">
								<button type='button' class='btn btn-primary' id="btnsearch">
									<spring:message code='lbl.search' />
								</button>
								<a href='javascript:void(0)' class='btn btn-default'
									onclick="javascript:window.parent.postMessage('close','*');"><spring:message
										code='lbl.close' /></a>
								<a href='javascript:void(0)' class='btn btn-default'
									onclick="" id="resetFormId"><spring:message
										code='lbl.reset' /></a>
							</div>
						</div>
						</div>
						<div class="row display-hide error-section text-center"><font color="red"><spring:message code="msg.soemthing.went.wrong.contact.to.system.admin"/> </font></div>
						<div class="row display-hide pending-remittance-report-section">
							<div class="subheadnew col-md-12 table-header text-center" 
								id="pendingRemittanceReportHeading"></div>
							<!-- <div class="alert alert-success" role="alert"></div> -->
							<div class="col-md-12 form-group report-table-container">
								<table class="table table-bordered table-hover multiheadertbl"
									id="resultTable" style="width: 100%;table-layout: fixed;">
									<thead>
										<tr>
											<th><spring:message code="lbl.sr.no"/></th>
											<th><spring:message code="lbl.receipt.date" /></th>
											<th><spring:message code="lbl.transaction.mode" /></th>
											<th><spring:message code="lbl.service.name"/></th>
											<th><spring:message code="lbl.total.count"/></th>
											<th><spring:message code="lbl.total.amount"/></th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
						
						<div class="row display-hide pending-remittance-report-details-section">
							<div class="subheadnew col-md-12 table-header text-center" 
								id="selectedRemittanceReportHeading"></div>
							<!-- <div class="alert alert-success" role="alert"></div> -->
							<div class="col-md-12 form-group report-table-container">
								<table class="table table-bordered table-hover multiheadertbl"
									id="pendingDetaisResultTable" style="width: 100%;table-layout: fixed;">
									<thead>
										<tr>
											<th><spring:message code="lbl.sr.no" /></th>
											<th><spring:message code="lbl.receipt.number"/></th>
											<th><spring:message code="lbl.receipt.date"/></th>
											<th><spring:message code="lbl.cheque.dd.number"/></th>
											<th><spring:message code="lbl.ifsc.code"/></th>
											<th><spring:message code="lbl.bank.branch"/></th>
											<th><spring:message code="lbl.service.name"/></th>
											<th><spring:message code="lbl.department"/></th>
											<th><spring:message code="lbl.total.amount"/></th>
											<th><spring:message code="lbl.user.id"/></th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</form:form>
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/jquery.dataTables.min.css' context='/services/egi'/>" />
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/dataTables.bootstrap.min.css' context='/services/egi'/>">
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/buttons.bootstrap.min.css' context='/services/egi'/>">
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/jquery.dataTables.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/dataTables.bootstrap.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/dataTables.buttons.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/buttons.bootstrap.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/buttons.flash.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/jszip.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/pdfmake.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/vfs_fonts.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/buttons.html5.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/extensions/buttons/buttons.print.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/jquery.validate.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/app/js/remittance/remittance_pending.js?rnd=${app_release_no}'/>"></script>

</body>
</html>