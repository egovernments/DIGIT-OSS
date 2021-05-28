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

<%@ include file="/includes/taglibs.jsp"%>
<%@ page language="java"%>
<html>

<head>
<script
        src="<cdn:url value='/resources/app/js/i18n/jquery.i18n.properties.js?rnd=${app_release_no}' context='/services/EGF'/>"></script>
<script type="text/javascript"
	src="/services/EGF/resources/javascript/ajaxCommonFunctions.js?rnd=${app_release_no}"></script>
<script type="text/javascript"
	src="/services/EGF/resources/javascript/calender.js?rnd=${app_release_no}"></script>
<script type="text/javascript"
	src="/services/EGF/resources/javascript/dateValidation.js?rnd=${app_release_no}"></script>
<script type="text/javascript"
	src="/services/EGF/resources/javascript/accountCheque.js?rnd=${app_release_no}"></script>
<script type="text/javascript"
	src="/services/egi/resources/global/js/egov/patternvalidation.js?rnd=${app_release_no}"></script>
<meta http-equiv="Content-Type"
	content="text/html; charset=windows-1252">

<title>Account Cheque Create</title>

</head>

<body onload="clearHeaderData();">

	<jsp:include page="../budget/budgetHeader.jsp">
		<jsp:param name="heading" value="Account Cheque Create" />
	</jsp:include>
	<s:form action="accountCheque" theme="simple" name="chequeMaster"
		id="chequeMaster">
		<s:if test="hasActionMessages()">
			<font style='color: green; font-weight: bold'> <s:actionmessage />
			</font>
		</s:if>
		<div class="formmainbox">
			<div class="formheading">
				<div class="subheadnew"><s:text name="lbl.cheque.master"/> </div>
			</div>
			<br />
			<s:if test="%{bankaccount != null}">
				<table width="100%" cellspacing="0" cellpadding="0" border="0"
					align="center">
					<tr align="center">
						<div class="headingsmallbg">
							<td class="bluebgheadtd" width="100%" colspan="5"><strong
								style="font-size: 15px;"><s:text name="lbl.bank.details"/> </strong></td>
						</div
					</tr>
				</table>
				</br>
				<table border="0" width="100%">

					<tr>
						<td class="bluebox "></td>
						<td class="bluebox"><s:text name="lbl.bank"/> <span class="mandatory1">*</span></td>
						<td class="bluebox"><s:property
								value="bankaccount.bankbranch.bank.name" /></td>
						<td class="bluebox"><s:text name="lbl.bank.branch"/> <span class="mandatory1">*</span></td>
						<td class="bluebox"><s:property
								value="bankaccount.bankbranch.branchname" /></td>
					</tr>
					<tr>
						<td class="bluebox "></td>
						<td class="greybox"><s:text name="lbl.account.number"/><span class="mandatory1">*</span></td>
						<td class="greybox"><s:property
								value="bankaccount.accountnumber" /></td>
						<td class="greybox"><s:text name="lbl.fund"/> <span class="mandatory1">*</span></td>
						<td class="greybox"><s:property value="bankaccount.fund.name" /></td>
					</tr>
				</table>

				<s:hidden name="bankAccId" id="bankAccId" value="%{bankaccount.id}" />
				<s:hidden name="financialYearId" id="financialYearId" value="%{financialYearId}" />
				<s:hidden name="isDefaultDeptEnabled" id="isDefaultDeptEnabled" value="%{defaultSelectedDepartments != ''}" />
			</s:if>
			<br />
			<table width="100%" cellspacing="0" cellpadding="0" border="0"
				align="center">
				<tr align="center">

					<div class="headingsmallbg">
					<td class="bluebgheadtd" width="100%" colspan="5"><strong
								style="font-size: 15px;"><s:text name="lbl.add.new.cheque"/></strong></td>
					</div>  

				</tr>
			</table>
			<font style='color: red; font-weight: bold'>
				<p class="error-block" id="lblError"></p>
			</font>
			<table border="0" width="100%">

				<tr>
					<td class="bluebox "></td>
					<td class="greybox "><s:text name="lbl.from.cheque.number"/> <span
						class="mandatory1">*</span></td>
					<td class="greybox"><s:textfield name="fromChqNo"
							class="patternvalidation" data-pattern="number" id="fromChqNo"
							maxlength="6" size="6" onkeyup="validateOnlyNumber(this);" /></td>
					<td class="greybox"><s:text name="lbl.to.cheque.number"/><span class="mandatory1">*</span></td>
					<td class="greybox"><s:textfield name="toChqNo"
							class="patternvalidation" data-pattern="number" id="toChqNo"
							maxlength="6" size="6" onkeyup="validateOnlyNumber(this);" /></td>

				</tr>

				<tr>
					<td class="bluebox "></td>
					<td class="bluebox"><s:text name="lbl.recieve.date"/><span class="mandatory1">*</span></td>
					<td class="bluebox"><s:textfield name="receivedDate"
							id="receivedDate" maxlength="10"
							onkeyup="DateFormat(this,this.value,event,false,'3')" /> <a
						href="javascript:show_calendar('chequeMaster.receivedDate',null,null,'DD/MM/YYYY');"
						style="text-decoration: none">&nbsp;<img
							src="/services/egi/resources/erp2/images/calendaricon.gif" border="0" /></a>(dd/mm/yyyy)
					</td>
					<td class="bluebox"><s:text name="lbl.department"/><span class="mandatory1">*</span></td>
					<td class="bluebox"><s:select name="departmentList"
							id="departmentList" list="dropdownData.departmentList"
							listKey="code" listValue="name" multiple="true" required="true"
							value="%{defaultSelectedDepartments}"
							style="height:auto;" /></td>							
				</tr>

				<tr>
					<td class="bluebox "></td>
					<td class="greybox"><s:text name="lbl.financial.year"/><span class="mandatory1">*</span></td>
					<td class="greybox"><s:select name="serialNo" id="serialNo"
							list="dropdownData.financialYearList" listKey="id"
							listValue="finYearRange" headerKey="-1" value="%{financialYearId}"
							headerValue="%{getText('lbl.choose.options')}" required="true" disabled="true"/>
					<td class="greybox"></td>
					<td class="greybox"></td>

				</tr>

			</table>
			<table width="90%" cellspacing="0" cellpadding="0" border="0"
				align="center">
				<tr align="center">

					<td align="center" style="text-align: center"><input
						type="button" name="Done" onclick="updateGridData()"
						class="buttonsubmit" value='<s:text name="lbl.click.to.add.new.cheque"/>'
						align="middle" /></td>

				</tr>
			</table>

			<br>

			<jsp:include page="accountChequeChequeDetailGrid.jsp" />

			<table width="100%" cellspacing="0" cellpadding="0" border="0"
				align="center">
				<tr align="center">
					<div class="headingsmallbg">
						<td><span class="bold"><s:text name="lbl.existing.cheque.details"/> </span></td>
					</div>
				</tr>
			</table>

			<font style='color: red; font-weight: bold'>
				<p class="error-block" id="lblErrorGrid"></p>
			</font>


			<div class="yui-skin-sam" align="center">
				<s:hidden name="chequeDetailsRows"  id="chequeDetailsRowId"/>
				<div id="chequeDetailsGridTable">
					<script>
						makeChequeDetailsGridTable();
						document.getElementById('chequeDetailsGridTable')
								.getElementsByTagName('table')[0].width = "30%"
					</script>
					<br />
					<div class="buttonbottom">
						<input type="button" id="save" value="<s:text name='lbl.save'/>"	onclick="submitForm();" class="buttonsubmit" /> 
						<input type="button" id="Close" value="<s:text name='lbl.close'/>" onclick="javascript:window.parent.postMessage('close','*');" class="button" />
					</div>
				</div>
			</div>
			<s:hidden name="deletedChqDeptId" id="deletedChqDeptId" />
			<br />
			<s:token />
		</div>
	</s:form>
	<script type="text/javascript">
		function submitForm() {
			document.getElementById("lblError").innerHTML = "";
			var fromChequeNo = document.getElementById("fromChqNo").value;
			var toChequeNo = document.getElementById("toChqNo").value;
			var receivedDate = document.getElementById("receivedDate").value;
			var department = document.getElementById("departmentList").value;
			var serialNo = document.getElementById("serialNo").value;
			var isDefaultDeptEnabled = document.getElementById("isDefaultDeptEnabled").value;

			if ((fromChequeNo != "" || toChequeNo != "" || receivedDate != "") ? true : isDefaultDeptEnabled == 'true' ? false : department != "")
				document.getElementById("lblError").innerHTML = "<s:text name='msg.please.click.on.add.new.cheque.or.unselect.required.field'/>";
			else {
				disableParameters();
				document.chequeMaster.action = '/services/EGF/masters/accountCheque-save.action';
				jQuery(chequeMaster).append(
						jQuery('<input>', {
	                        type: 'hidden',
	                        name: '${_csrf.parameterName}',
	                        value: '${_csrf.token}'
	                    })
	                );
				document.chequeMaster.submit();
			}

		}
	</script>
</body>

</html>
