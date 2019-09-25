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
<%@ taglib uri="/WEB-INF/tags/cdn.tld" prefix="cdn" %>
<form:form role="form"  modelAttribute="chartOfAccountsReport" id="coaSearchResultForm"
  cssClass="form-horizontal form-groups-bordered" enctype="multipart/form-data">
  <div class="main-content">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary" data-collapsed="0">
          <div class="panel-heading">
            <div class="panel-title">Chartofaccount Report</div>
          </div>
          <div class="panel-body">
         
						  <div class="form-group">
            <label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.majorcode" />:</label>
					<div class="col-sm-3 add-margin">
						<form:select name="majorCode" path="" data-first-option="false"
							id="majorCode" cssClass="form-control">
							<form:option value="">
								<spring:message code="lbls.select" />
							</form:option>
							<c:forEach items="${majorCodeList}" var="mc">
									<option value="${mc.id}">${mc.glcode}----${mc.name}</option>
								</c:forEach>
						</form:select>
					</div>
					 <label class="col-sm-2 control-label text-right"><spring:message
							code="lbl.minorcode" />:</label>
					<div class="col-sm-3 add-margin">
						<form:select name="minorCode" path="" data-first-option="false"
							id="minorCode" cssClass="form-control">
							<form:option value="">
								<spring:message code="lbls.select" />
							</form:option>  
						 <c:forEach items="${minCodeList}" var="mn">
									<option value="${mn.id}">${mn.glcode}----${mn.name}</option>
								</c:forEach> 
								<form:hidden path=""  id="minorCode" value=""/>
						</form:select>
					</div>
				</div>
				 <div class="form-group">
						<label class="col-sm-3 control-label text-right"><spring:message
								code="lbl.accountcode" /> :</label>
						<div class="col-sm-3 add-margin">
							<form:input id="accountCode" type="text"
								class="form-control " autocomplete="off" path="" name="accountCode"
								value="" placeholder="" />
							<input type="hidden" id="accountCodeId" value="" />

						</div>
						</div>
            <div class="form-group">
            <label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.purpose" />:</label>
					<div class="col-sm-3 add-margin">
						<form:select name="purposeId" path="" data-first-option="false"
							id="purposeId" cssClass="form-control">
							<form:option value="">
								<spring:message code="lbls.select" />
							</form:option>
							<form:options items="${purposeList}" itemValue="id"
								itemLabel="name" />
						</form:select>
					</div>
              <label class="col-sm-2 control-label"><spring:message code="lbl.type" />:</label>
						<div class="col-sm-3 add-margin">
							<%-- <form:select id="type" name="type" path="type"
								cssClass="form-control" cssErrorClass="form-control error"
								>
								<form:option value="">
									<spring:message code="lbl.select" />
								</form:option>
								<c:forEach items="${type}" var="ty">
									<form:option value="${ty}">${ty}</form:option>
								</c:forEach>
							</form:select> --%>
							
							<select name="type" id="type" class="form-control mandatory">
								<option value="">
									<spring:message code="lbl.select" />
								</option>
								<option value="I"><spring:message code="value.income" /></option>
								<option value="E"><spring:message code="value.expense" /></option>
								<option value="L"><spring:message code="value.liability" /></option>
								<option value="A"><spring:message code="value.asset" /></option>
							</select>
						</div>
              
            </div>
            <div class="form-group">
              
             <label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.accountdetailtype" />:</label>
					<div class="col-sm-3 add-margin">
						<form:select name="detailTypeId" path="" data-first-option="false"
							id="detailTypeId" cssClass="form-control">
							<form:option value="">
								<spring:message code="lbls.select" />
							</form:option>
							<form:options items="${accountDetailTypeList}" itemValue="id"
								itemLabel="name" />
						</form:select>
					</div>
					
              
            </div>
            
            <div class="form-group">
					<label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.isActiveForPosting" />:</label>
					<div class="col-sm-1 add-margin"> 
						<input type="checkbox" name="isActiveForPosting"
							 />
					</div>
					
					<label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.functionRequired" />:</label>
					<div class="col-sm-1 add-margin">
						<input type="checkbox" name="functionReqd"
							 />
					</div>
					</div>
					
					 <div class="form-group">
					<label class="col-sm-3 control-label text-right"><spring:message
							code="lbl.budgetRequired" />:</label>
					<div class="col-sm-1 add-margin"> 
						<input type="checkbox" name="budgetCheckReq"
						 />
					</div>
					</div>
					
            
            <div class="form-group">
              <div class="text-center">
                <button type='button' class='btn btn-primary' id="btnsearch">
                  <spring:message code='lbl.search' />
                </button>
                <a href='javascript:void(0)' class='btn btn-default' onclick="javascript:window.parent.postMessage('close','*');"><spring:message
                    code='lbl.close' /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form:form>

<%-- <div class="row">
			<div class="col-md-6 col-xs-6 table-header">The Search result
				is</div>
			<div class="col-md-6 col-xs-6 add-margin text-right">
				<span class="inline-elem"><spring:message code='lbl.search' /></span>
				<span class="inline-elem"><input type="text" id="searchapp"
					class="form-control input-sm"></span>
			</div>
			<div class="col-md-12" id="searchResultDiv">
				<table class="table table-bordered datatable dt-responsive"
					id="coaReportResult">

				</table>
			</div>
		</div> --%>
<div class="row display-hide report-section">
	<div class="col-md-12 table-header text-left">COA Report
		Result</div>
	<div class="col-md-12 form-group report-table-container">
		<table class="table table-bordered table-hover multiheadertbl"
			id="resultTable">
			<thead>
				<tr>
					<th><spring:message code="lbl.majorcodename" /></th>
					<th><spring:message code="lbl.minorcodename" /></th>
					<th><spring:message code="lbl.accountcode" /></th>
					<th><spring:message code="lbl.accountname" /></th>
					<th><spring:message code="lbl.type" /></th>
					<th><spring:message code="lbl.purpose" /></th>
					<th><spring:message code="lbl.accountdetailtype" /></th>
					 <th><spring:message code="lbl.isActiveForPosting" /></th> 
				</tr>
			</thead>
		</table>
	</div>
</div> 
<link rel="stylesheet"
	href="<cdn:url value='/resources/global/css/bootstrap/bootstrap-datepicker.css' context='/services/egi'/>" />
<link rel="stylesheet" href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/jquery.dataTables.min.css' context='/services/egi'/>"/>
<link rel="stylesheet" href="<cdn:url value='/resources/global/css/jquery/plugins/datatables/dataTables.bootstrap.min.css' context='/services/egi'/>">
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/jquery.dataTables.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/dataTables.bootstrap.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/dataTables.tableTools.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/datatables/TableTools.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/bootstrap/typeahead.bundle.js' context='/services/egi'/>"></script>
<script
	src="<cdn:url value='/resources/global/js/jquery/plugins/jquery.inputmask.bundle.min.js' context='/services/egi'/>"></script>
<script type="text/javascript"
	src="<cdn:url value='/resources/global/js/jquery/plugins/jquery.validate.min.js' context='/services/egi'/>"></script>
<script
	src="<cdn:url value='/resources/global/js/bootstrap/bootstrap-datepicker.js' context='/services/egi'/>"
	type="text/javascript"></script>
<script type="text/javascript" src="<cdn:url value='/resources/app/js/coareport.js?rnd=${app_release_no}'/>"></script>
