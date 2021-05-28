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


<html>
<%@ include file="/includes/taglibs.jsp"%>
<%@ page language="java"%>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title><s:text name="bankreconciliation" /></title>
<script type="text/javascript">
jQuery(document).ready(function() {
	var fileformats = [ 'xls' ];

	jQuery('#bankStatmentInXls').on('change.bs.fileinput', function(e) {
		/*validation for file upload*/
		myfile = jQuery(this).val();
		var ext = myfile.split('.').pop();
		if (jQuery.inArray(ext, fileformats) > -1) {
			//do something    
		} else {
			bootbox.alert(ext + "<s:text name='msg.file.format.not.allowed'/>");
			jQuery(this).val("");
			return;
		}
	});
});

	function validate() {
	document.getElementById("msg").innerHTML="";  
	document.getElementById("Errors").innerHTML="";
	
		if (document.getElementById("bankId").value == "") {
			bootbox.alert("<s:text name='msg.please.select.bank'/>");
			return false;
		}
		if (document.getElementById("branchId").value == "") {
			bootbox.alert("<s:text name='msg.please.select.bank.branch'/>");
			return false;
		}
		if (document.getElementById("accountId").value == "") {
			bootbox.alert("<s:text name='msg.please.select.bank.account'/>");
			return false;
		}
		if (document.getElementById("bankStatmentInXls").value == "") {
			bootbox.alert("<s:text name='msg.please.select.file.to.upload'/>");
			return false;
		}
		
		
		document.forms[0].action='autoReconciliation-upload.action';
		jQuery(arform).append(jQuery('<input>', {
            type : 'hidden',
            name : '${_csrf.parameterName}',
            value : '${_csrf.token}'
        }));
        document.forms[0].submit();
     	
	}
	function populatebranch(obj) {
		var bid = document.getElementById("bankId").value;
		populatebranchId( {
			bankId : bid
		})
	}

	function populateaccount(obj) {
		var bid = document.getElementById("branchId").value;
		populateaccountId( {
			branchId : bid
		})
	}

	function urlLoad(fileStoreId) {
		var sUrl = "/services/egi/downloadfile?fileStoreId=" + fileStoreId
				+ "&moduleName=EGF";
		window.location = sUrl;
	}
</script>
</head>
<body>
	<s:form action="autoReconciliation" theme="css_xhtml" name="arform"
		enctype="multipart/form-data" method="post">
		<jsp:include page="../budget/budgetHeader.jsp">
			<jsp:param value="Auto Bank Reconciliation" name="heading" />
		</jsp:include>
		<div class="formmainbox">
			<div class="formheading"></div>
			<div class="subheadnew">
				<s:text name="autobankreconciliation" />
			</div>
		
		<div align="center">
			<font style='color: blue;'>
				<div id="msg">
					<s:property value="message" />
				</div>
				<p class="error-block" id="lblError"></p>
			</font>
			<font style='color: red;'>
				<p class="error-block" id="lblError"></p>
			</font>
		</div>
		<span class="mandatory1">
			<div id="Errors">
				<s:actionerror />
				<s:fielderror />
			</div> <s:actionmessage />
		</span>
		<center>
			<table border="0" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td class="greybox"></td>
					<td class="greybox"><s:text name="bank" /> <span
						class="greybox"><span class="mandatory1">*</span></span></td>
					<egov:ajaxdropdown id="branchId" fields="['Text','Value']"
						dropdownId="branchId"
						url="/voucher/common-ajaxLoadBankBranchesByBank.action" />
					<td class="greybox"><s:select name="bankId" id="bankId"
							list="dropdownData.bankList" listKey="id" listValue="name"
							headerKey="" headerValue="%{getText('lbl.choose.options')}"
							onchange="populatebranch(this);" /></td>
					<td class="greybox"><s:text name="bankbranch" /> <span
						class="greybox"><span class="mandatory1">*</span></span></td>
					<egov:ajaxdropdown id="accountId" fields="['Text','Value']"
						dropdownId="accountId"
						url="/voucher/common-ajaxLoadBankAccountsByBranch.action" />
					<td class="greybox"><s:select name="branchId" id="branchId"
							list="dropdownData.branchList" listKey="id"
							listValue="branchname" headerKey="" headerValue="%{getText('lbl.choose.options')}"
							onchange="populateaccount(this);" /></td>
				</tr>
				<tr>
					<td class="bluebox"></td>
					<td class="bluebox"><s:text name="bankaccount" /> <span
						class="bluebox"><span class="mandatory1">*</span></span></td>
					<td class="bluebox"><s:select name="accountId" id="accountId"
							list="dropdownData.accountList" listKey="id"
							listValue="chartofaccounts.glcode+'-'+accountnumber" headerKey=""
							headerValue="%{getText('lbl.choose.options')}" /></td>
					<td class="bluebox" colspan="2"></td>
				</tr>
				<tr>
					<td class="greybox"></td>
					<td class="greybox"><s:text name="upload" /> <span
						class="greybox"><span class="mandatory1">*</span></span></td>
					<td class="greybox"><s:file name="bankStatmentInXls"
							id="bankStatmentInXls" /></td>
                  
					<td class="greybox" colspan="2">
                    <a href="/services/EGF/resources/app/formats/brs_format.xls"><s:text name="lbl.download.template"/> </a>
					</td>
				</tr>

			</table>

			<div class="buttonbottom" id="buttondiv">
				<table>
					<tr>
						<td><input type="button" Class="buttonsubmit"
								value="<s:text name='lbl.upload'/>" name="upload" 
								onclick="validate();" /></td>
						<td><input type="button" value="<s:text name='lbl.close'/>"
							onclick="javascript:window.close()" class="buttonsubmit" /></td>
					</tr>
				</table>
			</div>
		</center>
    </div>
	</s:form>
	<div>
	<center>
			<s:if test="%{(uploadedFileStoreId neq null) or (errorFileStoreId neq null)}">
				<table width="100%">
					<tr>
						<th style="text-align: center" align="center"
							colspan="2"><s:text name="uplaoded.status.label"/></th>
					</tr>
					<tr>
						<th class="bluebgheadtd" style="text-align: center"
							align="center"><s:text name="successfully.uploaded.file"/></th>
						<th class="bluebgheadtd" style="text-align: center"
							align="center"><s:text name="error.records.file"/></th>
					</tr>
					<tr>
					<s:if test="%{uploadedFileStoreId neq null}">
						<td style="text-align: center" align="center"><a href="#"
							onclick="urlLoad('<s:property value="%{uploadedFileStoreId}" />');"
							id="originalFileId"> <s:property value="%{uploadedXlsFileName}"/>
						</a>
						</td>
					</s:if>
					<s:else>
					<td style="text-align: center" align="center"><s:text name="no.records.uploaded"/> </td>
					</s:else>
					<s:if test="%{errorFileStoreId neq null}">
						<td style="text-align: center" align="center"><a href="#"
							onclick="urlLoad('<s:property value="%{errorFileStoreId}" />');"
							id="outputFileId"> <s:property value="%{errorXlsFileName}" />
						</a></td>
					</s:if>
					<s:else>
					<td style="text-align: center" align="center"><s:text name="no.error.recorded"/> </td>
					</s:else>
					</tr>

				</table>
			</s:if>
			
	</center>
	</div>
   <div class="mandatory1">
  Note:
  <ol>
  <li><s:text name="autoreconciliation.upload.footnote"/></li>
  <li><s:text name="autoreconciliation.upload.footnote.nextline"/></li>
  </ol>
  </div>
</body>
</html>
