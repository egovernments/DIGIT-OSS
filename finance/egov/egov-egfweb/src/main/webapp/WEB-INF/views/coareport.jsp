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
}
</style>

<form:form role="form" modelAttribute="chartOfAccountsReport"
	id="coaSearchResultForm"
	cssClass="form-horizontal form-groups-bordered"
	enctype="multipart/form-data">
	<div class="main-content">
		<div class="row">
			<div class="col-md-12">
				<div class="panel panel-primary" data-collapsed="0">
					<div class="panel-heading">
						<div class="panel-title"><spring:message code="lbl.chart.of.account.report" text="Chart Of Account Report"/> </div>
					</div>
					<div class="panel-body">

						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.majorcode" text="Major Code"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="majorCodeId" path=""
									data-first-option="false" id="majorCode"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" />
									</form:option>
									<c:forEach items="${majorCodeList}" var="mc">
										<option value="${mc.id}">${mc.glcode}----${mc.name}</option>
									</c:forEach>
								</form:select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.minorcode" text="Minor code"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="minorCodeId" path=""
									data-first-option="false" id="minorCode"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" text="Select"/>
									</form:option>
									<c:forEach items="${minCodeList}" var="mn">
										<option value="${mn.id}">${mn.glcode}----${mn.name}</option>
									</c:forEach>
									<form:hidden path="" id="minorCode" value="" />
								</form:select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.accountcode" text="Account Code"/> :</label>
							<div class="col-sm-3 add-margin">
								<form:input id="accountCode" type="text" class="form-control "
									autocomplete="off" path="" name="accountCode" value=""
									placeholder="" />
								<input type="hidden" id="accountCodeId" value="" />

							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.purpose" text="Purpose"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="purposeId" path="" data-first-option="false"
									id="purposeId" cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" text="Select"/>
									</form:option>
									<form:options items="${purposeList}" itemValue="id"
										itemLabel="name" />
								</form:select>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-3 control-label"><spring:message
									code="lbl.type" text="Type"/>:</label>
							<div class="col-sm-3 add-margin">
								<select name="type" id="type" class="form-control mandatory">
									<option value="">
										<spring:message code="lbl.select" text="Select"/>
									</option>
									<option value="I"><spring:message code="value.income" text="Income"/></option>
									<option value="E"><spring:message code="value.expense" text="Expense"/></option>
									<option value="L"><spring:message
											code="value.liability" text="Liability"/></option>
									<option value="A"><spring:message code="value.asset" text="Asset"/></option>
								</select>
							</div>
							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.accountdetailtype" text="Account detail type"/>:</label>
							<div class="col-sm-3 add-margin">
								<form:select name="detailTypeId" path=""
									data-first-option="false" id="detailTypeId"
									cssClass="form-control">
									<form:option value="">
										<spring:message code="lbls.select" text="Select"/>
									</form:option>
									<form:options items="${accountDetailTypeList}" itemValue="id"
										itemLabel="name" />
								</form:select>
							</div>

						</div>


						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.isActiveForPosting" text="Active for Posting"/>:</label>
							<div class="col-sm-3 add-margin">
								<select name="isActiveForPosting" id="active"
									class="form-control mandatory">
									<option value="">
										<spring:message code="lbl.select" text="Select"/>
									</option>
									<option value="true"><spring:message code="lbl.yes" text="Yes"/></option>
									<option value="false"><spring:message code="lbl.no" text="No"/></:option>
									<option value=""><spring:message code="lbl.all" text="All"/></:option>
									</select>
							</div>

							<label class="col-sm-2 control-label text-right"><spring:message
									code="lbl.functionRequired" text="Function Required"/>:</label>
							<div class="col-sm-3 add-margin">
								<select name="functionReqd" id="functionReqd"
									Class="form-control">
									<option value="">
										<spring:message code="lbl.select" text="Select"/>
									</option>
									<option value="true"><spring:message code="lbl.yes" text="Yes"/>
										</:option>
									
									<option value="false"><spring:message code="lbl.no" text="No"/>
										</:option>
									
									<option value=""><spring:message code="lbl.all" text="All"/>
										</:option>
								
								</select>

							</div>
						</div>

						<div class="form-group">
							<label class="col-sm-3 control-label text-right"><spring:message
									code="lbl.budgetRequired" text="Budget Required"/>:</label>
							<div class="col-sm-3 add-margin">
								<select name="budgetCheckReq" id="budgetCheckReq"
									Class="form-control">
									<option value="">
										<spring:message code="lbl.select" text="Select"/>
									</option>
									<option value="true"><spring:message code="lbl.yes" text="Yes"/>
										</:option>
									
									<option value="false"><spring:message code="lbl.no" text="No"/>
										</:option>
									
									<option value=""><spring:message code="lbl.all" text="All"/>
										</:option>
								
								</select>
							</div>
						</div>


						<div class="form-group">
							<div class="text-center">
								<button type='button' class='btn btn-primary' id="btnsearch">
									<spring:message code='lbl.search'/>
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
<div class="row display-hide report-section">
	<div class="col-md-12 table-header text-left" id="coareportheading"></div>
	<!-- <div class="alert alert-success" role="alert"></div> -->
	<div class="col-md-12 form-group report-table-container">
		<table class="table table-bordered table-hover multiheadertbl"
			id="resultTable">
			<thead>
				<tr>
					<th><spring:message code="lbl.majorcodename" text="Major Code-Name"/></th>
					<th><spring:message code="lbl.minorcodename" text="Minor Code-Name"/></th>
					<th><spring:message code="lbl.accountcode" text="Account Code"/></th>
					<th><spring:message code="lbl.accountname" text="Account Name"/></th>
					<th><spring:message code="lbl.type" text="Type"/></th>
					<th><spring:message code="lbl.purpose" text="Purpose"/></th>
					<th><spring:message code="lbl.accountdetailtype" text="Account detail type"/></th>
					<th><spring:message code="lbl.isActiveForPosting" text="Active for Posting"/></th>
				</tr>
			</thead>
		</table>
	</div>
</div>
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
	src="<cdn:url value='/resources/app/js/coareport.js?rnd=${app_release_no}'/>"></script>
<script type="text/javascript"
        src="<cdn:url value='/resources/app/js/i18n/jquery.i18n.properties.js?rnd=${app_release_no}' context='/services/EGF'/>"></script>
