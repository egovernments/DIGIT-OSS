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
<%@ taglib prefix="s" uri="/WEB-INF/tags/struts-tags.tld"%>
<%@ taglib prefix="egov" tagdir="/WEB-INF/tags"%>

<html>
<head>

<title>Insert title here</title>
<style type="text/css">
@media print {
	input#Close {
		display: none;
	}
}

@media print {
	input#button1 {
		display: none;
	}
}
</style>
<link rel="stylesheet" type="text/css"
	href="/services/EGF/resources/css/jquery-ui/css/smoothness/jquery-ui-1.8.4.custom.css" />
<SCRIPT type="text/javascript"
	src="../resources/javascript/calendar.js?rnd=${app_release_no}"
	type="text/javascript"></SCRIPT>
<script type="text/javascript">
var opt = {
        autoOpen: false,
        modal: true,
        width: 650,
        height:523,
        title: 'Details',
        buttons: {
            Close: function () {
            	jQuery(this).dialog('close');
            }
        }
};
jQuery(function () {
		var bankStmtDate=jQuery("#bankStmtDate").val();
		var bankAccId=jQuery("#bankAccId").val();
        var url= "/services/EGF/brs/bankReconciliationDetails.action";
	jQuery("#issuedChequAndDDId").click(function () {
		opt.title="<s:text name='msg.cheque.dd.issued.but.not.present.in.bank'/>";
		jQuery.ajax({
            type: "POST",
            url:url,
            data: { bankStmtDate: bankStmtDate, bankAccId : bankAccId,actionName:"CHEQUE_DD_ISSUED_NP_IN_BANK"},
            success: function (r) {
                jQuery("#dialog").html(r);
                jQuery("#dialog").dialog(opt).dialog("open");
                jQuery('.ui-dialog-titlebar-close').hide();
            }
        });
    });

	jQuery("#issuedOtherInstrumentsId").click(function () {
		opt.title="<s:text name='msg.other.instruments.issued.but.not.presented.in.bank'/>";
		jQuery.ajax({
            type: "POST",
            url: url,
            data: { bankStmtDate: bankStmtDate, bankAccId : bankAccId,actionName:"OTHER_INSTRUMENT_ISSUED_NP_IN_BANK"},
            success: function (r) {
                jQuery("#dialog").html(r);
                jQuery("#dialog").dialog(opt).dialog("open");
                jQuery('.ui-dialog-titlebar-close').hide();
            }
        });
    });

	jQuery("#unReconciledCrBrsEntryId").click(function () {
		opt.title="<s:text name='msg.credit.given.by.bank.either.for.insterest.or.for.any.other.account'/>";
		jQuery.ajax({
            type: "POST",
            url: url,
            data: { bankStmtDate: bankStmtDate, bankAccId : bankAccId,actionName:"RECEIPT_BRS_ENTRIES"},
            success: function (r) {
                jQuery("#dialog").html(r);
                jQuery("#dialog").dialog(opt).dialog("open");
                jQuery('.ui-dialog-titlebar-close').hide();
            }
        });
    });

	jQuery("#unReconciledDrBrsEntryId").click(function () {
		opt.title="<s:text name='msg.service.charge.bank.cherges.or.any.other.charge.levied.by.bank'/>";
		jQuery.ajax({
            type: "POST",
            url:url,
            data: { bankStmtDate: bankStmtDate, bankAccId : bankAccId,actionName:"PAYMENT_BRS_ENTRIES"},
            success: function (r) {
                jQuery("#dialog").html(r);
                jQuery("#dialog").dialog(opt).dialog("open");
                jQuery('.ui-dialog-titlebar-close').hide();
            }
        });
    });

    jQuery("#unReconciledDrId").click(function () {
		opt.title="<s:text name='msg.cheques.deposited.but.not.cleared'/>";
		jQuery.ajax({
            type: "POST",
            url: url,
            data: { bankStmtDate: bankStmtDate, bankAccId : bankAccId,actionName:"CHEQUE_DEPOSITED_NOT_CLEARED"},
            success: function (r) {
                jQuery("#dialog").html(r);
                jQuery("#dialog").dialog(opt).dialog("open");
                jQuery('.ui-dialog-titlebar-close').hide();
            }
        });
    });
});
</script>

