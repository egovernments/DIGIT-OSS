/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces, 
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any 
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines, 
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
	function calculateFunds(obj) {
		//bootbox.alert("hi");
		if (isNaN(obj.value)) {
			bootbox.alert("Only Numbers allowed");
			obj.value="0.00";
			obj.focus();
			return;
		}else
		{
			obj.value=obj.value.toFixed(2);
			if(obj.value.length>10)
		{
				bootbox.alert("Max number of digits limited to 7 since amounts in LAKH's ");
			obj.value="0.00";
			obj.focus();
			return;
		}else
		{
		obj.value=obj.value.toFixed(2);	
		}
		}
		var table = document.getElementById('receiptTable');
		for (i = 0; i < table.rows.length - 3; i++) {
			if(document.getElementById("receiptList[" + i + "].accountNumber").value!='Total'){
			document.getElementById("receiptList[" + i + "].fundsAvailable").value = (document
					.getElementById('receiptList[' + i + '].openingBalance').value
					+ document
					.getElementById('receiptList[' + i + '].currentReceipt').value).toFixed(2);
			}
			else{
					document.getElementById("receiptList[" + i + "].fundsAvailable").value = (document
							.getElementById('receiptList[' + i + '].openingBalance').value
							+ document
							.getElementById('receiptList[' + i + '].currentReceipt').value).toFixed(2);
		   }
		}
		calculateRepFundTotal(obj);
		calculateClosingBalance(obj);
		
	}
	function calculateRepFundTotal(obj){
		var table = document.getElementById('receiptTable');
		var avaTotal=0;
		var closeBal=0;
		var curRep=0;
		for (i = 0; i < table.rows.length - 3; i++) {
			if(document.getElementById("receiptList[" + i + "].accountNumber").value!='Total'){
				var fundsAvailable = document.getElementById("receiptList[" + i + "].fundsAvailable").value;
				var closingBalance = document.getElementById("receiptList[" + i + "].closingBalance").value;
				var currentReceipt = document.getElementById('receiptList[' + i + '].currentReceipt').value;
				avaTotal = avaTotal + fundsAvailable;
				closeBal = closeBal + closingBalance;
				curRep = curRep + currentReceipt;
			}
			else{
				document.getElementById("receiptList[" + i + "].fundsAvailable").value=avaTotal.toFixed(2);
				document.getElementById("receiptList[" + i + "].closingBalance").value=closeBal.toFixed(2);
				document.getElementById('receiptList[' + i + '].currentReceipt').value=curRep.toFixed(2);
				avaTotal=0;	closebal=0,curRep=0;
			}
		}
	}
	function calculateClosingBalance(obj) {
		var table = document.getElementById('receiptTable');
		for (i = 0; i < table.rows.length - 3; i++) {
			if(document.getElementById("receiptList[" + i + "].accountNumber").value!='Total'){
			document.getElementById('receiptList[' + i + '].closingBalance').value = (document
					.getElementById('receiptList[' + i + '].fundsAvailable').value
					- document.getElementById('receiptList[' + i + '].btbPayment').value
					+ document.getElementById('receiptList[' + i + '].btbReceipt').value).toFixed(2);
			
			}
			else{
				document.getElementById('receiptList[' + i + '].closingBalance').value = (document
						.getElementById('receiptList[' + i + '].fundsAvailable').value
						- document.getElementById('receiptList[' + i + '].btbPayment').value
						+ document.getElementById('receiptList[' + i + '].btbReceipt').value).toFixed(2);
				}
		}
		claulateColumnTotal();
	}
	
	function claulateColumnTotal() {
		var opTotal = 0;//opening balance total
		var crTotal = 0;//Current receipt total
		var faTotal = 0;
		var paymentTotal = 0;
		var receiptTotal=0;
		var cbTotal = 0;
		var table = document.getElementById('receiptTable');
		if(table!=null)
		{
			//////////////bootbox.alert(table.rows.length - 3);
		for (i = 0; i < table.rows.length - 3; i++) {
			
			if(document.getElementById("receiptList[" + i + "].accountNumber").value!='Total'){
			opTotal = opTotal + document.getElementById('receiptList[' + i + '].openingBalance').value;
			crTotal = crTotal + document.getElementById('receiptList[' + i + '].currentReceipt').value;
			faTotal = faTotal + document.getElementById('receiptList[' + i + '].fundsAvailable').value;
			paymentTotal = paymentTotal + document.getElementById('receiptList[' + i + '].btbPayment').value;
			
			receiptTotal = receiptTotal + document.getElementById('receiptList[' + i + '].btbReceipt').value;
			cbTotal = cbTotal + document.getElementById('receiptList[' + i + '].closingBalance').value;
			}
			
		}
		document.getElementById('total[0].openingBalance').value = opTotal.toFixed(2);
		document.getElementById('total[0].currentReceipt').value = crTotal.toFixed(2);
		document.getElementById('total[0].fundsAvailable').value = faTotal.toFixed(2);
		document.getElementById('total[0].btbPayment').value = paymentTotal.toFixed(2);
		document.getElementById('total[0].btbReceipt').value = receiptTotal.toFixed(2);
		document.getElementById('total[0].closingBalance').value = cbTotal.toFixed(2);
		}
		calculateAplusB();
		
	}
	function calculateAplusB()
	{
	
	if(document.getElementById('total[0].openingBalance')!=null && document.getElementById('total[1].openingBalance')!=null)
	{
		document.getElementById('total[2].openingBalance').value = (document.getElementById('total[0].openingBalance').value
				+ document.getElementById('total[1].openingBalance').value).toFixed(2);
		
		document.getElementById('total[2].closingBalance').value = (document.getElementById('total[0].closingBalance').value +
				document.getElementById('total[1].closingBalance').value).toFixed(2);
	}
	else if(document.getElementById('total[0].openingBalance')!=null )
	{
	//	document.getElementById('total[2].openingBalance').value = (document.getElementById('total[0].openingBalance').value).toFixed(2);
		
		//document.getElementById('total[2].closingBalance').value = (document.getElementById('total[0].closingBalance').value).toFixed(2);
	}
	else if( document.getElementById('total[1].openingBalance')!=null)
	{
		document.getElementById('total[2].openingBalance').value = (document.getElementById('total[1].openingBalance').value).toFixed(2);
		
		document.getElementById('total[2].closingBalance').value = (document.getElementById('total[1].closingBalance').value).toFixed(2);
	}
		
		
	}
	
	function calculateFundsForPayment(obj) {
		if (isNaN(obj.value)) {
			bootbox.alert("Only Numbers allowed");
			obj.focus();
			return;
		}else
			{
			obj.value=obj.value.toFixed(2);
			if(obj.value.length>10)
			
		{
				bootbox.alert("Max number of digits limited to 7 since amounts in LAKH's ");
			obj.value="0.00";
			obj.focus();
			return;
		}else
		{
		obj.value=obj.value.toFixed(2);  
		}
			}   
		
		var table = document.getElementById('paymentTable');
		for (i = 0; i < table.rows.length - 4; i++) {
			if(document.getElementById("paymentList[" + i + "].accountNumber").value!='Total'){
			document.getElementById("paymentList[" + i + "].fundsAvailable").value = 
				(document.getElementById('paymentList[' + i + '].openingBalance').value
					+ document.getElementById('paymentList[' + i + '].currentReceipt').value
					- document.getElementById('paymentList[' + i + '].btbPayment').value
					+ document.getElementById('paymentList[' + i + '].btbReceipt').value
					- document.getElementById('paymentList[' + i + '].concurranceBPV').value).toFixed(2);
					
		}
			else{
				document.getElementById("paymentList[" + i + "].fundsAvailable").value = 
					(document.getElementById('paymentList[' + i + '].openingBalance').value
						+ document.getElementById('paymentList[' + i + '].currentReceipt').value
						- document.getElementById('paymentList[' + i + '].btbPayment').value
						+ document.getElementById('paymentList[' + i + '].btbReceipt').value
						- document.getElementById('paymentList[' + i + '].concurranceBPV').value).toFixed(2);
			}
		}
		calculateFundsTotalForPayment();
		calculateClosingBalanceForPayment(obj);
		
	}
