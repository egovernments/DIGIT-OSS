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
<link rel="stylesheet" type="text/css"
	href="/services/EGF/resources/css/ccMenu.css?rnd=${app_release_no}" />
<s:if
	test="%{disableExpenditureType == true && enablePensionType == false}">
	<title><s:text name="lbl.salary.bill.payment.search"/> </title>
</s:if>
<s:elseif
	test="%{disableExpenditureType == true && enablePensionType == true}">
	<title><s:text name="lbl.pension.bill.payment.search"/> </title>
</s:elseif>
<s:else>
	<title><s:text name="lbl.bill.payment.search"/> </title>
</s:else>
</head>
<body>
	<s:form action="payment" theme="simple">
		<jsp:include page="../budget/budgetHeader.jsp">
			<jsp:param name="heading" value="Bill Payment Search" />
		</jsp:include>
		<span class="mandatory1" id="errorSpan"> <s:actionerror /> <s:fielderror />
			<s:actionmessage />
		</span>
		<div class="formmainbox">
			<div class="subheadnew">
				<s:if
					test="%{disableExpenditureType == true && enablePensionType == false}"><s:text name="lbl.salary.bill.payment.search"/></s:if>
				<s:elseif
					test="%{disableExpenditureType == true && enablePensionType == true}"><s:text name="lbl.pension.bill.payment.search"/></s:elseif>
				<s:else><s:text name="lbl.bill.payment.search"/></s:else>
			</div>
			<table align="center" width="100%" cellpadding="0" cellspacing="0">
				<tr>
					<td class="bluebox"></td>
					<td class="bluebox"><s:text name="payment.billnumber" /></td>
					<td class="bluebox"><s:textfield name="billNumber"
							id="billNumber" maxlength="25" value="%{billNumber}" /></td>
					<td class="bluebox"></td>
					<td class="bluebox"></td>
				</tr>
				<tr>
					<td class="bluebox"></td>
					<td class="greybox"><s:text name="payment.billdatefrom" /></td>
					<td class="greybox"><s:textfield id="fromDate" name="fromDate"
							value="%{fromDate}" data-date-end-date="0d"
							onkeyup="DateFormat(this,this.value,event,false,'3')"
							placeholder="DD/MM/YYYY" class="form-control datepicker"
							data-inputmask="'mask': 'd/m/y'" /></td>
					<td class="greybox"><s:text name="payment.billdateto" /></td>
					<td class="greybox"><s:textfield id="toDate" name="toDate"
							value="%{toDate}" data-date-end-date="0d"
							onkeyup="DateFormat(this,this.value,event,false,'3')"
							placeholder="DD/MM/YYYY" class="form-control datepicker"
							data-inputmask="'mask': 'd/m/y'" /></td>
				</tr>
				<tr>
					<td class="bluebox"></td>
					<td class="bluebox"><s:text name="payment.expendituretype" />
					</td>
					<td class="bluebox"><s:select name="expType" id="expType"
							list="#{'-1':'----Choose----','Purchase':'Purchase','Works':'Works','Expense':'Expense'}"
							value="%{expType}" /></td>
					<td class="bluebox"></td>
					<td class="bluebox"></td>

				</tr>
				<jsp:include page="../payment/paymenttrans-filter.jsp" />
			</table>

		</div>
		<%-- 	<s:if test="%{!validateUser('createpayment')}">
		<script>
			document.getElementById('searchBtn').disabled=true;
			document.getElementById('errorSpan').innerHTML='<s:text name="payment.invalid.user"/>';
			if(document.getElementById('vouchermis.departmentid'))
			{
				var d = document.getElementById('vouchermis.departmentid');
				d.options[d.selectedIndex].text='----Choose----';
				d.options[d.selectedIndex].text.value=-1;
			}
		</script>
		</s:if> --%>
		<%-- <s:if test="%{validateUser('deptcheck')}">
			<script>
				if(document.getElementById('vouchermis.departmentid'))
				{
					document.getElementById('vouchermis.departmentid').disabled=true;
				}
			</script>
		</s:if> --%>
		<s:hidden name="disableExpenditureType" id="disableExpenditureType"
			value="%{disableExpenditureType}" />
		<s:hidden name="enablePensionType" id="enablePensionType"
			value="%{enablePensionType}" />
	</s:form>
	<div align="center" class="buttonbottom">
		<input type="submit" class="buttonsubmit" value="<s:text name='lbl.search'/>"
			id="searchBtn" name="searchBtn" onclick="return search();" /> <input
			type="button" value="<s:text name='lbl.close'/>" onclick="window.parent.postMessage('close','*');window.close();"
			class="button" />
	</div>
	<script>
			function loadBank(obj){}
			function search()
			{
				var fund = document.getElementById('fundId').value;
				if(fund == "-1"){
					bootbox.alert("Please select fund");     
				}else{
					console.log("department code new");
					console.log(document.getElementById('departmentid').value);
					document.forms[0].action='${pageContext.request.contextPath}/payment/payment-search.action';
					jQuery(document.forms[0]).append(
	                        jQuery('<input>', {
	                            type: 'hidden',
	                            name: '${_csrf.parameterName}',
	                            value: '${_csrf.token}'
	                        })
	                    );
	    			document.forms[0].submit();
				}
				return true;
			}
			<s:if test="%{disableExpenditureType == true && enablePensionType == false}">
				var element = document.getElementById('expType');
				var len = element.options.length;
				element.options.length = 0;
				element.options[element.length] = new Option('Salary', 'Salary');
				element.disabled = true;
			</s:if>
			<s:if test="%{disableExpenditureType == true && enablePensionType == true}">
				var element = document.getElementById('expType');
				var len = element.options.length;
				element.options.length = 0;
				element.options[element.length] = new Option('Pension', 'Pension');
				element.disabled = true;
			</s:if>
		</script>
</body>
</html>
