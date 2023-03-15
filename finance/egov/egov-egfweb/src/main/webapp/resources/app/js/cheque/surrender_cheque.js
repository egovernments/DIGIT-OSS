var $parentId = 0;
var tableContainer;
var reportdatatable;
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
		var heading= "Surrendered Cheque Report ";
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
	
jQuery('#btnsearch').click(function(e) {
	var heading = prepareHeading();
	$("#surrenderChequeHeading").html(heading);
	callAjaxSearch();
});

function processDate(date){
	var parts = date.split("/");
	return new Date(parts[2], parts[1] - 1, parts[0]);
}

function callAjaxSearch() {
	var fromDate = $("#fromDate").val();
	var toDate = $("#toDate").val();
	if(!$("#fromDate").val()){
		bootbox.alert('please select from Date!');
		return false;
	}else if(!$("#toDate").val()){
		bootbox.alert('please select to Date!');
		return false;
	}else{
		fromDate = processDate(fromDate);
		toDate = processDate(toDate);
		if(fromDate.getTime()>toDate.getTime()){
			bootbox.alert('FromDate must be lower than ToDate!');
			return false;
		}
	}

	var fileName = 'Surrendered Cheque Report';
	drillDowntableContainer = $("#resultTable");
	$('.report-section').removeClass('display-hide');
	$('.error-section').addClass('display-hide');
	$.fn.dataTable.ext.errMode = 'none';
	var heading = prepareHeading();
							reportdatatable = drillDowntableContainer.dataTable({
									ajax : {
										url : '/services/EGF/report/cheque/surredered/_search',
										type : "get",
										"data" : getFormData(jQuery('form')),
										error: function (jqXHR, textStatus, errorThrown) {
											$('.report-section').addClass('display-hide');
											$('.error-section').removeClass('display-hide');
							            }
									},
									"bDestroy" : true,
									dom : "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-3  col-xs-6'l><'col-md-3 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
									buttons : [ {
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
												"data" : "id",
												"sClass" : "text-center"
											},
											{
												"data" : "bankBranch",
												"sClass" : "text-left"
											},
											{
												"data" : "bankAccountNumber",
												"sClass" : "text-center"
											},
											{
												"data" : "chequeNumber",
												"sClass" : "text-center"
											},
											{
												"data" : "chequeDate",
												"sClass" : "text-center"
											},
											{
												"data" : "payTo",
												"sClass" : "text-left"
											},
											{
												"data" : "voucherNumber",
												"sClass" : "text-left",
												fnCreatedCell : function(nTd,sData, oData, iRow,iCol) {
													$(nTd).html("<a href='' onclick='viewVoucher(event,"+ oData.voucherHeaderId+ ")'>"+ oData.voucherNumber + "</a>");
												}
											},
											{
												"data" : "voucherDate",
												"sClass" : "text-center"
											}, 
											{
												"data" : "surrenderReason",
												"sClass" : "text-left"
											} ]
								});
}

});


function loadBankBranch() {
	var fundId = $("#fund").val();
	$.ajax({
		method : "GET",
		url : "/services/EGF/report/cheque/bankBranch/_search",
		data : {
			fundId : fundId
		},
		async : true
	}).done(function(response) {
		$('#bankBranch').empty();
		$('#bankAccountId').empty();
		var output = '<option value="">Select</option>';
		$.each(response, function(index, value) {
			console.log("index: ", index);
			console.log("value: ", value);
			output += '<option value=' + index + '>' + value + '</option>';
		});
		$('#bankBranch').append(output);
	});
}

function loadBankAccount() {
	var branchId = $("#bankBranch").val().split("-")[1];
	var fundId = $("#fund").val();
	console.log();
	fundId = fundId == 0 || fundId == "" || fundId == undefined ? 0 : fundId;
	$.ajax({
		method : "GET",
		url : "/services/EGF/report/cheque/bankAccount/_search",
		data : {
			fundId : fundId,
			branchId : branchId
		},
		async : true
	}).done(function(response) {
		$('#bankAccountId').empty();
		var output = '<option value="0">Select</option>';
		$.each(response, function(index, value) {
			console.log("index: ", index);
			console.log("value: ", value);
			output += '<option value=' + index + '>' + value + '</option>';
		});
		$('#bankAccountId').append(output);
	});
}

function viewVoucher(event,vid){
	event.preventDefault();
	var url = '/services/EGF/voucher/preApprovedVoucher-loadvoucherview.action?vhid='+vid;
	window.open(url,'',' width=900, height=700');
}