function calculateFundsTotalForPayment(){
	var opTotal1 = 0;//opening balance total
	var crTotal1 = 0;//Current payment total
	var faTotal1 = 0;
	var paymentTotal1 = 0;
	var receiptTotal1 = 0;		
	var cbTotal1 = 0;
	var bpvTotal1=0;
	var osTotal1=0;
	var table = document.getElementById('paymentTable');
	if(table!=null)
	{
	for (i = 0; i < table.rows.length - 4; i++) {
		if(document.getElementById("paymentList[" + i + "].accountNumber").value!='Total'){
		opTotal1 = opTotal1
				+ document
				.getElementById('paymentList[' + i + '].openingBalance').value;
		crTotal1 = crTotal1
				+ document
				.getElementById('paymentList[' + i + '].currentReceipt').value;
		faTotal1 = faTotal1
				+ document
				.getElementById('paymentList[' + i + '].fundsAvailable').value;
		
		paymentTotal1 = paymentTotal1
		+ document
		.getElementById('paymentList[' + i + '].btbPayment').value;

		
		receiptTotal1 = receiptTotal1
				+ document
				.getElementById('paymentList[' + i + '].btbReceipt').value;
		bpvTotal1 = bpvTotal1
				+ document
				.getElementById('paymentList[' + i + '].concurranceBPV').value;							
		osTotal1 = osTotal1
		+ document
		.getElementById('paymentList[' + i + '].outStandingBPV').value;
		cbTotal1 = cbTotal1
				+ document
				.getElementById('paymentList[' + i + '].closingBalance').value;
		
	}
		else{
			document.getElementById("paymentList[" + i + "].openingBalance").value=opTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].fundsAvailable").value=faTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].btbPayment").value=paymentTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].btbReceipt").value=receiptTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].concurranceBPV").value=bpvTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].outStandingBPV").value=osTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].closingBalance").value=cbTotal1.toFixed(2);
			document.getElementById("paymentList[" + i + "].currentReceipt").value=crTotal1.toFixed(2);
			
			opTotal1=0;cbTotal1=0,faTotal1=0,osTotal1=0,bpvTotal1=0,receiptTotal1=0,paymentTotal1=0,crTotal1=0;
		}
	}
	}
}
	function calculateClosingBalanceForPayment(obj) {
		var table = document.getElementById('paymentTable');
		for (i = 0; i < table.rows.length - 4; i++) {
			if(document.getElementById("paymentList[" + i + "].accountNumber").value!='Total'){
			document.getElementById('paymentList[' + i + '].closingBalance').value = (document
					.getElementById('paymentList[' + i + '].fundsAvailable').value
					- document.getElementById('paymentList[' + i + '].outStandingBPV').value).toFixed(2);
		}
			else{
				document.getElementById('paymentList[' + i + '].closingBalance').value = (document
						.getElementById('paymentList[' + i + '].fundsAvailable').value
						- document.getElementById('paymentList[' + i + '].outStandingBPV').value).toFixed(2);
			}
	}
		claulateColumnTotalForPayment();
	}
	
	function claulateColumnTotalForPayment() {
		var opTotal = 0;//opening balance total
		var crTotal = 0;//Current payment total
		var faTotal = 0;
		var paymentTotal = 0;
		var receiptTotal = 0;		
		var cbTotal = 0;
		var bpvTotal=0;
		var osTotal=0;
		var table = document.getElementById('paymentTable');
		if(table!=null)
		{
		for (i = 0; i < table.rows.length - 4; i++) {
			if(document.getElementById("paymentList[" + i + "].accountNumber").value!='Total'){
			opTotal = opTotal
					+ document
					.getElementById('paymentList[' + i + '].openingBalance').value;
			crTotal = crTotal
					+ document
					.getElementById('paymentList[' + i + '].currentReceipt').value;
			faTotal = faTotal
					+ document
					.getElementById('paymentList[' + i + '].fundsAvailable').value;
			
			paymentTotal = paymentTotal
			+ document
			.getElementById('paymentList[' + i + '].btbPayment').value;		
			receiptTotal = receiptTotal
					+ document
					.getElementById('paymentList[' + i + '].btbReceipt').value;
			bpvTotal = bpvTotal
					+ document
					.getElementById('paymentList[' + i + '].concurranceBPV').value;							
			osTotal = osTotal
			+ document
			.getElementById('paymentList[' + i + '].outStandingBPV').value;
			cbTotal = cbTotal
					+ document
					.getElementById('paymentList[' + i + '].closingBalance').value;
			
		}
			
		}
		document.getElementById('total[1].openingBalance').value = opTotal.toFixed(2);
		document.getElementById('total[1].currentReceipt').value = crTotal.toFixed(2);
		document.getElementById('total[1].fundsAvailable').value = faTotal.toFixed(2);
		document.getElementById('total[1].btbPayment').value = paymentTotal.toFixed(2);
		document.getElementById('total[1].btbReceipt').value = receiptTotal.toFixed(2);
		document.getElementById('total[1].closingBalance').value = cbTotal.toFixed(2);
		document.getElementById('total[1].concurranceBPV').value = bpvTotal.toFixed(2);
		document.getElementById('total[1].outStandingBPV').value = osTotal.toFixed(2);
		}
		calculateAplusB();
	}
