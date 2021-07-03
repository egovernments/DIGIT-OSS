<%@ include file="/includes/taglibs.jsp"%>
<%@ page language="java"%>
<%@ taglib prefix="s" uri="/WEB-INF/tags/struts-tags.tld"%>
<%@ taglib prefix="egov" tagdir="/WEB-INF/tags"%>
<style>
.ui-dialog .ui-dialog-buttonpane { 
    text-align: center;
}
.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset { 
    float: none;
}
.ui-dialog .ui-dialog-buttonpane button {
    width: auto;
    font-family: semibold;
    text-align: center;
    border-style: none;
    font-size: 12px;
    font-weight: bold;
    padding: 6px 12px;
    background: #fe7a51 none repeat scroll 0% 0%;
    color: #ffffff;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #fe7a51;
    margin-right: 5px;
</style>
<html>
<table id="example" class="display" style="width:100%" border="0" align="center" cellpadding="0" cellspacing="0" class="tablebottom">
        <thead>
        <s:if test='actionName.equals("CHEQUE_DD_ISSUED_NP_IN_BANK") or actionName.equals("CHEQUE_DEPOSITED_NOT_CLEARED")'>
            <tr>
                <th class="bluebgheadtd"><s:text name="label.srNumber" /></th>
                <th class="bluebgheadtd"><s:text name="label.chequeDDNumber" /></th>
                <th class="bluebgheadtd"><s:text name="label.chequeDate" /></th>
                <th class="bluebgheadtd"><s:text name="label.amount" /></th>
                <th class="bluebgheadtd"><s:text name="label.payto" /></th>
            </tr>
        </s:if>
        <s:if test='actionName.equals("OTHER_INSTRUMENT_ISSUED_NP_IN_BANK")'>
            <tr>
                <th class="bluebgheadtd"><s:text name="label.srNumber" /></th>
                <th class="bluebgheadtd"><s:text name="label.txnNumber" /> </th>
                <th class="bluebgheadtd"><s:text name="label.txnDate" /></th>
                <th class="bluebgheadtd"><s:text name="label.amount" /></th>
                <th class="bluebgheadtd"><s:text name="label.payto" /></th>
            </tr>
        </s:if>
        <s:if test='actionName.equals("RECEIPT_BRS_ENTRIES") or actionName.equals("PAYMENT_BRS_ENTRIES")'>
            <tr>
                <th class="bluebgheadtd"><s:text name="label.srNumber" /></th>
                <th class="bluebgheadtd"><s:text name="label.referenceNumber" /></th>
                <th class="bluebgheadtd"><s:text name="label.instrumentType" /></th>
                <th class="bluebgheadtd"><s:text name="label.txnDate" /></th>
                <th class="bluebgheadtd"><s:text name="label.amount" /></th>
            </tr>
        </s:if>
        </thead>
        <tbody>
        <s:iterator value="chequDDNotPresentInBank"  var="item" status="stat">
            <tr>
                <td class="blueborderfortd"><s:property value="#stat.index+1"/></td>
                <s:if test='actionName.equals("CHEQUE_DD_ISSUED_NP_IN_BANK")'>
                <td class="blueborderfortd"><s:property value="%{instrumentNumber}"/> (<s:property value="%{instrumentType.type}"/>) </td>
                <td class="blueborderfortd"><s:date name="%{instrumentDate}" format="dd/MM/yyyy"/> </td>
                </s:if>
                <s:if test='actionName.equals("OTHER_INSTRUMENT_ISSUED_NP_IN_BANK")'>
                <td class="blueborderfortd"><s:property value="%{transactionNumber}"/> (<s:property value="%{instrumentType.type}"/>) </td>
                <td class="blueborderfortd"><s:date name="%{transactionDate}" format="dd/MM/yyyy"/> </td>
                </s:if>
                <td class="blueborderfortd" style="text-align: right;"><s:property value="%{instrumentAmount}" /></td>
                <td class="blueborderfortd"><s:property value="%{payTo}"/></td>
            </tr>
        </s:iterator>
         <s:iterator value="unReconciledDepositedInst"  var="item" status="stat">
            <tr>
                <td class="blueborderfortd"><s:property value="#stat.index+1"/></td>
                <td class="blueborderfortd"><s:property value="%{transactionNumber}"/> (<s:property value="%{instrumentType.name}"/>) </td>
                <td class="blueborderfortd"><s:date name="%{transactionDate}" format="dd/MM/yyyy"/> </td>
                <td class="blueborderfortd" style="text-align: right;"><s:property value="%{amount}" /></td>
                <td class="blueborderfortd"><s:property value="%{payee}"/></td>
            </tr>
        </s:iterator>
        <s:iterator value="unReconciledBrsEntries"  var="item" status="stat">
            <tr>
                <td class="blueborderfortd"><s:property value="#stat.index+1"/></td>
                <td class="blueborderfortd"><s:property value="%{refNo}"/>  </td>
                <td class="blueborderfortd"><s:property value="%{type}"/>  </td>
                <td class="blueborderfortd"><s:date name="%{txnDate}" format="dd/MM/yyyy"/> </td>
                <td class="blueborderfortd" style="text-align: right;"><s:property value="%{txnAmount}"/></td>
            </tr>
        </s:iterator>
          </tbody>
</table>

</html>