</head>
<body>
	<div class="formmainbox">
		<div class="subheadnew">
			<s:text name="Reconciliation Summary" />
		</div>
		<s:form name="brsDetails" action="brsDetails" theme="simple">

			<%-- <s:iterator value="bankReconList" status="stat" var="p">  --%>
			<table width="99%" border="0" cellspacing="0" cellpadding="0">

				<tr>

				</tr>
				<tr>
					<td colspan="4"></td>
				</tr>
				<tr>
					<td style="width: 5%"></td>
					<td class="bluebox"><s:text name="lbl.bank"/> :<span class="bluebox"><span
							class="mandatory1">*</span></span></td>
					<td class="bluebox"><s:textfield name="bank" id="bank"
							readonly="true" /><s:hidden name="bankAccount.id" id="bankAccId"></s:hidden>
							</td>
					<td class="bluebox"><s:text name="lbl.bank.branch"/> : <span class="bluebox"><span
							class="mandatory1">*</span></span></td>
					<td class="bluebox"><s:textfield name="branch" id="branch"
							readonly="true" /></td>


					</td>
				</tr>


				<tr>
					<td style="width: 5%"></td>
					<td class="bluebox"><s:text name="lbl.account.number"/> :<span class="bluebox"><span
							class="mandatory1">*</span></span></td>
					<td class="bluebox"><s:textfield name="accountNum"
							id="accountNum" readonly="true" /></td>
					<td class="bluebox"><s:text name="lbl.bank.statement.balance"/> :<span
						class="bluebox"><span class="mandatory1">*</span></span></td>
					<td class="bluebox"><s:textfield name="balanceAsPerStatement"
							id="balanceAsPerStatement" readonly="true" /></td>

				</tr>

				<tr>
					<td style="width: 5%"></td>
					<td class="bluebox"><s:text name="lbl.bank.statement.date"/> :<span class="bluebox"><span
							class="mandatory1">*</span></span></td>
					<s:date name="bankStmtDate" format="dd/MM/yyyy" var="formtDate" />
					<td class="greybox"><s:textfield name="bankStmtDate"
							id="bankStmtDate" readonly="true" cssStyle="width:100px"
							value='%{formtDate}'
							onkeyup="DateFormat(this,this.value,event,false,'3')" /><a
						href="javascript:show_calendar('bankReconciliation.bankStmtDate');"
						style="text-decoration: none"></a><br /></td>
				</tr>
			</table>
			<br />
			<br />
			<table width="100%" border="0" cellspacing="0" cellpadding="0"
				class="tablebottom">

				<tr>
					<td colspan=3 width="70%" class="blueborderfortd"
						style="font-weight: bold;"><div align="center"><s:text name="lbl.particulars"/> </div></td>
					<td width="15%" class="blueborderfortd" style="font-weight: bold;"><div
							align="center"><s:text name="lbl.amount"/>  (Rs) </div></td>
					<td width="15%" class="blueborderfortd" style="font-weight: bold;"><div
							align="center"><s:text name="lbl.amount"/> (Rs)</div></td>
				</tr>

				<tr>
					<td colspan=3 class="blueborderfortd" valign="center"
						style="font-weight: bold;">&nbsp;&nbsp;&nbsp;<s:text name="lbl.balance.as.per.bank.book"/> </td>
					<td class="blueborderfortd" align="right"></td>
					<td class="blueborderfortd" align="right"><div align="right">
							<s:property value="accountBalance" />
						</div></td>
				</tr>
				<tr>
					<td colspan=3 class=blueborderfortd valign="center">&nbsp;&nbsp;&nbsp;<s:text name="lbl.cheque.dd.issued.but.not.presented.in.bank"/> </td>
					<td class="blueborderfortd"><div align="right"
							name="addAmountDebit" id="addAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="addAmountCredit" id="addAmountCredit"  readOnly>
							<s:if test='unReconciledCr != 0'>
								<a href="#"  id="issuedChequAndDDId"><s:property value="unReconciledCr" /></a>
							</s:if>
							<s:else><s:property value="unReconciledCr" /></s:else>
						</div></td>
				</tr>

				<tr>
					<td colspan=3 class="blueborderfortd" valign="center">&nbsp;&nbsp;&nbsp;<s:text name="lbl.other.instrument.issued.but.not.presented.in.bank"/> </td>
					<td class="blueborderfortd"><div align="right"
							name="addAmountDebit" id="addAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="addAmountCredit" id="addAmountCredit" readOnly>
							<s:if test='unReconciledCrOthers != 0'>
								<a href="#"  id="issuedOtherInstrumentsId"><s:property value="unReconciledCrOthers" /></a>
							</s:if>
							<s:else><s:property value="unReconciledCrOthers" /></s:else>
						</div></td>
				</tr>
				<tr>
					<td colspan=3 class="blueborderfortd" valign="center">&nbsp;&nbsp;&nbsp;<s:text name="lbl.credit.given.by.bank.either.for.interest.or.for.any.other.account"/> <br>&nbsp;&nbsp;&nbsp;
						<s:text name="lbl.not.accounted.for.in.bank.book"/>
					</td>
					<td class="blueborderfortd"><div align="right"
							name="addOthersAmountDebit" id="addOthersAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="addOthersAmountCredit" id="addOthersAmountCredit" readOnly>
							<s:if test='unReconciledCrBrsEntry != 0'>
								<a href="#"  id="unReconciledCrBrsEntryId"><s:property value="unReconciledCrBrsEntry" /></a>
							</s:if>
							<s:else><s:property value="unReconciledCrBrsEntry" /></s:else>
							
						</div></td>
				</tr>

				<tr>
					<td colspan=3 class="blueborderfortd" align="middle"
						valign="center" style="font-weight: bold;"><div
							align="center">
							<i>Sub-total</i>
						</div></td>
					<td class="blueborderfortd"><div align="right"
							name="subTotalAmountDebit" id="subTotalAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="subTotalAmountCredit" id="subTotalAmountCredit" readOnly>
							<s:property value="subTotal" />
						</div></td>
				</tr>
				<tr>
					<td colspan=3 class="blueborderfortd" valign="center">&nbsp;&nbsp;&nbsp;
						<s:text name="lbl.less.cheque.deposited.but.not.cleared"/> </td>
					<td class="blueborderfortd"><div align="right"
							name="lessAmountDebit" id="lessAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="lessAmountCredit" id="lessAmountCredit" readOnly>
							<s:if test='unReconciledDr != 0'>
								<a href="#" id="unReconciledDrId"><s:property value="unReconciledDr" /></a>
							</s:if>
							<s:else><s:property value="unReconciledDr" /></s:else>
						</div></td>
				</tr>

				<tr>
					<td colspan=3 class="blueborderfortd" valign="center">&nbsp;&nbsp;&nbsp;
						<s:text name="lbl.less.other.instruments.deposited.but.not.cleared"/> </td>
					<td class="blueborderfortd"><div align="right"
							name="lessAmountDebit" id="lessAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="lessAmountCredit" id="lessAmountCredit" readOnly>
							<s:if test='unReconciledDrOthers != 0'>
								<a href="#" id="unReconciledDrOthersId"><s:property value="unReconciledDrOthers" /></a>
							</s:if>
							<s:else><s:property value="unReconciledDrOthers" /></s:else>
						</div></td>
				</tr>
				<tr>
					<td colspan=3 class="blueborderfortd" valign="center">
						&nbsp;&nbsp;&nbsp; <s:text name="lbl.lest.service.bank.charges.or.any.other.charges.levied.by.bank"/><br> &nbsp;&nbsp;&nbsp;&nbsp;<s:text name="lbl.not.accounted.for.in.bank.book"/>
					</td>
					<td class="blueborderfortd"><div align="right"
							name="lessOthersAmountDebit" id="lessOthersAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="lessOthersAmountCredit" id="lessOthersAmountCredit"
							readOnly>
							<s:if test='unReconciledDrBrsEntry != 0'>
								<a href="#"  id="unReconciledDrBrsEntryId"><s:property value="unReconciledDrBrsEntry" /></a>
							</s:if>
							<s:else><s:property value="unReconciledDrBrsEntry" /></s:else>
						</div></td>
				</tr>



				<tr>
					<td colspan=3 class="blueborderfortd" style="font-weight: bold;"><div
							align="center">
							<i>Net-total</i>
						</div></td>
					<td class="blueborderfortd"><div align="right"
							name="totalAmountDebit" id="totalAmountDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="totalAmountCredit" id="totalAmountCredit" readOnly>
							<div align="right">
								<s:property value="netTotal" />
							</div></td>
				</tr>
				<tr>
					<td colspan=3 class="blueborderfortd" valign="center"
						style="font-weight: bold;">&nbsp;&nbsp;&nbsp; <s:text name="lbl.bank.bal.as.per.bank.statement"/> </td>
					<td class="blueborderfortd"><div align="right"
							name="bankBalanceDebit" id="bankBalanceDebit" readOnly>&nbsp;</div></td>
					<td class="blueborderfortd"><div align="right"
							name="bankBalanceCredit" id="bankBalanceCredit" readOnly>
							<s:property value="balanceAsPerStatement" />
						</div></td>
				</tr>

			</table>
			<%-- </s:iterator>  --%>

			<br>
			<br>
			<table align=center>
				<tr id="hideRow1" class="row1">

					<td><input type="button" id="Close" value='<s:text name="lbl.close"/>'
						onclick="javascript:window.close()" class="button" /></td>
					<td><input name="button" type="button" class="buttonsubmit"
						id="button1" value='<s:text name="lbl.print"/>' onclick="window.print()" />&nbsp;</td>
				</tr>
			</table>
			<div id="dialog" style="display: none">
		</s:form>
	</div>
</body>
</html>