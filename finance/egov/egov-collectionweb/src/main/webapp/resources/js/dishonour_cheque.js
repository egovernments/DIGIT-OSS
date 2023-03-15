var selectedRows;
var reportdatatable;
var selectedInstrumentId;
$(document).ready(function(){
	
	function getFormData($form) {
		var unindexed_array = $form.serializeArray();
		var indexed_array = {};
		$.map(unindexed_array, function(n, i) {
			indexed_array[n['name']] = n['value'];
		});
		return indexed_array;
	}
	
	function prepareHeading(){
		var heading= "Remitted Cheque List";
		if($("#fund").val() != 0){
			heading = heading  + " For Fund:" +  $("#fund option:selected").text();
		}
		if($("#bankBranch").val()){
			heading = heading  + " For Bank-Branch :" +  $("#bankBranch option:selected").text();
		}
		if($("#bankAccountId").val() != 0 && $("#bankAccountId").val()){
			heading = heading  + " For Bank Account :" +  $("#bankAccountId option:selected").text();
			
		}
		if($("#surrenderReason").val()){
			heading = heading  + " For Surrender Reason :" +  $("#surrenderReason option:selected").text();
			
		}
		if($("#fromDate").val()){
			heading = heading  + " From Date :" +  $("#fromDate").val();
			
		}
		if($("#toDate").val()){
			heading = heading  + " To Date : " +  $("#toDate").val();
			
		}
	return heading;
			
	}

	jQuery('#dishonorChequeSubmitButtonId').click(function(e) {
		var dishonorReason = $("#dishonorReasonId").val();
		var remarks = $("#remarks").val();
		if(!$("#dishonorDateId").val()){
			bootbox.alert('Please Enter Dihonor Date!');
			return false;
		}else if(dishonorReason == ""){
			bootbox.alert('Please Select Dishonor Reason!');
			return false;
		}else if(remarks < 6){
			bootbox.alert('Please Enter the Remarks!');
			return false;
		}
		$("#dishonorChequeForm").submit();
	});
	
jQuery('#btnsearch').click(function(e) {
	var heading = "Remitted Cheque List";
	$("#surrenderChequeHeading").html(heading);
	callAjaxSearch();
});

function processDate(date){
	var parts = date.split("/");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

function callAjaxSearch() {
	var instrumentMode = $("#instrumentModeId").val();
	var instrumentNumber = $("#instrumentNumberId").val();
	var instrumentDate = $("#instrumentDateId").val();
	if(instrumentMode == ""){
		bootbox.alert(instrumentModeMendatoryMessage);
		return false;
	}else if(instrumentNumber == ""){
		bootbox.alert(chequeDDNumberMendatoryMessage);
		return false;
	}else if( instrumentNumber.length < 6){
		bootbox.alert(chequeDDLimitMessage);
		return false;
	}
	else if(!$("#instrumentDateId").val()){
		bootbox.alert(chequeDDDateMendatoryMessage);
		return false;
	}

	var fileName = 'Remitted Cheque List';
	drillDowntableContainer = $("#resultTable");
	$('.report-section').removeClass('display-hide');
	$('.error-section').addClass('display-hide');
	$.fn.dataTable.ext.errMode = 'none';
	selectedInstrumentId = "";
	var heading = "Remitted Cheque List";
							reportdatatable = drillDowntableContainer.DataTable({
								ajax : {
									url : '/services/collection/dishonour/cheque/_search',
									type : "get",
									"data" :  getFormData(jQuery('form')),
									"dataSrc" : "",
									error: function (jqXHR, textStatus, errorThrown) {
										bootbox.alert(jqXHR.responseText);
										$('.report-section').addClass('display-hide');
										$('.error-section').removeClass('display-hide');
						            }
								},
									"bDestroy" : true,
									dom : "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-2  col-xs-6'l><'col-md-4 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
									buttons : [{
										extend : 'print',
										title : heading,
										filename : fileName
									}, {
										extend : 'pdfHtml5',
										title : heading,
										filename : fileName,
										customize : function(doc) {
											doc.styles.title = {
												color : '#f2851f',
												fontSize : '16',
												alignment : 'center'
											}
										}
									}, {
										extend : 'excelHtml5',
										message : heading,
										filename : fileName
									} ],
									aaSorting : [],
									columns : [
											{
												"data" : "receiptNumber",
												"sClass" : "text-left"
											},
											{
												"data" : "receiptDate",
												"sClass" : "text-center",
												"type": "datetime",
												"render": function (value) {
						                              if (value === null) return "";
						                              return moment(value).format('DD/MM/YYYY');
						                          }
											},
											{
												"data" : "voucherNumber",
												"sClass" : "text-center"
											},
											{
												"data" : "transactionDate",
												"sClass" : "text-center",
												"type" :   'datetime',
												"render": function (value) {
						                              if (value === null) return "";
						                              return moment(value).format('DD/MM/YYYY');
						                          }
											},
											{
												"data" : "instrumentNumber",
												"sClass" : "text-center"
											},
											{
												"data" : "instrumentAmount",
												"sClass" : "text-center"
											}, 
											{
												"data" : "bankName",
												"sClass" : "text-left"
											},
											{
												"data" : "accountNumber",
												"sClass" : "text-center"
											}],
									        order: [[ 1, 'asc' ]],
									        searching: false, paging: false, info: false
								});					
}

$('#resultTable').on('click', 'tbody > tr', function () {
	selectedRows = reportdatatable.row( this ).data();
	var dishonorDetailLabel= "Dishonored "+$("#instrumentModeId").val()+" Details";
	$("#dishonorDetailLabelId").text(dishonorDetailLabel);
	$("#selectedInstrumentId").val(selectedRows.instHeaderIds);
	$("#selectedVoucherHeaderId").val(selectedRows.voucherHeaderId);
    processSelectedInstrumentsToDishonor(selectedRows);
} );

function processSelectedInstrumentsToDishonor(selectedRows) {
	populateTableforSelectedInstrument(selectedRows);
	populateOriginalEntry();
	populateReversalEntry();
	$("#selected-dishonor-cheque-details").show();
	$("#dishonor-cheque-search").hide();
}
});

function populateOriginalEntry(){
	var response = selectedRows.receiptVoucherGLDetails;
	var output = "";
	var totalDebitAmount = 0;
	var totalCreditAmount = 0;
	$("#originalEnrtyTableId").find("tr:gt(0)").remove();
		$.each(response, function(idx, data) {
			output += '<tr class="setborder">';
			output += '<td class="bluebox setborder" style="text-align: center">' + data.glcode + '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: left">' +  data.accounthead + '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: right">' +  data.debitamount + '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: right">' +  data.creditamount + '</td></tr>' ;
			totalDebitAmount+=data.debitamount;
			totalCreditAmount +=  data.creditamount;
		});
		output += '<tr  class="setborder"><td colspan="2" class="bluebox setborder" style="text-align: right">Total : </td><td class="bluebox setborder" style="text-align: right">'+totalDebitAmount+'</td><td class="bluebox setborder" style="text-align: right">'+totalCreditAmount+'</td></tr>';
		$('#originalEnrtyTableId tr:last').after(output);
}

function populateReversalEntry(){
	var response = selectedRows.payInSlipVoucherGLDetails;
	var output = "";
	var totalDebitAmount = 0;
	var totalCreditAmount = 0;
	$("#reversalEnrtyTableId").find("tr:gt(0)").remove();
		$.each(response, function(idx, data) {
			output += '<tr class="setborder">';
			output += '<td class="bluebox setborder" style="text-align: center">' + data.glcode + '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: left">' +  data.accounthead + '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: right">' +  data.debitamount+ '</td>' ;
			output += '<td class="bluebox setborder" style="text-align: right">' +  data.creditamount + '</td></tr>' ;
			totalDebitAmount+=data.creditamount;
			totalCreditAmount +=  data.debitamount;
		});
		output += '<tr  class="setborder"><td colspan="2" class="bluebox setborder" style="text-align: right">Total : </td><td class="bluebox setborder" style="text-align: right">'+totalDebitAmount+'</td><td class="bluebox setborder" style="text-align: right">'+totalCreditAmount+'</td></tr>';
		$('#reversalEnrtyTableId tr:last').after(output);
}

function populateTableforSelectedInstrument(selectedRows){
	var number_of_rows = 1;
    var table_body = '<table class="table table-bordered table-hover multiheadertbl  no-footer">';
    table_body += getTableHeader();
    table_body += "<tbody>"
    for(var i=0;i<number_of_rows;i++){
      table_body+='<tr role="row">';
      table_body +='<td class="text-left"> <a href=""  onclick="openReceipt(event,\''+selectedRows.receiptSourceUrl+'\',\''+selectedRows.service+'\')">'+selectedRows.receiptNumber+'</a></td>';
      table_body +='<td class=" text-center">'+moment(selectedRows.receiptDate).format('DD/MM/YYYY')+'</td>';
      table_body +='<td class="text-center"> <a href=""  onclick="viewVoucher(event,'+selectedRows.voucherHeaderId+')">'+selectedRows.voucherNumber+'</a></td>';
      table_body +='<td class=" text-center">'+moment(selectedRows.transactionDate).format('DD/MM/YYYY')+'</td>';
      table_body +='<td class=" text-center">'+selectedRows.instrumentNumber+'</td>';
      table_body +='<td class=" text-center">'+selectedRows.instrumentAmount+'</td>';
      table_body +='<td class=" text-left">'+selectedRows.bankName+'</td>';
      table_body +='<td class=" text-center">'+selectedRows.accountNumber+'</td>';
      table_body+='</tr>';
    }
    table_body += "</tbody>"
    table_body +='</table>';
     $('#selectedInstrumentTableDiv').html(table_body);

}

function getTableHeader(){
	var tbHeader =  "<thead>";
		  tbHeader += '<tr role="row">';
		  tbHeader += '<th class="text-left sorting_asc" rowspan="1" colspan="1" style="width: 83.0104px;">Receipt No</th>';
		  tbHeader += ' <th class="text-center sorting" rowspan="1" colspan="1" style="width: 91.0104px;">Receipt Date</th>';
		  tbHeader += ' <th class="text-center sorting" rowspan="1" colspan="1" style="width: 134.01px;">Voucher Number</th>';
		  tbHeader += ' <th class="text-center sorting" rowspan="1" colspan="1" style="width: 120.01px;">'+$("#instrumentModeId").val()+' Date</th>';
		  tbHeader +=  '<th class="text-left sorting" rowspan="1" colspan="1" style="width: 144.01px;">'+$("#instrumentModeId").val()+' Number</th>';
		  tbHeader +=  '<th class="text-center sorting" rowspan="1" colspan="1" style="width: 142.01px;">'+$("#instrumentModeId").val()+' Amount</th>';
		  tbHeader +=  '<th class="text-left sorting" rowspan="1" colspan="1" style="width: 86.0104px;">Bank Name</th>';
		  tbHeader +=  '<th class="text-center sorting" rowspan="1" colspan="1" style="width: 159px;">Bank Account Number</th>';
		  tbHeader +=  '</tr>';
		  tbHeader +=  '</thead>';
		  return tbHeader;
}

function decimalvalue(obj){
	var regexp_decimalvalue = /[^0-9.]/g ;
	if(jQuery(obj).val().match(regexp_decimalvalue)){
		jQuery(obj).val( jQuery(obj).val().replace(regexp_decimalvalue,'') );
	}
}

function loadBankAccount() {
	var branchId = $("#bankBranch").val();
	var fundId = 0;
	if(branchId == ""){
		$('#bankAccountId').empty();
		return false;
	}else{
		branchId = branchId.split("-")[1];
	}
	$.ajax({
		method : "GET",
		url : "/services/collection/dishonour/cheque/bankAccount/_search",
		data : {
			fundId : fundId,
			branchId : branchId
		},
		async : true
	}).done(function(response) {
		$('#bankAccountId').empty();
		var output = '<option value="0">Select</option>';
		$.each(response, function(index, value) {
			output += '<option value=' + value[2] + '>' + value[3]+" - "+value[2] + '</option>';
		});
		$('#bankAccountId').append(output);
	});
}

function viewVoucher(event,vid){
	event.preventDefault();
	var url = '/services/EGF/voucher/preApprovedVoucher-loadvoucherview.action?vhid='+vid;
	window.open(url,'',' width=900, height=700');
}

function openReceipt(event,receiptSourceUrl){
	event.preventDefault();
	window.open(receiptSourceUrl,'',' width=900, height=700');
}

function goBackToDishonorChequeSearch(){
	$("#dishonor-cheque-search").show();
	$("#selected-dishonor-cheque-details").hide();
}