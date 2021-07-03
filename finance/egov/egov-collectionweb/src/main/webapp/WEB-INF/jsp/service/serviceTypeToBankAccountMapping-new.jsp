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
<html>
<head>
<title><s:text name="service.master.search.header" /></title>

<script type="text/javascript">
	function validate() {
		var valid = true;
		document.getElementById('error_area').innerHTML = '';
		document.getElementById("error_area").style.display = "none";
		if (document.getElementById('serviceCategoryid').value == "-1") {
			document.getElementById("error_area").innerHTML = '<s:text name="error.select.service.category" />';
			valid = false;
		}
		else if (document.getElementById('serviceDetailsId') != undefined && document.getElementById('serviceDetailsId').value == "0") {
			document.getElementById("error_area").innerHTML = '<s:text name="error.select.service.type" />';
			valid = false;
		}
		else if (document.getElementById('bankName').value == "-1") {
			document.getElementById("error_area").innerHTML = '<s:text name="error.select.bank" />';
			valid = false;
		}
		else if (document.getElementById('branchName').value == "-1") {
			document.getElementById("error_area").innerHTML = '<s:text name="error.select.bankbranch" />';
			valid = false;
		}
		else if (document.getElementById('bankAccountId').value == "-1") {
			document.getElementById("error_area").innerHTML = '<s:text name="error.select.bankaccount" />';
			valid = false;
		}
		if (valid == false) {
			document.getElementById("error_area").style.display = "block";
			window.scroll(0, 0);
		}

		if (jQuery('#serviceAccountId').val())
			jQuery('#serviceCategory, #serviceDetailsId')
					.prop('disabled', false);
		if(valid){
			document.serviceBankMappingForm.action='serviceTypeToBankAccountMapping-create.action';
			jQuery(serviceBankMappingForm).append(jQuery('<input>', {
	            type : 'hidden',
	            name : '${_csrf.parameterName}',
	            value : '${_csrf.token}'
	        }));
		}
		
		return valid;
	}

	function onChangeBankBranch(bankId) {
		dom.get("bankAccountId").value = "-1";
		populatebranchName({
			bankId : bankId,
		});
	}

	function onChangeBankAccount(branchId,serviceId) {
		var serviceDetailsId = document.getElementById('serviceDetailsId');
		var serviceCategoryid = document.getElementById('serviceCategoryid').value;
		if(serviceDetailsId == undefined){
			serviceId = serviceCategoryid;
		}else{
			serviceId = serviceCategoryid +"."+serviceDetailsId.value;
		}
		populatebankAccountId({
			branchId : branchId,
			serviceId : serviceId,
		});
	}
	function populateService(serviceId) {
		document.getElementById('serviceDetailsId').value = "-1"
		populateserviceDetailsId({
			serviceCatId : serviceId,
		});
	}

	function populateServiceType(selected){
        var isServiceTypeExist = false;
        document.getElementById('serviceTable').innerHTML='';
        if(selected == -1){
			return;
        }
        <s:iterator value="serviceCategoryNames" var="obj">
        var serTypeKey = '<s:property value="#obj.key"/>';
        var serTypeValue = '<s:property value="serviceTypeMap[#obj.key]"/>';
        if(selected == serTypeKey && serTypeValue != ''){
        	isServiceTypeExist = true;
        	addServiceTypeDropdown('serviceTable');
 			<s:iterator value="serviceTypeMap[#obj.key]" status="stat" var="names">
 				var stKey = '<s:property value="#names.key"/>';
 				var stValue = '<s:property value="#names.value"/>';
 				document.getElementById('serviceDetailsId').options[<s:property value="#stat.index+1"/>]= new Option(stValue,stKey);
			</s:iterator>
        }
		 </s:iterator>
	}
	function addServiceTypeDropdown(tableId){
        var table = document.getElementById(tableId);
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.className='bluebox';
        cell2.className='bluebox';
        cell1.innerHTML = '<s:text name="miscreceipt.service" /><span class="mandatory"/>';
        cell2.innerHTML = '<select name="serviceDetails.code" id="serviceDetailsId"/>';
		document.getElementById('serviceDetailsId').options.length=0;
		document.getElementById('serviceDetailsId').options[0]= new Option('--------Choose--------','0');
	
	}
