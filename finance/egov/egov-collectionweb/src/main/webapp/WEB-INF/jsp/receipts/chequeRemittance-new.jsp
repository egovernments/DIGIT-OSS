
<%--
  ~    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
  ~    accountability and the service delivery of the government  organizations.
  ~
  ~     Copyright (C) 2018  eGovernments Foundation
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
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><s:text name="cheque.remittance.title" /></title>
<script type="text/javascript">
	jQuery.noConflict();
	var isDatepickerOpened = false;
	jQuery(document)
			.ready(
					function($) {
						
						if(jQuery("#finYearId").val()!=-1){
							$("#dateDiv").hide();
							$("#fromDate").val("");
							$("#toDate").val("");
						}
						else if(jQuery("#finYearId").val()==-1){
							$("#dateDiv").show();
						}
						
						//hide or show date fields on selecting year from drop down
						jQuery("#finYearId").on("change",function(){
							if(jQuery("#finYearId").val()!=-1){
								$("#dateDiv").hide();
								$("#fromDate").val("");
								$("#toDate").val("");
							}
							else if(jQuery("#finYearId").val()==-1){
								$("#dateDiv").show();
							}
						});

						
						jQuery('#remittanceDate').val("");
						//jQuery('#finYearId').prop("disabled", true);
						jQuery("form").submit(function(event) {
							doLoadingMask();
						});
						var nowTemp = new Date();
						var now = new Date(nowTemp.getFullYear(), nowTemp
								.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

						jQuery("#remittanceDate")
								.datepicker(
										{
											format : 'dd/mm/yyyy',
											endDate : nowTemp,
											autoclose : true,
											onRender : function(date) {
												return date.valueOf() < now
														.valueOf() ? 'disabled'
														: '';
											}
										}).on('changeDate', function(ev) {
									var string = jQuery(this).val();
									if (!(string.indexOf("_") > -1)) {
										isDatepickerOpened = false;
									}
								}).data('datepicker');
						jQuery("#fromDate")
								.datepicker(
										{
											format : 'dd/mm/yyyy',
											endDate : nowTemp,
											autoclose : true,
											onRender : function(date) {
												return date.valueOf() < now
														.valueOf() ? 'disabled'
														: '';
											}
										}).on('changeDate', function(ev) {
									var string = jQuery(this).val();
									if (!(string.indexOf("_") > -1)) {
										isDatepickerOpened = false;
									}
								}).data('datepicker');

						jQuery("#toDate")
								.datepicker(
										{
											format : 'dd/mm/yyyy',
											endDate : nowTemp,
											autoclose : true,
											onRender : function(date) {
												return date.valueOf() < now
														.valueOf() ? 'disabled'
														: '';
											}
										}).on('changeDate', function(ev) {
									var string = jQuery(this).val();
									if (!(string.indexOf("_") > -1)) {
										isDatepickerOpened = false;
									}
								}).data('datepicker');
						doLoadingMask();
					});

	jQuery(window).load(function() {
		undoLoadingMask();
	});

	var isSelected;
	function handleReceiptSelectionEvent() {

		dom.get("multipleserviceselectionerror").style.display = "none";
		dom.get("selectremittanceerror").style.display = "none";

		dom.get("button32").disabled = false;
		dom.get("button32").className = "buttonsubmit";
		
		var instrumentAmount = document.getElementsByName('instrumentAmount');
		var totalAmtDisplay = 0.00;
		for (i = 0; i < instrumentAmount.length; i++) {
			if(document.getElementById("selected_"+i).checked){
				document.getElementById("selected_"+i).value= true;
				totalAmtDisplay = parseInt(totalAmtDisplay) + parseInt(document.getElementById("instrumentAmount_"+i).value);
			}else{
				document.getElementById("selected_"+i).value= false;
			}
		}
		document.getElementById("remittanceAmount").value = totalAmtDisplay;
	}


	// Changes selection of all receipts to given value (checked/unchecked)
	function changeSelectionOfAllReceipts(checked) {
		
		var list = document.getElementsByName('instrumentAmount');
		for (i = 0; i < list.length; i++) {
			document.getElementById("selected_"+i).value= checked;
			document.getElementById("selected_"+i).checked = checked;
		}
		
		var totalAmtDisplay = 0.00;
		for (i = 0; i < list.length; i++) {
			if(document.getElementById("selected_"+i).checked){
				totalAmtDisplay = parseInt(totalAmtDisplay) + parseInt(document.getElementById("instrumentAmount_"+i).value);
			}
		}
		document.getElementById("remittanceAmount").value = totalAmtDisplay;
		
	}
	
	function validate() {
		resetSelectedRowsId();
		dom.get("bankselectionerror").style.display = "none";
		dom.get("accountselectionerror").style.display = "none";
		dom.get("selectremittanceerror").style.display = "none";
		dom.get("approvalSelectionError").style.display = "none";

		if (dom.get("accountNumberId").value != null
				&& dom.get("accountNumberId").value == -1) {
			dom.get("bankselectionerror").innerHTML = "";
			dom.get("accountselectionerror").style.display = "block";
			return false;
		}
		<s:if test="showRemittanceDate">
		if (dom.get("remittanceDate") != null
				&& dom.get("remittanceDate").value == "") {
			bootbox.alert("Please Enter Date of Remittance");
			return false;
		} else {
			var remittanceDate = dom.get("remittanceDate").value;
			var receiptDate;
			isSelected = document.getElementsByName('receiptIds');
			for (i = 0; i < isSelected.length; i++) {
				if (isSelected[i].checked == true) {
					date = new Date(document.getElementsByName('receiptDateTempArray')[i].value);
					var dd=date.getDate();
					if(dd<10)dd='0'+dd;
					var mm=date.getMonth()+1;
					if(mm<10)mm='0'+mm;
					receiptDate = dd + '/' + mm + '/' +  date.getFullYear();
					if (receiptDate != null && receiptDate != '' && remittanceDate!= null && remittanceDate != '') {
						if (processDate(receiptDate) > processDate(remittanceDate)) {
							document.getElementById("error_area").style.display="block";
							document.getElementById("error_area").innerHTML = '<s:text name="bankremittance.before.receiptdate" />'+ '<br>';
							window.scroll(0, 0);
							return false;
						}
					}
				}
			}
		}
		</s:if>
		if(document.getElementById('accountNumberId').value != dom.get("remitAccountNumber").value.trim())
			{
				 alert("Account number for which search result has displayed and selected account number in search drop down are different. \n Please make sure account number in drop down and account number for which search has done are same.");
				 return false;
			}
		var flag=confirm('Receipts once remitted cannot be modified, please verify before you proceed.');
        if(flag==false)
        {
         return false;
        }
		if (!isChecked(document.getElementsByName('receiptIds'))) {
			dom.get("selectremittanceerror").style.display = "block";
			window.scroll(0, 0);
			return false;
		} else {
		       	doLoadingMask('#loadingMask');
				jQuery('#finYearId').prop("disabled", false);
				document.chequeRemittanceForm.action = "chequeRemittance-create.action";
				jQuery(chequeRemittanceForm).append(jQuery('<input>', {
		            type : 'hidden',
		            name : '${_csrf.parameterName}',
		            value : '${_csrf.token}'
		        }));
				return true;
		}

	}
	
	var selectedRowsId=new Array();
	function resetSelectedRowsId(){
		var list = document.getElementsByName('instrumentAmount');
			console.log(list,"---list")
				for(var index=0;index<list.length;index++){
					var obj = document.getElementById('selected_'+index);
					console.log(obj,"obj")
					if(obj.checked == true){
					selectedRowsId.push(document.getElementsByName("finalBeanList["+index+"].service")[0].value +"~"+
							document.getElementsByName("finalBeanList["+index+"].fund")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].department")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].instrumentAmount")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].instrumentNumber")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].instrumentDate")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].instrumentType")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].instrumentId")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].bank")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].bankBranch")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].receiptNumber")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].receiptId")[0].value+"~"+
							document.getElementsByName("finalBeanList["+index+"].receiptDate")[0].value +";");
	
					}
					document.getElementsByName("finalBeanList["+index+"].service")[0].disabled = true;
					document.getElementsByName("finalBeanList["+index+"].fund")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].department")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].instrumentAmount")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].instrumentNumber")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].instrumentDate")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].instrumentType")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].instrumentId")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].bank")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].bankBranch")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].receiptNumber")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].receiptId")[0].disabled =true;
					document.getElementsByName("finalBeanList["+index+"].receiptDate")[0].disabled =true;
					document.getElementsByName('finalBeanList["+index+"].selected').disabled = true;
					
				}
				document.getElementById('selectedRowsId').value = selectedRowsId;
		}

	function processDate(date) {
		var parts = date.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

	function onChangeBankAccount(branchId) {
		populateaccountNumberId({
			branchId : branchId,
		});
	}

	function searchDataToRemit() {
		if(jQuery("#finYearId").val()==-1 && jQuery("#fromDate").val()=="" && jQuery("#toDate").val()==""){
			bootbox.alert("<s:text name='msg.please.enter.either.financial.year.or.fromDate.and.toDate'/>");
			return false;
		}
		if (dom.get("accountNumberId").value != null
				&& dom.get("accountNumberId").value == -1) {
			dom.get("bankselectionerror").innerHTML = "";
			dom.get("accountselectionerror").style.display = "block";
			return false;
		}
		if (dom.get("toDate") != null && dom.get("toDate").value == ""
				&& dom.get("fromDate") != null
				&& dom.get("fromDate").value != "") {
			bootbox.alert("Please Enter To Date");
			return false;
		}
		if (dom.get("fromDate") != null && dom.get("fromDate").value == ""
				&& dom.get("toDate") != null && dom.get("toDate").value != "") {
			bootbox.alert("Please Enter From Date");
			return false;
		}
		jQuery('#finYearId').prop("disabled", false);
		jQuery('#remittanceAmount').val("");
		document.chequeRemittanceForm.action = "chequeRemittance-listData.action";
		jQuery(chequeRemittanceForm).append(jQuery('<input>', {
            type : 'hidden',
            name : '${_csrf.parameterName}',
            value : '${_csrf.token}'
        }));
		return true;
	}

	function onChangeDeparment(approverDeptId) {
		var receiptheaderId = '<s:property value="model.id"/>';
		if (document.getElementById('designationId')) {
			populatedesignationId({
				approverDeptId : approverDeptId,
				receiptheaderId : receiptheaderId
			});
		}
	}

	function onChangeDesignation(designationId) {
		var approverDeptId;
		if (document.getElementById('approverDeptId')) {
			approverDeptId = document.getElementById('approverDeptId').value;
		}
		if (document.getElementById('positionUser')) {
			populatepositionUser({
				designationId : designationId,
				approverDeptId : approverDeptId
			});
		}
	}

	// Check if at least one receipt is selected
	function isChecked(chk) {
		var list = document.getElementsByName('instrumentAmount');
		for (i = 0; i < list.length; i++) {
			if(document.getElementById("selected_"+i).checked){
				return true;
			};
		}
		return false;
	}

	//DeSelect all receipts
	function deSelectAll() {
		// DeSelect all checkboxes
		changeSelectionOfAllReceipts(false);

		// Set all amounts to zero
		totalAmount = 0;
		cashAmount = 0;
		chequeAmount = 0;
		ddAmount = 0;
		cardAmount = 0;

		// Refresh the summary section
		refreshSummary();

		// Enable/disable buttons
		enableButtons();
	}

	// Select all receipts
	function selectAll() {
		// Select all checkboxes
		changeSelectionOfAllReceipts(true);
	}

	function setCheckboxStatuses(isSelected) {
		if (isSelected == true) {
			selectAll();
		} else {
			deSelectAll();
		}
	}
</script>
</head>
<body >
	<div class="errorstyle" id="error_area" style="display: none;"></div>
	<span align="center" style="display: none" id="selectremittanceerror">
		<li><font size="2" color="red"><b><s:text name="bankremittance.error.norecordselected" /> </b></font></li>
	</span>
	<span align="center" style="display: none" id="multipleserviceselectionerror">
		<li><font size="2" color="red"><b><s:text name="bankremittance.error.multipleserviceselectionerror" /> </b></font></li>
	</span>
	<span align="center" style="display: none" id="bankselectionerror">
		<li><font size="2" color="red"><b><s:text name="bankremittance.error.nobankselected" /> </b></font></li>
	</span>
	<span align="center" style="display: none" id="accountselectionerror">
		<li><font size="2" color="red"><b><s:text name="bankremittance.error.noaccountNumberselected" /> </b></font></li>
	</span>
	<span align="center" style="display: none" id="approvalSelectionError">
		<li><font size="2" color="red"><b><s:text name="bankremittance.error.noApproverselected" /> </b></font></li>
	</span>
	<s:form theme="simple" name="chequeRemittanceForm" >
		<s:push value="model">
			<s:token />
			<s:if test="%{hasErrors()}">
				<div id="actionErrorMessages" class="errorstyle">
					<s:actionerror />
					<s:fielderror />
				</div>
			</s:if>
			<s:if test="%{hasActionMessages()}">
				<div id="actionMessages" class="messagestyle">
					<s:actionmessage theme="simple" />
				</div>
			</s:if>
			<div class="formmainbox">
				<div class="subheadnew">
					<s:text name="cheque.remittance.title" />
				</div>
				<div align="center">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td width="4%" class="bluebox">&nbsp;</td>
							<td class="bluebox"><s:text name="bankremittance.accountnumber" />: <span class="mandatory1">*</span></td>
							<td class="bluebox">
								<select id="accountNumberId" name="accountNumberId" value="%{accountNumberId}">
										<option value="-1">Select</option>
										<c:forEach items="${dropdownData.accountNumberList}" var="accNum">
											<c:if test="${accNum.bankAccount == accountNumberId }">
												<option value="${accNum.bankAccount}" selected="selected">${accNum.bank} - ${accNum.bankAccount}</option>
											</c:if>
											<c:if test="${accNum.bankAccount != accountNumberId }">
												<option value="${accNum.bankAccount}" >${accNum.bank} - ${accNum.bankAccount}</option>
											</c:if>
										</c:forEach>
								</select>		
							</td>
						</tr>
						<tr>
							<td width="4%" class="bluebox">&nbsp;</td>
							<td class="bluebox"><s:text name="bankremittance.financialyear" />:</td>
							<td class="bluebox"><s:select headerKey="-1" headerValue="--Select--" list="dropdownData.financialYearList" listKey="id" id="finYearId" listValue="finYearRange" label="finYearRange" name="finYearId" value="%{finYearId}" /></td>
							<td class="bluebox">&nbsp;</td>
							<td class="bluebox">&nbsp;</td>
						</tr>
						<tr id="dateDiv">
							<td width="4%" class="bluebox">&nbsp;</td>
							<td class="bluebox"><s:text name="bankremittance.fromdate" /></td>
								<s:date name="fromDate" var="fromFormat" format="dd/MM/yyyy" />
							<td class="bluebox"><s:textfield id="fromDate" name="fromDate" data-inputmask="'mask': 'd/m/y'" value="%{fromFormat}" placeholder="DD/MM/YYYY" /></td>
							<td class="bluebox"><s:text name="bankremittance.todate" /></td>
								<s:date name="toDate" var="toFormat" format="dd/MM/yyyy" />
							<td class="bluebox"><s:textfield id="toDate" name="toDate" value="%{toFormat}" data-inputmask="'mask': 'd/m/y'" placeholder="DD/MM/YYYY" /></td>
						</tr>
					</table>
					</div>
					<div class="buttonbottom">
						<input name="search" type="submit" class="buttonsubmit" id="search" value="<s:text name='lbl.search'/>" onclick="return searchDataToRemit()" />
					</div>
					<s:if test="%{!receiptBeanList.isEmpty()}">
						<display:table name="receiptBeanList" uid="currentRow" pagesize="${pageSize}" style="border:1px;width:100%" cellpadding="0" cellspacing="0" export="false" requestURI="">
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Select<input type='checkbox' name='selectAllReceipts' value='on' onClick='setCheckboxStatuses(this.checked);handleReceiptSelectionEvent(this.checked);'/>" style="width:5%; text-align: center">
							
							
								<c:set var="rowNumber" value="${currentRow_rowNum-1}" ></c:set>
								<input type='checkbox' name='finalBeanList[${rowNumber}].selected'  id='selected_${rowNumber}' value ="false" onClick="handleReceiptSelectionEvent()" />
								<input type="hidden" name="finalBeanList[${rowNumber}].service"  id="service_${rowNumber}" value="${currentRow.service}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].fund"  id="fund_${rowNumber}" value="${currentRow.fund}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].department" id="department_${rowNumber}"  value="${currentRow.department}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].instrumentAmount"  id="instrumentAmount_${rowNumber}" value="${currentRow.instrumentAmount}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].instrumentNumber"  id="instrumentNumber_${rowNumber}" value="${currentRow.instrumentNumber}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].instrumentDate"  id="instrumentDate_${rowNumber}" value="${currentRow.instrumentDate}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].instrumentType"  id="instrumentType_${rowNumber}" value="${currentRow.instrumentType}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].instrumentId"  id="instrumentId_${rowNumber}" value="${currentRow.instrumentId}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].bank"  id="bank_${rowNumber}" value="${currentRow.bank}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].bankBranch"  id="bankBranch_${rowNumber}" value="${currentRow.bankBranch}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].receiptNumber"  id="receiptNumber_${rowNumber}" value="${currentRow.receiptNumber}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].receiptId"  id="receiptId_${rowNumber}" value="${currentRow.receiptId}" />
								<input type="hidden" name="finalBeanList[${rowNumber}].receiptDate"  id="receiptDate_${rowNumber}" value="${currentRow.receiptDate}" />
								<input type="hidden" name="instrumentAmount" disabled="disabled" id="instrumentAmount" value="${currentRow.instrumentAmount}" />
							</display:column>

							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Receipt date" style="width:10%;text-align: center" value="${currentRow.receiptDate}" format="{0,date,dd/MM/yyyy}" />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Receipt number" style="width:10%;text-align: center" value="${currentRow.receiptNumber}" />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Cheque/DD number and date"  style="width:20%;text-align: center" value="${currentRow.instrumentNumber}  ${currentRow.instrumentDate}"  />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Drawee bank and branch" style="width:20%;text-align: center" value="${currentRow.bank}  ${currentRow.bankBranch}"  />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Service Name" style="width:15%;text-align: center" value="${currentRow.serviceName}" />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Department" style="width:15%;text-align: center" value="${currentRow.departmentName}" />
							<display:column headerClass="bluebgheadtd" class="blueborderfortd" title="Cheque /DD Amount (Rs)" style="width:10%;text-align: center">
									<div align="center">
										<c:if test="${not empty currentRow.instrumentAmount}">
											<c:out value="${currentRow.instrumentAmount}" />
										</c:if>
										&nbsp;
									</div>
							</display:column>
						</display:table>
				
				<br />
				<div id="loadingMask" style="display: none; overflow: hidden; text-align: center">
					<img src="/services/collection/resources/images/bar_loader.gif" alt="" /> <span style="color: red">Please wait....</span>
				</div>

				<div align="center">
					<table>
						<tr>					
							<s:if test="showRemittanceDate">
								<td class="bluebox" colspan="3">&nbsp;</td>
								<td class="bluebox"><s:text name="bankremittance.remittancedate" /><span class="mandatory" /></td>
								<td class="bluebox"><s:textfield id="remittanceDate" name="remittanceDate" readonly="true" data-inputmask="'mask': 'd/m/y'" placeholder="DD/MM/YYYY" /></td>
							</s:if>
							<td class="bluebox"><s:text name="bankremittance.remittanceamount" /></td>
							<td class="bluebox"><s:textfield id="remittanceAmount" name="remittanceAmount" readonly="true" /></td>								
							<td class="bluebox"><s:text name="bankremittance.accountnumber" /></td>
							<td class="bluebox"><s:textfield id="remitAccountNumber" name="remitAccountNumber" readonly="true" /></td>		
						</tr>
					</table>
				</div>
					<input type="hidden" name="selectedRowsId"  id ="selectedRowsId" value="${selectedRowsId}" />
				<div align="left" class="mandatorycoll">
					<s:text name="common.mandatoryfields" />
				</div>
				<div class="buttonbottom">
					<input name="button32" type="submit" class="buttonsubmit" id="button32" value="<s:text name='lbl.remit.to.bank'/>" onclick="return validate();" />
						&nbsp; 
					<input name="buttonClose" type="button" class="button" id="button" value="<s:text name='lbl.close'/>" onclick="window.close()" />
				</div>
				</s:if>
				<s:if test="%{isListData}">
					<s:if test="%{receiptBeanList.isEmpty()}">
						<div class="formmainbox">
							<table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
								<tr>
									<div>&nbsp;</div>
									<div class="billhead2">
										<b><s:text name="bankRemittance.norecordfound" /></b>
									</div>
								</tr>
							</table>
							<br />
						</div>
						<div class="buttonbottom">
							<input name="buttonClose" type="button" class="button" id="buttonClose" value="<s:text name='lbl.close'/>" onclick="window.close()" />
						</div>
					</s:if>
				</s:if>
			</div>
		</s:push>
	</s:form>
</body>
</html>
