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
<%@ taglib uri="/WEB-INF/tags/cdn.tld" prefix="cdn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<style>
.position_alert {
	position: fixed;
	z-index: 9999;
	top: 50px;
	right: 20px;
	background: #F2DEDE;
	padding: 10px 20px;
	border-radius: 5px;
}

.position_alert1 {
	position: fixed;
	z-index: 9999;
	top: 50px;
	right: 520px;
	background: #F2DEDE;
	padding: 10px 20px;
	border-radius: 5px;
}

.position_alert2 {
	position: fixed;
	z-index: 9999;
	top: 50px;
	right: 270px;
	background: #F2DEDE;
	padding: 10px 20px;
	border-radius: 5px;
}
</style>
<c:if test="${not empty errorMessage}">
	<div class="alert alert-danger" role="alert">
		<spring:message code="${errorMessage}" />
	</div>
</c:if>
<form:form name="supplierBillForm" role="form"
	modelAttribute="egBillregister" id="egBillregister"
	class="form-horizontal form-groups-bordered"
	enctype="multipart/form-data">
	<div class="position_alert">
		<spring:message code="lbl.netpayable.amount" text="Net Payable Amount"/>
		: &#8377 <span id="supplierNetPayableAmount"><c:out
				value="${supplierNetPayableAmount}" default="0.0"></c:out></span>
	</div>
	<div class="position_alert1">
		<spring:message code="lbl.total.debit.amount" text="Total Debit Amount"/>
		: &#8377 <span id="supplierBillTotalDebitAmount"> <c:out
				value="${supplierBillTotalDebitAmount}" default="0.0"></c:out></span>
	</div>
	<div class="position_alert2">
		<spring:message code="lbl.total.deduction.amount" text="Total Deduction Amount"/>
		: &#8377 <span id="supplierBillTotalCreditAmount"> <c:out
				value="${supplierBillTotalCreditAmount}" default="0.0"></c:out></span>
	</div>

	<form:hidden path="" id="selectedCheckList" value="${selectedCheckList}" />
	<form:hidden path="" id="cutOffDate" value="${cutOffDate}" />
	<form:hidden path="" name="mode" id="mode" value="${mode}" />
	<form:hidden path="" name="netPayableId" id="netPayableId" value="${netPayableId}" />
	<form:hidden path="" name="netPayableAmount" id="netPayableAmount" value="${netPayableAmount}" />
	<form:hidden path="passedamount" name="passedamount" id="passedamount" value="${egBillregister.passedamount}"/>
	
	<div class="panel-title text-center" style="color: green;">
		<c:out value="${message}" />
		<br />
	</div>
	<spring:hasBindErrors name="egBillregister">
		<div class="alert alert-danger"
			style="margin-top: 20px; margin-bottom: 10px;">
			<form:errors path="*" />
			<br />
		</div>
	</spring:hasBindErrors>

		<jsp:include page="supplierbill-header.jsp" />
		<div class="panel panel-primary" data-collapsed="0">
			<jsp:include page="supplierbill-debitdetails.jsp" />
			<jsp:include page="supplierbill-creditdetails.jsp" />
			<jsp:include page="supplierbill-netpayable.jsp" />
		</div>
         <c:if test="${egBillregister.documentDetail != null &&  !egBillregister.documentDetail.isEmpty()}">
             <jsp:include page="billdocument-upload.jsp"/>
         </c:if>
		<jsp:include page="../common/commonworkflowmatrix-expensebill.jsp" />
		<div class="buttonbottom" align="center">
			<jsp:include page="../common/commonworkflowmatrix-button.jsp" />
		</div>

</form:form>
<script src="<cdn:url value='/resources/app/js/i18n/jquery.i18n.properties.js?rnd=${app_release_no}' context='/services/EGF'/>"></script>
<script
	src="<cdn:url value='/resources/app/js/common/helper.js?rnd=${app_release_no}'  context='/services/EGF'/>"></script>
<script
	src="<cdn:url value='/resources/app/js/supplierbill/supplierbill.js?rnd=${app_release_no}'  context='/services/EGF'/>"></script>
<script
	src="<cdn:url value='/resources/app/js/common/voucherBillHelper.js?rnd=${app_release_no}'  context='/services/EGF'/>"></script>
<script
	src="<cdn:url value='/resources/global/js/egov/patternvalidation.js?rnd=${app_release_no}' context='/services/egi'/>"></script>
<script
	src="<cdn:url value='/resources/global/js/egov/inbox.js?rnd=${app_release_no}' context='/services/egi'/>"></script>