</script>
</head>

<body>
	<s:if test="%{hasErrors()}">
		<div class="errorstyle">
			<s:actionerror />
			<s:fielderror />
		</div>
	</s:if>
	<s:if test="%{hasActionMessages()}">
		<font style='color: green; font-weight: bold'> <s:actionmessage />
		</font>
	</s:if>
	<s:form name="serviceBankMappingForm" method="post" theme="simple">
		<s:push value="model">
			<div class="errorstyle" id="error_area" style="display: none;"></div>

			<div class="formmainbox">
				<div class="subheadnew">
					<s:if test="%{serviceAccountId}">
						<s:text name="service.master.bankmapppingmodify.header" />
					</s:if>
					<s:else>
						<s:text name="service.master.bankmappping.header" />
					</s:else>
				</div>

				<table width="100%" border="0" cellspacing="0" cellpadding="0"
					style="max-width: 960px; margin: 0 auto;">
					<tr>
						<s:hidden id="serviceAccountId" name="serviceAccountId" />
						<s:hidden id="id" name="id" />
						<s:hidden id="sourcePage" name="sourcePage" />
						<td class="bluebox">&nbsp;</td>
						<td class="bluebox"><s:text name="service.master.search.category" /> <span class="mandatory" /></td>
						<td class="bluebox">
						<s:select headerKey="-1" headerValue="----Choose----" name="serviceCategory" id="serviceCategoryid" cssClass="selectwk" list="serviceCategoryNames" value="%{service.serviceCategory}" onChange="populateServiceType(this.value);" />
						</td>
						<td colspan="2">
						<table width="100%" id='serviceTable'>
						</table>
						</td>
					</tr>
					<tr>
						<td class="bluebox">&nbsp;</td>
						<td class="bluebox"><s:text name="service.master.bankname" /> <span class="mandatory" /></td>
						<td class="bluebox"><s:select headerKey="-1" headerValue="----Choose----" name="bankId" id="bankName" cssClass="selectwk" list="dropdownData.bankNameList" listKey="id" listValue="name" value="%{bankId}" onchange="onChangeBankBranch(this.value)" /> 
							<egov:ajaxdropdown id="accountNumberIdDropdown" fields="['Text','Value']" dropdownId='branchName' url='receipts/ajaxBankRemittance-bankBranchsByBankForReceiptPayments.action' />
						</td>
						<td class="bluebox"><s:text name="service.master.branchName" /> <span class="mandatory" /></td>
						<td class="bluebox"><s:select headerKey="-1" headerValue="----Choose----" name="branchId" id="branchName" cssClass="selectwk" list="dropdownData.bankBranchList" listKey="id" listValue="branchname" onChange="onChangeBankAccount(this.value)" value="%{branchId}" />
							<egov:ajaxdropdown id="bankAccountIdDropDown" fields="['Text','Value']" dropdownId='bankAccountId' url='receipts/ajaxBankRemittance-bankAccountByBankBranch.action' />
						</td>
					</tr>
					<td class="bluebox">&nbsp;</td>
					<td class="bluebox"><s:text name="service.master.accountnumber" /> <span class="mandatory" /></td>
					<td class="bluebox"><s:select headerKey="-1" headerValue="----Choose----" name="bankAccountId" id="bankAccountId" cssClass="selectwk" list="dropdownData.bankAccountIdList" listKey="id" listValue="accountnumber" value="%{bankAccountId.id}" /></td>
					<tr>
					</tr>
				</table>
				<div align="left" class="mandatorycoll">
					&nbsp;&nbsp;&nbsp;
					<s:text name="common.mandatoryfields" />
				</div>
				<br />
			</div>

			<div class="buttonbottom">
				<s:submit name="sumbit" cssClass="buttonsubmit" id="button32" onclick="return validate(); " value="Create Mapping" />
				<s:reset name="reset" cssClass="button" id="button" value="Reset" />
				<input name="close" type="button" class="button" id="button" onclick="window.close()" value="Close" />
			</div>
		</s:push>
	</s:form>
	<script>
		if (jQuery('#serviceAccountId').val())
			jQuery('#serviceCategory, #serviceDetailsId')
					.prop('disabled', true);
	</script>
</body>
</html>
