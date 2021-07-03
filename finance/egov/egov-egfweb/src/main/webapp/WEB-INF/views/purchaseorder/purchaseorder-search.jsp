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
<form:form role="form" action="search" modelAttribute="purchaseOrderSearchRequest" id="purchaseordersearchform"
  cssClass="form-horizontal form-groups-bordered" enctype="multipart/form-data">
  <div class="main-content">
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary" data-collapsed="0">
          <div class="panel-heading">
            <div class="panel-title"><spring:message code="title.purchaseorder.search" text="Search Purchase Order"/> </div>
          </div>
          <div class="panel-body">
          <input type="hidden" id="mode" name="mode" value="${mode}" />
             <div class="form-group">
             	  <label class="col-sm-2 control-label text-right"><spring:message code="purchaseorder.number" text="Order No."/> </label>
	              <div class="col-sm-3 add-margin">
	                <form:input path="orderNumber" class="form-control text-left patternvalidation" data-pattern="alphanumeric"
	                  maxlength="50" />
	                <form:errors path="orderNumber" cssClass="error-msg" />
	              </div>
	           	 <label class="col-sm-2 control-label text-right"><spring:message code="lbl.name" text="Name"/> </label>
	              <div class="col-sm-3 add-margin">
	                <form:input path="name" class="form-control text-left patternvalidation" data-pattern="alphanumeric"
	                  maxlength="50" />
	                <form:errors path="name" cssClass="error-msg" />
	              </div>
              </div>
              <div class="form-group">
				<label class="col-sm-2 control-label text-right" for="supplier"> <spring:message code="purchaseorder.supplier" text="Supplier Name"/>
				</label>
				<div class="col-sm-3 add-margin contactPerson"> 
					<form:select path="supplierId" data-first-option="false" id="supplier" class="form-control">
						<form:option value=""><spring:message code="lbl.select" /></form:option>
						<c:forEach var="supplier" items="${suppliers}">
							<form:option  value="${supplier.id}" >
								<c:out value="${supplier.name} - ${supplier.code}"/>
							</form:option>
						</c:forEach>
					</form:select>
					<form:errors path="supplierId" cssClass="add-margin error-msg" />
				</div>
				<label class="col-sm-2 control-label text-right" for="suppliercode"> <spring:message code="purchaseorder.suppliercode" text="Supplier Code"/>
				</label>
				<div class="col-sm-3 add-margin">
					<form:input path="" id="suppliercode" maxlength="100" disabled="true" cssClass="form-control"/>
				</div>
			</div>
			<div class="form-group">
				<label class="col-sm-2 control-label text-right" for="fund"> 
					<spring:message code="purchaseorder.fund" text="Fund"/>
				</label>
				<div class="col-sm-3 add-margin">
					<form:select path="fundId" data-first-option="false" id="fund" class="form-control"  >
						<form:option value=""><spring:message code="lbl.select" text="Select"/></form:option>
						<form:options items="${funds}" itemValue="id" itemLabel="name" />
					</form:select>
					<form:errors path="fundId" cssClass="add-margin error-msg" />
				</div>
			</div>
            <div class="form-group">
              <div class="text-center">
                <button type='button' class='btn btn-primary' id="btnsearch">
                  <spring:message code='lbl.search' text="Search"/>
                </button>
                <a href='javascript:void(0)' class='btn btn-default' onclick="javascript:window.parent.postMessage('close','*');"><spring:message
                    code='lbl.close' text="Close"/></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form:form>
<div class="row display-hide report-section">
  <div class="col-md-12 table-header text-left"><spring:message code="purchaseorder.search.result" text="Purchase Order Search Result"/> </div>
  <div class="col-md-12 form-group report-table-container">
    <table class="table table-bordered table-hover multiheadertbl" id="resultTable">
      <thead>
        <tr>
          <th><spring:message code="purchaseorder.number" text="Order No."/></th>
          <th><spring:message code="lbl.name" text="Name"/></th>
          <th><spring:message code="purchaseorder.ordervalue" text="Total/Order Value"/></th>
          <th><spring:message code="purchaseorder.supplier" text="Supplier Name"/></th>
          <th><spring:message code="purchaseorder.active" text="Active Y/N"/></th>
        </tr>
      </thead>
    </table>
  </div>
</div>
<script>
	$('#btnsearch').click(function(e) {
		if ($('form').valid()) {
		} else {
			e.preventDefault();
		}
	});
</script>
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
<script type="text/javascript" src="<cdn:url value='/resources/app/js/purchaseOrderHelper.js?rnd=${app_release_no}' context='/services/EGF'/>"></script>
