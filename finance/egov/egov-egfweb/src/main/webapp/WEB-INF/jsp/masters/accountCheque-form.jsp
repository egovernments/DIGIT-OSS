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

<table border="0" width="100%">
	<tr>
		<td class="greybox"></td>
		<td class="greybox"><s:text name='lbl.fund'/> <span class="mandatory1">*</span></td>
		<td class="greybox"><s:select name="fundId" id="fundId"
				list="dropdownData.fundList" listKey="id" listValue="name"
				headerKey="-1" headerValue="%{getText('lbl.choose.options')}"
				onChange="loadBank(this);" /></td>
		<egov:ajaxdropdown id="bankbranchId" fields="['Text','Value']"
			dropdownId="bankbranchId" url="voucher/common-ajaxLoadBanks.action" />
		<td class="greybox"><s:text name='lbl.bank'/> <span class="mandatory1">*</span></td>
		<td class="greybox"><s:select name="bankbranchId"
				id="bankbranchId" list="dropdownData.bankList" listKey="id"
				listValue="name" headerKey="-1" headerValue="%{getText('lbl.choose.options')}"
				onChange="loadBankAccount(this);" /></td>
	</tr>
	<tr>
		<td class="bluebox"></td>
		<egov:ajaxdropdown id="bankAccId" fields="['Text','Value']"
			dropdownId="bankAccId"
			url="voucher/common-ajaxLoadBankAccounts.action" />
		<td class="bluebox"><s:text name='lbl.account.number'/><span class="mandatory1">*</span></td>
		<td class="bluebox"><s:select name="bankAccId" id="bankAccId"
				list="dropdownData.accNumList" listKey="id" listValue="name"
				headerKey="-1" headerValue="%{getText('lbl.choose.options')}" /></td>
		<td class="greybox"><s:text name='lbl.financial.year'/><span class="mandatory1">*</span></td>
		<td class="greybox"><s:select name="financialYearId" id="financialYearId"
				list="dropdownData.financialYearList" listKey="id" listValue="finYearRange"
				headerKey="-1" headerValue="%{getText('lbl.choose.options')}"/></td>

	</tr>
</table>

<script>
	function loadBank(fund) {
		populatebankbranchId({
			fundId : fund.options[fund.selectedIndex].value
		})

	}
	function loadBankAccount(branch) {
		var fundObj = document.getElementById('fundId');
		var bankbranchId = branch.options[branch.selectedIndex].value;
		var index = bankbranchId.indexOf("-");
		var brId = bankbranchId.substring(index + 1, bankbranchId.length);
		populatebankAccId({
			fundId : fundObj.options[fundObj.selectedIndex].value,
			branchId : brId
		})

	}
	function addModifyChq() {
		if (validate() == false) {
			return false;
		}
		var bankAccId = document.getElementById('bankAccId').value;
		var finId = document.getElementById('financialYearId').value;
		window.location = "/services/EGF/masters/accountCheque-manipulateCheques.action?bankAccId="
				+ bankAccId+"&finId="+finId;

	}
	function viewChq() {
		if (validate() == false) {
			return false;
		}
		var bankAccId = document.getElementById('bankAccId').value;
		var finId = document.getElementById('financialYearId').value;
		window.location = "/services/masters/accountCheque-viewCheques.action?bankAccId="
				+ bankAccId+"&finId="+finId;

	}
	function validate() {
		if (document.getElementById("fundId").value == -1) {

			document.getElementById("lblError").innerHTML = "<s:text name='msg.please.select.fund'/>";
			return false;
		} else if (document.getElementById("bankbranchId").value == -1) {

			document.getElementById("lblError").innerHTML = "<s:text name='msg.please.select.bank'/>";
			return false;
		} else if (document.getElementById("bankAccId").value == -1) {

			document.getElementById("lblError").innerHTML = "<s:text name='msg.please.select.bank.account.number'/>";
			return false;
		}
		else if (document.getElementById("financialYearId").value == -1) {

			document.getElementById("lblError").innerHTML = "<s:text name='msg.please.select.financial.year'/>";
			return false;
		}
	}
</script>
