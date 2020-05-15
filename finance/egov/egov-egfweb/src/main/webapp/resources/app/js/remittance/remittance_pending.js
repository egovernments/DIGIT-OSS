var $parentId = 0;
var tableContainer;
var reportdatatable;
var selectedRows;
var pendingRemittanceDetailDataTable;
$(document)
		.ready(
				function() {

					function getFormData($form) {
						var unindexed_array = $form.serializeArray();
						var indexed_array = {};
						$.map(unindexed_array, function(n, i) {
							indexed_array[n['name']] = n['value'];
						});
						return indexed_array;
					}

					function prepareHeading() {
						var heading = "Remittance Pending Report \n";
						if ($("#instrumentTypeId").val()) {
							heading = heading
									+ ", For Instrument Type :"
									+ $("#instrumentTypeId option:selected")
											.text();
						}
						if ($("#fromDate").val()) {
							heading = heading + " From Date : "
									+ $("#fromDate").val();
						}
						if ($("#toDate").val()) {
							heading = heading + " Till Date : "
									+ $("#toDate").val();
						}
						return heading;

					}
					
					$('#resetFormId').click(function(){
			            $('#remittancePendingReportForm')[0].reset();
					});	

					jQuery('#btnsearch').click(
							function(e) {
								var heading = prepareHeading().replace(/\n/g,
										"<br />");
								;
								$("#pendingRemittanceReportHeading").html(
										heading);
								callAjaxSearch();
							});

					function processDate(date) {
						if(date != ""){
							var parts = date.split("/");
							return new Date(parts[2], parts[1] - 1, parts[0]);							
						}
						return date;
					}

					function callAjaxSearch() {
						var fromDate = $("#fromDate").val();
						var toDate = $("#toDate").val();
						fromDate = processDate(fromDate);
						toDate = processDate(toDate);
						if (fromDate == "") {
							bootbox.alert(fromDateMandetoryAlertMsg);
							return false;
						}
						
						if (toDate == "") {
							bootbox.alert(toDateMandetoryAlertMsg);
							return false;
						}
						
						if (fromDate != "" && toDate != ""
								&& fromDate.getTime() > toDate.getTime()) {
							bootbox.alert(fromDateToDateAlertMsg);
							return false;
						}

						var fileName = 'Remittance Pending Report';
						var drillDowntableContainer = $("#resultTable");
						$('.pending-remittance-report-section').removeClass(
								'display-hide');
						$('.pending-remittance-report-details-section')
								.addClass('display-hide');
						var data = getFormData(jQuery('form'));
						$('.error-section').addClass('display-hide');
						var columns = [ {
							"data" : "srNo",
							"sClass" : "text-center",
							"defaultContent":  ""
						}, {
							"data" : "receiptDate",
							"sClass" : "text-center"
						}, {
							"data" : "instrumentType",
							"sClass" : "text-left"
						}, {
							"data" : "serviceName",
							"sClass" : "text-left"
						}, {
							"data" : "totalCount",
							"sClass" : "text-center"
						}, {
							"data" : "instrumentAmount",
							"sClass" : "text-center"
						} ];

						$.fn.dataTable.ext.errMode = 'none';
						var heading = prepareHeading();
						reportdatatable = drillDowntableContainer
								.DataTable({
									ajax : {
										url : '/services/EGF/report/remittance/pending/_search',
										type : "get",
										data  : data,
										dataSrc : "",
										error : function(jqXHR, textStatus,
												errorThrown) {
											bootbox.alert(jqXHR.responseText);
											$(
													'.pending-remittance-report-section')
													.addClass('display-hide');
											$(
													'.pending-remittance-report-details-section')
													.addClass('display-hide');
											$('.error-section').removeClass(
													'display-hide');
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
										orientation : 'portrait',
										exportOptions : {
											columns : ':visible'
										},
										customize : function(doc){
											var now = new Date();
											var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
											doc['footer']=(function(page, pages) {
												return {
													columns: [
														{
															alignment: 'left',
															text: ['Created on: ', { text: jsDate.toString() }]
														},
														{
															alignment: 'right',
															text: ['page ', { text: page.toString() },	' of ',	{ text: pages.toString() }]
														}
													],
													margin: 20
												}
											});
										}
									}, {
										extend : 'excelHtml5',
										message : heading,
										filename : fileName,
										messageTop : heading,
										stripNewlines : false,
										exportOptions : {
											columns : ':visible'
										}
									} ],
									aaSorting : [],
									columns : columns,
						            createdRow : function( row, data, dataIndex ) {
						                $(row).attr('title', 'click here for details');
						            },
						            fnRowCallback : function(nRow, aData, iDisplayIndex){
						                $("td:first", nRow).html(iDisplayIndex +1);
						               return nRow;
						            }
								});
						reportdatatable.on('order.dt search.dt', function() {
							reportdatatable.column(0, {
								search : 'applied',
								order : 'applied'
							}).nodes().each(function(cell, i) {
								cell.innerHTML = i + 1;
								reportdatatable.cell(cell).invalidate('dom');
							});
						}).draw();
					}

					$('#resultTable').on('click', 'tbody > tr', function() {
						selectedRows = reportdatatable.row(this).data();
						populatePendingRemittedDataDetails(selectedRows);
					});

					function prepareHeadingForSelectedRow(selectedRows) {
						var heading = "Remittance Pending Report \n";
						if (selectedRows.receiptDate != null
								&& selectedRows.receiptDate != "") {
							heading = heading + "For ReceiptDate :"
									+ selectedRows.receiptDate;
						}
						if (selectedRows.instrumentType != null
								&& selectedRows.instrumentType != "") {
							heading = heading + ", For Type : "
									+ selectedRows.instrumentType;
						}
						if (selectedRows.service != null
								&& selectedRows.service != "") {
							heading = heading + ", For Service : "
									+ selectedRows.service;
						}
						return heading;

					}

					function populatePendingRemittedDataDetails(selectedRows) {
						var heading = prepareHeadingForSelectedRow(selectedRows)
								.replace(/\n/g, "<br />");
						;
						var isVisibleColumnsSet = selectedRows.instrumentType == 'Cheque' ?  true : false;
						$("#selectedRemittanceReportHeading").html(heading);
						var fileName = 'Remittance Pending Report Details';
						var drillDowntableContainer = $("#pendingDetaisResultTable");
						$('.pending-remittance-search-form').addClass(
						'display-hide');
						$('.pending-remittance-report-section').addClass(
								'display-hide');
						$('.pending-remittance-report-details-section')
								.removeClass('display-hide');
						var data = getFormData(jQuery('form'));
						$('.error-section').addClass('display-hide');
						var columns = [ {
							"data" : "srNo",
							"sClass" : "text-center"
						}, {
							"data" : "receiptNumber",
							"sClass" : "text-center",
							fnCreatedCell : function(nTd,sData, oData, iRow,iCol) {
								$(nTd).html('<a href=""  onclick="openReceipt(event,\''+oData.receiptSourceUrl+'\')">'+oData.receiptNumber+'</a>');
							}
						}, {
							"data" : "receiptDate",
							"sClass" : "text-left"
						}, {
							"data" : "instrumentNumber",
							"sClass" : "text-left"
						}, {
							"data" : "ifscCode",
							"sClass" : "text-center"
						}, {
							"data" : "bankBranch",
							"sClass" : "text-center"
						}, {
							"data" : "serviceName",
							"sClass" : "text-center"
						}, {
							"data" : "departmentName",
							"sClass" : "text-center"
						}, {
							"data" : "instrumentAmount",
							"sClass" : "text-center"
						}, {
							"data" : "createdBy",
							"sClass" : "text-center"
						} ];

						$.fn.dataTable.ext.errMode = 'none';
						var heading = prepareHeadingForSelectedRow(selectedRows);
						pendingRemittanceDetailDataTable = drillDowntableContainer
								.DataTable({
									'data' : selectedRows.linkedRemittedList,
									"bDestroy" : true,
									dom : "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-3  col-xs-6'l><'col-md-3 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
									buttons : [
											{
												text : 'Back',
												className : "btn btn-primary",
												action : function(e, dt, node,
														config) {
													$(
													'.pending-remittance-search-form')
													.removeClass(
															'display-hide');
													$(
															'.pending-remittance-report-section')
															.removeClass(
																	'display-hide');
													$(
															'.pending-remittance-report-details-section')
															.addClass(
																	'display-hide');
												}
											}, {
												extend : 'print',
												title : heading,
												filename : fileName
											}, {
												extend : 'pdfHtml5',
												title : heading,
												filename : fileName,
												orientation : 'portrait',
												pageSize : 'A4',
												exportOptions : {
													columns : ':visible'
												},
												customize : function(doc){
													var now = new Date();
													var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
													doc['footer']=(function(page, pages) {
														return {
															columns: [
																{
																	alignment: 'left',
																	text: ['Created on: ', { text: jsDate.toString() }]
																},
																{
																	alignment: 'right',
																	text: ['page ', { text: page.toString() },	' of ',	{ text: pages.toString() }]
																}
															],
															margin: 20
														}
													});
												}
											}, {
												extend : 'excelHtml5',
												message : heading,
												filename : fileName,
												messageTop : heading,
												stripNewlines : false,
												exportOptions : {
													columns : ':visible'
												}
											}],
									aaSorting : [],
									columns : columns,
									fnRowCallback : function(nRow, aData, iDisplayIndex){
						                $("td:first", nRow).html(iDisplayIndex +1);
						               return nRow;
						            },
									 columnDefs : [{ 'visible': isVisibleColumnsSet, 'targets': [3,4,5] }]
								});
						pendingRemittanceDetailDataTable.on('order.dt search.dt', function() {
							pendingRemittanceDetailDataTable.column(0, {
								search : 'applied',
								order : 'applied'
							}).nodes().each(function(cell, i) {
								cell.innerHTML = i + 1;
								pendingRemittanceDetailDataTable.cell(cell).invalidate('dom');
							});
						}).draw();
					}
					
				});
function openReceipt(event,receiptSourceUrl){
	event.preventDefault();
	window.open(receiptSourceUrl,'',' width=900, height=700');
}
