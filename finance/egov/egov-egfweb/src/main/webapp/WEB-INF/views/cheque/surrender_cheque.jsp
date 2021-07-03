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


<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ include file="/includes/taglibs.jsp"%>
<%@ taglib uri="/WEB-INF/tags/cdn.tld" prefix="cdn"%>
<style>
.table thead:first-child>tr:first-child th {
    border-bottom: none;
    background: #f8f8f8;
    color: #767676;
    font-weight: bold;
    background-color: #f2851f;
    color: white;
}
</style>

<form:form role="form" modelAttribute="chequeReportModel"
	id="coaSearchResultForm"
	cssClass="form-horizontal form-groups-bordered"
	enctype="multipart/form-data">
	<div class="main-content">
		<div class="row">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-heading">
						<div class="subheadnew"  style="text-align: center"><spring:message text="Surrendered Cheque Report" code="lbl.surrender.cheque.report"/></div>
					</div>
					<div class="panel-body">
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.fund" text="Fund"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="fundId" path=""
									data-first-option="false" id="fund"
									cssClass="form-control" onchange="loadBankBranch()">
									<form:option value="0">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${fundList}" var="fd">
										<option value="${fd.id}">${fd.name}</option>
									</c:forEach>
								</form:select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.bank.branch"  text="Bank Branch"/></label>
							<div class="col-sm-3 add-margin">
								<form:select name="bankBranch" path=""
									data-first-option="false" id="bankBranch"
									cssClass="form-control" onchange="loadBankAccount()">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${bankBranchList}" var="bankBranch">
										<option value="${bankBranch.key}">${bankBranch.value}</option>
									</c:forEach>
								</form:select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.bankAccount" text="Bank Account" />:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="bankAccountId" path=""
									data-first-option="false" id="bankAccountId"
									cssClass="form-control">
									<form:option value="0">
										<spring:message code="lbls.select" />
									</form:option>
								</form:select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.reason.for.surrender" text="Reason For Surrender" />:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="surrenderReason" path=""
									data-first-option="false" id="surrenderReason"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${surrendarReasonMap}" var="surrReason">
										<option value="${surrReason.key}">${surrReason.value}</option>
									</c:forEach>
									<form:hidden path="" id="surrenderReadon" value="" />
								</form:select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.fromDate"  text="From Date"/> <span class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">
								<form:input path="fromDate" id="fromDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off" data-inputmask="'mask': 'd/m/y'"  placeholder="DD/MM/YYYY"/>
								<form:errors path="fromDate" cssClass="add-margin error-msg" />
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.toDate"  text="To Date"/> <span class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">
								<form:input id="toDate" path="toDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off" data-inputmask="'mask': 'd/m/y'"  placeholder="DD/MM/YYYY" />
								<form:errors path="toDate" cssClass="add-margin error-msg" />
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
							</div>
						</div>
						<div class="row display-hide error-section text-center"><font color="red">Something Went wrong! Contact to system administrator</font></div>
						<div class="row display-hide report-section">
							<div class="subheadnew col-md-12 table-header text-center" 
								id="surrenderChequeHeading"></div>
							<!-- <div class="alert alert-success" role="alert"></div> -->
							<div class="col-md-12 form-group report-table-container">
								<table class="table table-bordered table-hover multiheadertbl"
									id="resultTable">
									<thead>
										<tr>
											<th><spring:message code="lbl.sr.no" text="Sr. No" /></th>
											<th><spring:message code="lbl.bank.branch"
													text="Bank-Branch" /></th>
											<th><spring:message code="lbl.account.number"
													text="Account number" /></th>
											<th><spring:message code="lbl.cheque.number"
													text="Cheque number" /></th>
											<th><spring:message code="lbl.cheque.date"
													text="Cheque Date" /></th>
											<th><spring:message code="lbl.payto" text="Pay to" /></th>
											<th><spring:message code="lbl.vouchernumber"
													text="Voucher Number" /></th>
											<th><spring:message code="lbl.voucherdate"
													text="Voucher Date" /></th>
											<th><spring:message code="lbl.reason.for.surrender" 
													text="Reason For Surrender" /></th>
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
<%-- <div class="row display-hide report-section">
	<div class="col-md-12 table-header text-left" id="coareportheading"></div>
	<!-- <div class="alert alert-success" role="alert"></div> -->
	<div class="col-md-12 form-group report-table-container">
		<table class="table table-bordered table-hover multiheadertbl"
			id="resultTable">
			<thead>
				<tr>
					<th><spring:message code="lbl.sr.no" text="Sr. No"/></th>
					<th><spring:message code="lbl.bank.branch" text="Bank-Branch"/></th>
					<th><spring:message code="lbl.account.number" text="Account number"/></th>
					<th><spring:message code="lbl.cheque.number" text="Cheque number" /></th>
					<th><spring:message code="lbl.cheque.date" text="Cheque Date" /></th>
					<th><spring:message code="lbl.payTo"  text="Pay to"/></th>
					<th><spring:message code="lbl.voucher.number"  text="Voucher Number"/></th>
					<th><spring:message code="lbl.voucher.date"  text="Voucher Date"/></th>
					<th><spring:message code="lbl.surrender.reason" text="Surrender reason" /></th>
				</tr>
			</thead>
		</table>
	</div>
</div> --%>
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
	src="<cdn:url value='/resources/app/js/cheque/surrender_cheque.js?rnd=${app_release_no}'/>"></script>
