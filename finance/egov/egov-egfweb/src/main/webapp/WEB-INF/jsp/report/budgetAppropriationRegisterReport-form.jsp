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


<%@ taglib prefix="s" uri="/WEB-INF/tags/struts-tags.tld"%>
<%@ taglib prefix="egov" tagdir="/WEB-INF/tags"%>
<head>
<script type="text/javascript"
	src="${pageContext.request.contextPath}/resources/javascript/contra.js?rnd=${app_release_no}"></script>
<script type="text/javascript"
	src="/services/EGF/resources/javascript/ajaxCommonFunctions.js?rnd=${app_release_no}"></script>
</head>
<script>
function populateDepartment(obj) {
	var fundId = document.getElementById("fund").value;
	populatedepartment
	( {
		fundId : fundId
	})
}
function populateFunction(obj) {
	var departmentId = document.getElementById("department").value;
	populatefunctions
	( { 
		departmentId : departmentId
	})
}
function populateBudgetHead(obj) {
	var functionId = document.getElementById("functions").value;
	populatebudgetHeadId
	( {
		functionId : functionId
	})
}


function validateFields() {
	<s:if test="%{isFieldMandatory('fund')}">
	if(document.getElementById('fund').value == '0') {
		bootbox.alert("<s:text name='voucher.fund.mandatory'/>")
		return false;
	}
	</s:if>
	<s:if test="%{isFieldMandatory('executingDepartment')}">
		if(document.getElementById('department').value == '0') {
			bootbox.alert("<s:text name='voucher.department.mandatory'/>");
			return false;
		}
	</s:if>

	<s:if test="%{isFieldMandatory('function')}">
	if(document.getElementById('functions').value == '0') {
		bootbox.alert("<s:text name='budget.function.mandatory'/>");
		return false;
	}
	</s:if>
	if(document.getElementById('budgetHeadId').value == '0') {
		bootbox.alert("<s:text name='msg.please.select.budget.head'/>");
		return false;
	}
	if(document.getElementById('asOnDate').value == '' ) {
		bootbox.alert("<s:text name='msg.please.enter.as.onDate'/>");
		return false;
	}


	return true;	
}

function generateReport(){
	 var asOnDate =  document.getElementById('asOnDate').value;
	var department = document.getElementById('department').value;
	var functionId = document.getElementById('functions').value;
	var budgetHeadId = document.getElementById('budgetHeadId').value;
	var fundId = document.getElementById('fund').value; 
	
	isValid = validateFields();
	if(isValid == false)
		return false;

	document.budgetAppropriationRegister.action='/services/EGF/report/budgetAppropriationRegisterReport-search.action';
	jQuery(budgetAppropriationRegister).append(jQuery('<input>', {
        type : 'hidden',
        name : '${_csrf.parameterName}',
        value : '${_csrf.token}'
    }));
	document.budgetAppropriationRegister.submit();  
}
</script>
<body>
	<div class="formmainbox">
		<div class="formheading"></div>
		<div class="subheadnew"><s:text name="lbl.budget.watch.register.report"/> </div>
		<br /> <span class="mandatory1"> <s:actionerror /> <s:fielderror />
			<s:actionmessage />
		</span>
		<s:form action="budgetAppropriationRegisterReport" theme="simple"
			name="budgetAppropriationRegister">
			<table width="100%" cellpadding="0" cellspacing="0" border="0">
				<tr>
					<td class="bluebox">&nbsp;</td>
					<td class="bluebox"><s:text name="report.fund" /> <s:if
							test="%{isFieldMandatory('fund')}">
							<span class="mandatory1">*</span>
						</s:if></td>
					<td class="bluebox"><s:select list="dropdownData.fundList"
							listKey="id" listValue="name" name="fund.id" headerKey="0"
							headerValue="%{getText('lbl.choose.options')}" value="fund.id" id="fund"
							onChange="populateDepartment(this);"></s:select></td>

					<egov:ajaxdropdown id="department" fields="['Text','Value']"
						dropdownId="department"
						url="voucher/common-ajaxLoadEstimateBudgetDetailsByFundId.action" />
					<td class="bluebox"><s:text name="report.department" /> <s:if
							test="%{isFieldMandatory('executingDepartment')}">
							<span class="mandatory1">*</span>
						</s:if></td>
					<td class="bluebox"><s:select
							list="dropdownData.executingDepartmentList" listKey="code"
							listValue="name" name="department.code" headerKey="0"
							headerValue="%{getText('lbl.choose.options')}" value="department.code"
							id="department" onChange="populateFunction(this);"></s:select></td>


				</tr>
				<tr>
					<td class="greybox">&nbsp;</td>
					<egov:ajaxdropdown id="functions" fields="['Text','Value']"
						dropdownId="functions"
						url="voucher/common-ajaxLoadEstimateBudgetDetailsByDepartmentId.action" />
					<td class="greybox"><s:text name="report.function.center" />
						<s:if test="%{isFieldMandatory('function')}">
							<span class="mandatory1">*</span>
						</s:if></td>
					<td class="greybox"><s:select list="dropdownData.functionList"
							listKey="id" listValue="name" name="function.id" headerKey="0"
							headerValue="%{getText('lbl.choose.options')}" value="function.id" id="functions"
							onChange="populateBudgetHead(this)"></s:select></td>
					<egov:ajaxdropdown id="budgetHeadId" fields="['Text','Value']"
						dropdownId="budgetHeadId"
						url="voucher/common-ajaxLoadEstimateBudgetDetailsByFuncId.action" />
					<td class="bluebox"><s:text name="report.budged.head" /><span
						class="mandatory1">*</span></td>
					<td class="bluebox"><s:select
							list="dropdownData.budgetGroupList" listKey="id" listValue="name"
							name="budgetGroup.id" headerKey="0" headerValue="%{getText('lbl.choose.options')}"
							value="budgetGroup.id" id="budgetHeadId"></s:select></td>
					<td class="bluebox">&nbsp;</td>
				</tr>

				<tr>
					<td class="bluebox">&nbsp;</td>
					<td class="greybox"><s:text name="report.asOnDate"/> :<span class="mandatory1">*</span></td>
					<td class="greybox"><s:date name="asOnDate" var="asOnDate"
							format="dd/MM/yyyy" /> <s:textfield id="asOnDate"
							name="asOnDate" value="%{strAsOnDate}"
							onkeyup="DateFormat(this,this.value,event,false,'3')"
							placeholder="DD/MM/YYYY" cssClass="form-control datepicker"
							data-inputmask="'mask': 'd/m/y'" /></td>

				</tr>
			</table>

			<div class="buttonbottom">
				<input type="submit" value="<s:text name='lbl.search'/>" class="buttonsubmit"
					onclick="return generateReport()" /> &nbsp;
				<s:reset name="button" type="submit" cssClass="button" id="button"
					key="lbl.reset"/>
				<input type="button" value="<s:text name='lbl.close'/>"
					onclick="window.parent.postMessage('close','*');window.close();" class="button" />
			</div>
			<input type="hidden" name="accountNumber.id" id="accountNumber.id" />
	</div>

	</s:form>
	<div id="results"><jsp:include
			page="./budgetAppropriationRegisterReport-result.jsp"></jsp:include>

	</div>
</body>
</html>
