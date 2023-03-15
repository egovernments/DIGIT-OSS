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
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn" %>

<%@ include file="/includes/taglibs.jsp"%>

<style>
.table thead:first-child>tr:first-child th {
    border-bottom: none;
    background: #f8f8f8;
    color: #767676;
    font-weight: bold;
    background-color: #f2851f;
    color: white;
}
.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #fe7a51;
}

.page-container .main-content table th.bluebgheadtd {
    border-right-color: #CCCCCC;
    border-bottom-color: #CCCCCC;
    background-color: #f2851f;
}
</style>
<script>
var instrumentModeMendatoryMessage = "<spring:message code='msg.please.select.instrument.mode'/>";
var chequeDDNumberMendatoryMessage = "<spring:message code='msg.please.enter.cheque.dd.number'/>";
var chequeDDLimitMessage = "<spring:message code='msg.cheque.dd.number.must.be.six.digit'/>";
var chequeDDDateMendatoryMessage = "<spring:message code='msg.please.select.cheque.dd.date'/>";
</script>

<form:form role="form" modelAttribute="dishonoredChequeModel"
	id="dishonorChequeForm"
	cssClass="form-horizontal form-groups-bordered" action="/services/collection/dishonour/cheque/submit"
	enctype="multipart/form-data" >
	<div class="main-content">
		<div class="row" id="dishonor-cheque-search">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-heading">
						<div class="subheadnew" style="text-align: center">
							<spring:message code="title.dishonor.cheque.dd" />
						<div style="text-align: center;color: red;">${errorMessage }</div>
						</div>
					</div>
					<div class="panel-body">
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.bank.branch"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="bankBranch" path="" data-first-option="false"
									id="bankBranch" cssClass="form-control"
									onchange="loadBankAccount()">
									<form:option value="">
										<spring:message code="lbls.select" text="Select" />
									</form:option>
									<c:forEach items="${bankBranchList}" var="bankBranch">
										<option value="${bankBranch.bank.id}-${bankBranch.id}">${bankBranch.bank.name}
											- ${bankBranch.branchname}</option>
									</c:forEach>
								</form:select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.bank.account"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="accountNumber" path=""
									data-first-option="false" id="bankAccountId"
									cssClass="form-control">
									<form:option value="0">
										<spring:message code="lbls.select" text="Select" />
									</form:option>
								</form:select>
							</div>

						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.instrument.mode"/> <span
								class="mandatory"></span>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="instrumentMode" path="instrumentMode"
									data-first-option="false" id="instrumentModeId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" text="Select" />
									</form:option>
									<c:forEach items="${instrumentModesMap}" var="instrMap">
										<option value="${instrMap.key}">${instrMap.value}</option>
									</c:forEach>
								</form:select>
							</div>

						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.cheque.dd.number" /> <span
								class="mandatory"></span>:</label>
							<div class="col-sm-3 add-margin">
								<form:input path="instrumentNumber" id="instrumentNumberId"
									class="form-control" required="required" autocomplete="off"
									maxlength="6" onkeyup="decimalvalue(this);" />
								<form:errors path="instrumentNumber"
									cssClass="add-margin error-msg" />
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.cheque.dd.date"/> <span
								class="mandatory"></span>:</label>
							<div class="col-sm-3 add-margin">
								<form:input id="instrumentDateId" path="transactionDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off"
									data-inputmask="'mask': 'd/m/y'" placeholder="DD/MM/YYYY" />
								<form:errors path="instrumentDate"
									cssClass="add-margin error-msg" />
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
						<div class="row display-hide error-section text-center">
							<font color="red">Something Went wrong! Contact to system
								administrator</font>
						</div>
						<div class="row display-hide report-section">
							<div class="subheadnew col-md-12 table-header text-center"
								id="surrenderChequeHeading"></div>
							<!-- <div class="alert alert-success" role="alert"></div> -->
							<div class="col-md-12 form-group report-table-container">
								<table class="table table-bordered table-hover multiheadertbl"
									id="resultTable">
									<thead>
										<tr>
											<th><spring:message code="lbl.receipt.no"/></th>
											<th><spring:message code="lbl.receipt.date"/></th>
											<th><spring:message code="lbl.voucher.number"/></th>
											<th><spring:message code="lbl.cheque.dd.date"/></th>
											<th><spring:message code="lbl.cheque.dd.number"/></th>
											<th><spring:message code="lbl.cheque.dd.amount"/></th>
											<th><spring:message code="lbl.bank.name"/></th>
											<th><spring:message code="lbl.bank.account.number"/></th>
										</tr>
									</thead>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row" id="selected-dishonor-cheque-details"
			style="display: none">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-heading">
						<div class="subheadnew" style="text-align: center" id="dishonorDetailLabelId">
							<spring:message code="lbl.dishonor.cheque.dd.details" />
						</div>
					</div>
					<div class="panel-body">
						<div class="col-sm-12 form-group report-table-container"
							id="selectedInstrumentTableDiv"></div>
						<form:hidden path="instHeaderIds" id="selectedInstrumentId"/>
						<form:hidden path="voucherHeaderId" id="selectedVoucherHeaderId"/>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.transaction.date" /> <span
								class="mandatory"></span> </label>
							<div class="col-sm-3 add-margin">
								<form:input id="dishonorDateId" path="dishonorDate"
									class="form-control datepicker" data-date-end-date="0d"
									required="required" autocomplete="off"
									data-inputmask="'mask': 'd/m/y'" placeholder="DD/MM/YYYY" />
								<form:errors path="dishonorDate"
									cssClass="add-margin error-msg" />
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.remarks" /> <span
								class="mandatory"></span>:</label>
							<div class="col-sm-3 add-margin">
								<form:textarea path="remarks" id="remarks" class="form-control" maxlength="1024" ></form:textarea>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.dishonor.reason" /> <span
								class="mandatory"></span> </label>
							<div class="col-sm-5 add-margin">
								<form:select name="dishonorReason" path=""
									data-first-option="false" id="dishonorReasonId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" text="Select" />
									</form:option>
									<c:forEach items="${dishonorReasonsList}" var="reason">
										<option value="${reason}">${reason}</option>
									</c:forEach>
								</form:select>
							</div>
						</div>
						<hr/>

						<div class=" formmainbox">
							<div class="col-sm-6">
								<div class="subheadnew" style="text-align: center">
									<spring:message code="lbl.original.entry" />
								</div>
								<table width="90%" border="1" align="center" cellpadding="0"
									cellspacing="0" class="tablebottom" id="originalEnrtyTableId">
									<tr>
										<th class="bluebgheadtd"><spring:message code="lbl.account.code"/> </th>
										<th class="bluebgheadtd"><spring:message code="lbl.description" /></th>
										<th class="bluebgheadtd"><spring:message code="lbl.debit.amount" /></th>
										<th class="bluebgheadtd"><spring:message code="lbl.credit.amount" /></th>
									</tr>
								</table>
							</div>
							<div class="col-sm-6">
							<div class="subheadnew" style="text-align: center">
									<spring:message code="lbl.reversal.entry" />
								</div>
								<table width="90%" border="1" align="center" cellpadding="0"
									cellspacing="0" class="tablebottom" id="reversalEnrtyTableId">
									<tr>
										<th class="bluebgheadtd"><spring:message code="lbl.account.code"/> </th>
										<th class="bluebgheadtd"><spring:message code="lbl.description" /></th>
										<th class="bluebgheadtd"><spring:message code="lbl.debit.amount" /></th>
										<th class="bluebgheadtd"><spring:message code="lbl.credit.amount" /></th>
									</tr>
								</table>
							</div>
						</div>
						<br/>
						<br/>
						
						<div class="form-group">
							<div class="text-center">
								<button type='button' class='btn btn-default' id="btnback"
									onclick="goBackToDishonorChequeSearch();">
									<spring:message code='lbl.back' />
								</button>
								<button type='button' class='btn btn-primary' id="dishonorChequeSubmitButtonId">
									<spring:message code='lbl.process' />
								</button>
								<a href='javascript:void(0)' class='btn btn-default'
									onclick="javascript:window.parent.postMessage('close','*');"><spring:message
										code='lbl.close' /></a>
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
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/dataTables.select.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js'/>"></script>
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
	src="<cdn:url value='/resources/js/dishonour_cheque.js?rnd=${app_release_no}'/>"></script>
