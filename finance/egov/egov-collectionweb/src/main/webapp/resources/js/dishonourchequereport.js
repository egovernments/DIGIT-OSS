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
		var heading= "Dishonoured Cheque Report \n";
		if($("#instrumentTypeId").val()){
			heading = heading  + ", For Payment Mode :" +  $("#instrumentTypeId option:selected").text();
		}
		if($("#bankAccountId").val() != 0 && $("#bankAccountId").val()){
			heading = heading  + " For Bank & Account Number:" +  $("#bankAccountId option:selected").text();
			
		}
		if($("#serviceId").val() != 0 && $("#serviceId").val()){
			heading = heading  + " For Service:" +  $("#serviceId option:selected").text();
			
		}
		if($("#instrumentNumberId").val()){
			heading = heading  + " For Cheque Number :" +  $("#instrumentNumberId").val();
		}
		if($("#fromDateId").val()){
			heading = heading  + " Cheque Dishonored From Date : " +  $("#fromDateId").val();
		}
		if($("#toDateId").val()){
			heading = heading  + " Cheque Dishonored To Date : " +  $("#toDateId").val();
		}
		return heading;

	}

	jQuery('#btnsearch').click(function(e) {
		var heading = prepareHeading().replace(/\n/g, "<br />");;
		$("#dishonouredReportHeading").html(heading);
		callAjaxSearch();
	});

	function callAjaxSearch() {
		var bankAccountId = $("#bankAccountId").val();
		var fromDate = $("#fromDateId").val();
		var toDate = $("#toDateId").val();
		if(fromDate==""){
			bootbox.alert(fromDateAlertMsg);
			return false;
		}else if(toDate==""){
			bootbox.alert(toDateAlertMsg);
			return false;
		}
		if(fromDate != "" && toDate != ""){
			fromDates = Date.parse(fromDate);
		    toDates = Date.parse(toDate);
			if(fromDates>toDates){
			bootbox.alert(fromDateToDateAlertMsg);
			return false;
		}
	}

		var fileName = 'Dishonoured Cheque Report';
		var drillDowntableContainer = $("#resultTable");
		$('.report-section').removeClass('display-hide');
		var data = getFormData(jQuery('form'));
		$('.error-section').addClass('display-hide');
		var columns = [
			{"data" : "id","sClass" : "text-center"},
			{"data" : "receiptNumber","sClass" : "text-left",
				fnCreatedCell : function(nTd,sData, oData, iRow,iCol) {				
					$(nTd).html('<a href="javascript:void(0);" onclick="viewReceipt(\''+ oData.receiptSourceUrl +'\',\''+ oData.service + '\')">' + oData.receiptNumber + '</a>');
				}
			},
			{"data" : "transactionDate","sClass" : "text-left",
				"type": "datetime",
				"render": function (value) {
					if (value === null) return "";
					return moment(value).format('DD/MM/YYYY');
				}
			},
			{"data" : "instrumentNumber","sClass" : "text-center"},

			{"data" : "bankName","sClass" : "text-left"},
			{"data" : "dishonorDate","sClass" : "text-left",
				"type" :   'datetime',
				"render": function (value) {
					if (value === null) return "";
					return moment(value).format('DD/MM/YYYY');
				}
			},
			{"data" : "instrumentAmount","sClass" : "text-left"},
			{"data" : "dishonorReason","sClass" : "text-left"}
			];
		$.fn.dataTable.ext.errMode = 'none';
		var heading = prepareHeading();
		reportdatatable = drillDowntableContainer.DataTable({
			ajax : {
				url : '/services/collection/report/dishonouredcheque/_search',
				type : "get",
				"data" : data,
				"dataSrc" : "",
				error: function (jqXHR, textStatus, errorThrown) {
					bootbox.alert(jqXHR.responseText);
					$('.report-section').addClass('display-hide');
					$('.error-section').removeClass('display-hide');
				}
			},
			"bDestroy" : true,
			dom : "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-3  col-xs-6'l><'col-md-3 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
			buttons : [ /*{
				extend : 'print',
				title : heading,
				filename : fileName
			},*/ {
				extend : 'pdfHtml5',
				title : heading,
				filename : fileName,
				orientation : 'landscape',
				pageSize : 'A4',
				customize: function(doc) {
					doc.content[1].margin = [ 20, 0, 20, 0 ] //left, top, right, bottom
				},
				exportOptions: {
					columns: [1, 2, 3, 4, 5,6]
				}
			}, {
				extend : 'excelHtml5',
				message : heading,
				filename : fileName,
				messageTop : heading,
				stripNewlines: false,
				exportOptions: {
					columns: [1, 2, 3, 4, 5,6]
				}
			} ],
			aaSorting : [],
			order: [[ 5, 'asc' ]],
			columns : columns,
			"fnInitComplete": function(oSettings, json) {
				toggleColumnBasedOnInstrumentType()
			}
		});
		console.log(reportdatatable);
		reportdatatable.on( 'order.dt search.dt', function () {
			reportdatatable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				cell.innerHTML = i+1;
			} );
		} ).draw();
	}

	function toggleColumnBasedOnInstrumentType(){
		var drillDowntableContainer = $("#resultTable");
		var resultDataTable = drillDowntableContainer.DataTable();
		if($("#instrumentTypeId").val() == 'Cash'){
			resultDataTable.columns([8,9]).visible(false);
		}else if($("#instrumentTypeId").val() == 'Cheque'){
			resultDataTable.columns([8,9]).visible(true);
		}
	}
});

function loadMappedService(){
	var bankAccount = $("#bankAccountId").val();
	$.ajax({
		method : "GET",
		url : "/services/collection/report/dishonouredcheque/service/"+bankAccount,
		async : true
	}).done(function(response) {
		$('#serviceId').empty();
		var output = '<option value>Select</option>';
		console.log("response : ",response);
		$.each(response, function(idx,data) {
			output += '<option value=' + data.businessDetails + '>' + data.businessDetails + '</option>';
		});
		$('#serviceId').append(output);
	});
}



function viewReceipt(receiptSourceUrl){
	event.preventDefault();
	window.open(receiptSourceUrl,'',' width=900, height=700');
}

