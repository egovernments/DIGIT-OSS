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
				<div class="subheadnew"><s:text name="lbl.cheque.master"/></div>
			</div>
			<br />
			<s:if test="%{bankaccount != null}">
				<table width="100%" cellspacing="0" cellpadding="0" border="0"
					align="center">
					<tr align="center">
						<div class="headingsmallbg">
							<td class="bluebgheadtd" width="100%" colspan="5"><strong
								style="font-size: 15px;"><s:text name="lbl.bank.details"/></strong></td>
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
			</s:if>
			</br></br>
			<s:if test="%{chequeDetailsList.size()>0}">
				<table width="100%" cellspacing="0" cellpadding="0" border="0"
					align="center">
					<tr align="center">
						<div class="headingsmallbg">
							<td><span class="bold"><s:text name="lbl.existing.cheque.details"/></span></td>
						</div>
					</tr>
				</table>

				<table width="99%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td class="bluebox">
							<table width="100%" border="0" cellpadding="0" cellspacing="0"
								class="tablebottom">
								<tr>
									<th class="bluebgheadtd"><s:text name="lbl.from.cheque.number"/></th>
									<th class="bluebgheadtd"><s:text name="lbl.to.cheque.number"/></th>
									<th class="bluebgheadtd"><s:text name="lbl.department"/></th>
									<th class="bluebgheadtd"><s:text name="lbl.recieve.date"/></th>
									<th class="bluebgheadtd"><s:text name="lbl.financial.year"/></th>
									<th class="bluebgheadtd"><s:text name="lbl.exhausted"/></th>
								</tr>
								<s:iterator value="chequeDetailsList" status="stat" var="p">
									<tr>
										<td class="blueborderfortd"><div align="center">
												<s:property value="fromChqNo" />
											</div></td>
										<td class="blueborderfortd"><div align="center">
												<s:property value="toChqNo" />
											</div></td>
										<td class="blueborderfortd"><div align="center">
												<s:property value="deptName" />
											</div></td>
										<td class="blueborderfortd"><div align="center">
												<s:property value="receivedDate" />
											</div></td>
										<td class="blueborderfortd"><div align="center">
												<s:property value="serialNoH" />
											</div></td>
										<td class="blueborderfortd"><div align="center">
												<s:property value="isExhusted" />
											</div></td>

									</tr>
								</s:iterator>
							</table>
						</td>
					</tr>
				</table>
			</s:if>
			<span class="mandatory1"> <s:else><s:text name="msg.no.cheque.found"/> </s:else></span>
		</div>
		<div class="buttonbottom">
			<input type="button" id="Close" value="<s:text name='lbl.close'/>"
				onclick="javascript:window.close()" class="button" />
		</div>
	</s:form>
</body>

</html>
