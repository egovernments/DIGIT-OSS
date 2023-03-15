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


<script language="javascript"
	src="../resources/javascript/jsCommonMethods.js?rnd=${app_release_no}"></script>
<%@ taglib prefix="s" uri="/WEB-INF/tags/struts-tags.tld"%>
<h5 style="color: red">
	<s:actionerror />
</h5>
<s:if test="%{bankBookViewEntries.size()>0}">
	<br />

	<table width="99%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td class="subheadnew">
				<div>
					<table width="100%" border="0" cellpadding="0" cellspacing="0">
						<tr>
							<th class="bluebgheadtd" width="100%" colspan="14"><strong
								style="font-size: 15px;"><s:property value="ulbName" /><br />
									Bank Book Report for <s:property
										value="bankAccount.bankbranch.bank.name" />-<s:property
										value="bankAccount.bankbranch.branchname" />-<s:property
										value="bankAccount.accountnumber" /> <s:property
										value="header" /> from <s:property
										value="%{getFormattedDate(startDate)}" /> to <s:property
										value="%{getFormattedDate(endDate)}" /> </strong></th>
						</tr>

					</table>
				</div>
			</td>
		</tr>
		<tr>
			<td class="blueborderfortd">
				<div>
					<table width="100%" border="0" cellpadding="0" cellspacing="0"
						class="tablebottom">
						<tr>
							<th class="bluebgheadtd" colspan="5"><s:text name="lbl.receipts"/> </th>
							<th class="bluebgheadtd" colspan="5"><s:text name="lbl.payments"/></th>
						</tr>
						<tr>
							<th class="bluebgheadtd" width="2%"><s:text name="lbl.voucher.date"/> </th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.voucher.number"/> </th>
							<th class="bluebgheadtd" width="15%"><s:text name="lbl.particulars"/></th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.amount"/></th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.cheque.rtgs.and.date"/> </th>
							<th class="bluebgheadtd" width="2%"><s:text name="lbl.voucher.date"/></th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.voucher.number"/></th>
							<th class="bluebgheadtd" width="15%"><s:text name="lbl.particulars"/></th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.amount"/></th>
							<th class="bluebgheadtd" width="10%"><s:text name="lbl.cheque.rtgs.and.date"/></th>
						</tr>
						<s:iterator value="bankBookViewEntries" status="stat" var="p">
							<tr>
								<td class="blueborderfortd"><div align="center">
										<s:property value="receiptVoucherDate" />
										&nbsp;
									</div></td>
								<td class="blueborderfortd"><a href="javascript:void(0);"
									onclick="viewVoucher(<s:property value='voucherId'/>);"><s:property
											value="receiptVoucherNumber" /> </a>&nbsp;</td>
								<td class="blueborderfortd"><s:if
										test="%{#p.receiptParticulars == 'Total'}">
										<strong><s:property value="receiptParticulars" />&nbsp;</strong>
									</s:if> <s:else>
										<s:property value="receiptParticulars" />&nbsp;</s:else></td>
								<td class="blueborderfortd"><div align="right">
										<s:if test="%{#p.receiptParticulars == 'Total'}">
											<strong><s:text name="format.number">
													<s:param name="value" value="receiptAmount" />
												</s:text></strong>
										</s:if>
										<s:else>
											<s:if test="%{#p.receiptAmount != null}">
												<s:text name="format.number">
													<s:param name="value" value="receiptAmount" />
												</s:text>&nbsp;
							</s:if>
										</s:else>
									</div></td>
								<td class="blueborderfortd"><s:if
										test="%{#p.receiptChequeDetail == 'MULTIPLE'}">
										<a href="javascript:void(0);"
											onclick='showChequeDetails(<s:property value="voucherId"/>);'><s:property
												value="receiptChequeDetail" /></a>&nbsp;
						</s:if> <s:else>
										<s:property value="receiptChequeDetail" />&nbsp;</s:else></td>
								<td class="blueborderfortd"><s:property
										value="paymentVoucherDate" /></td>
								<td class="blueborderfortd"><a href="javascript:void(0);"
									onclick="viewVoucher(<s:property value='voucherId'/>);"><s:property
											value="paymentVoucherNumber" /> </a>&nbsp;</td>
								<td class="blueborderfortd"><s:if
										test="%{#p.paymentParticulars == 'Total'}">
										<strong><s:property value="paymentParticulars" /></strong>&nbsp;
						</s:if> <s:else>
										<s:property value="paymentParticulars" />&nbsp;
						</s:else></td>
								<td class="blueborderfortd"><div align="right">
										<s:if test="%{#p.receiptParticulars == 'Total'}">
											<strong><s:text name="format.number">
													<s:param name="value" value="paymentAmount" />
												</s:text></strong>&nbsp;
						</s:if>
										<s:else>
											<s:if test="%{#p.paymentAmount != null}">
												<s:text name="format.number">
													<s:param name="value" value="paymentAmount" />
												</s:text>&nbsp;
							</s:if>
										</s:else>
									</div></td>
								<td class="blueborderfortd"><s:if
										test="%{#p.paymentChequeDetail == 'MULTIPLE'}">
										<a href="javascript:void(0);"
											onclick='showChequeDetails(<s:property value="voucherId"/>);'><s:property
												value="paymentChequeDetail" /></a>&nbsp;
						</s:if> <s:else>
										<s:property value="paymentChequeDetail" />&nbsp;</s:else></td>
							</tr>
						</s:iterator>
					</table>
				</div>
			</td>
		</tr>
	</table>
	</td>
	</tr>
	<tr>
		<div class="buttonbottom">
			<s:text name="lbl.report.options"/> <label onclick="exportXls()"><a
				href='javascript:void(0);'><s:text name="lbl.excel"/> </a></label> | <label onclick="exportPdf()"><a
				href="javascript:void(0);"><s:text name="lbl.pdf"/></a></label>
		</div>
	</tr>
	</table>
</s:if>
<s:else>
	<span class="mandatory1"><s:text name="label.no.records.found"/> </span>
</s:else>
