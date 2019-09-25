var $parentId = 0;
var tableContainer;
var reportdatatable;
$(document).ready(function(){
	$('#coaReportResult-table').hide();
	$('#reportgeneration-header').hide();
	
	function getFormData($form) {
		var unindexed_array = $form.serializeArray();
		var indexed_array = {};
		console.log("unindexed_array----->", unindexed_array);
		$.map(unindexed_array, function(n, i) {
			indexed_array[n['name']] = n['value'];
		});
        console.log("indexed_array--------------->", indexed_array);
        
       
		return indexed_array;
	}
	
jQuery('#btnsearch').click(function(e) {
	callAjaxSearch();
});


/*var oTable = $('#coaReportResult-table');
var oDataTable;*/
		
/*function callAjaxSearch() {
	$('#coaReportResult-header').show();
	$('#reportgeneration-header').show();
	if($('form').valid()){
		$.get("/services/EGF/masters/coareport/coareportResult/",$('#coaSearchResultForm').serialize())
		.done(function(searchResult) {
//			console.log(JSON.stringify(searchResult));
		oDataTable=oTable.DataTable({
			dom : "<'row'<'col-xs-4 pull-right'f>r>t<'row add-margin'<'col-md-3 col-xs-6'i><'col-md-2 col-xs-6'l><'col-md-3 col-xs-6 text-right'B><'col-md-4 col-xs-6 text-right'p>>",
			"autoWidth": false,
			"bDestroy": true,
			"processing": true,
			buttons: [
						{
						    extend: 'excel',
						    filename: 'COA Report',
							message : "Chartofaccount report for ",
							exportOptions : {
								columns : [0,1, 2, 3, 4, 5]
							}
						},
					  {
					    extend: 'pdf',
					    title: 'COA Report',
					    filename: 'COA Report',
					    message : "Chartofaccount report for ",
					    pageSize : 'A3',
					    orientation : 'landscape',
						exportOptions : {
							columns : [0,1, 2, 3, 4,5]
						}
					},
					{
					    extend: 'print',
					    header : true,
					    title: 'COA Report',
					    filename: 'COA Report',
						exportOptions : {
							columns : [0,1, 2, 3, 4,5]
						}
					}
					],
					searchable : true,
					data : searchResult,
				columns :[{"title" : "S.no","sClass" : "text-center"},
					 		{ "data" : "majorCode", "title": "Major Code-Name","sClass" : "text-center"},
					 	  { "data" : "minorCode", "title": "Minor Code-Name","sClass" : "text-center"},
				          { "data" : "accountCode" , "title": "Account Code" ,"sClass" : "text-center"}, 
				          { "data" : "accountName" , "title": "Account Name" ,"sClass" : "text-center"}, 
						  { "data" : "type", "title": "Type","sClass" : "text-center"},
						  { "data" : "purpose", "title": "Purpose","sClass" : "text-center"},
						  { "data" : "accountDetailType", "title": "Account Detail Type","sClass" : "text-center"},
						  { "data" : "isActiveForPosting", "title": "Active for Posting ","sClass" : "text-center"}
						  
						  ]
				          
				});
		
console.log('oDataTable : ',oDataTable);
		 //s.no auto generation(will work in exported documents too..)
oDataTable.on( 'order.dt search.dt', function () {
	oDataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
       cell.innerHTML = i+1;
       oDataTable.cell(cell).invalidate('dom'); 
   } );
} ).draw();

})

}

}*/


function callAjaxSearch() {
	drillDowntableContainer = $("#resultTable");
	$('.report-section').removeClass('display-hide');
	reportdatatable = drillDowntableContainer
			.dataTable({
				ajax : {
					url : '/services/EGF/masters/coareport/coareportResult/',
					type : "get",
					"data" : getFormData(jQuery('form'))         
				},
				"bDestroy" : true,
				dom: "<'row'<'col-xs-12 pull-right'f>r>t<'row buttons-margin'<'col-md-3 col-xs-6'i><'col-md-3  col-xs-6'l><'col-md-3 col-xs-6'B><'col-md-3 col-xs-6 text-right'p>>",
				buttons: [
						  {
						    extend: 'print',
						    title: 'COA Report',
						    filename: 'COA Report'
						},{
						    extend: 'pdf',
						    title: 'COA Report',
						    filename: 'COA Report'
						},{
						    extend: 'excel',
						    filename: 'COA Report'
						}
						],
				aaSorting : [],
				columns : [ 
					{
						"data" : "majorcode",
						"sClass" : "text-left"
					},
					{
						"data" : "minorcode",
						"sClass" : "text-left"
					},{
					"data" : "accountcode",
					"sClass" : "text-left"
				},
				{
					"data" : "accountname",
					"sClass" : "text-left"
				},
				{
					"data" : "type",
					"sClass" : "text-left"
				}, {
					"data" : "purpose",
					"sClass" : "text-left"
				}, {
					"data" : "accountdetailtype",
					"sClass" : "text-left"
				}, {
					"data" : "isActiveForPosting",
					"sClass" : "text-left"
				} ]
			});
}




var accountCodeName = new Bloodhound({
	datumTokenizer : function(datum) {
		return Bloodhound.tokenizers.whitespace(datum.value);
	},
	queryTokenizer : Bloodhound.tokenizers.whitespace,
	remote : {
		url : '/services/EGF/masters/coareport/ajax/getAccountCodeAndName',
		replace : function(url, uriEncodedQuery) {
			return url + '?accountCode=' + uriEncodedQuery;

		},
		filter: function (data) {
            return $.map(data, function (ct) {
                return {
                    id: ct.id,
                    name: ct.name,
                    glcode: ct.glcode,
                    glcodesearch: ct.glcode+' - '+ct.name
                };
            });
        }
	}
});


accountCodeName.initialize();
$('#accountCode').typeahead({
	hint : true,
	highlight : true,
	minLength : 3
}, {
	displayKey : 'glcodesearch',
	source : accountCodeName.ttAdapter()
}).on('typeahead:selected', function (event, data) {
	$("#accountCode").val(data.glcode);
	$("#accountCodeId").val(data.glcode);
});

});

$('#majorCode').change(function () {
	$('#minorCode').append($('<option>').text('Select from below').attr('value', ''));
	loadMinorCode($('#majorCode').val());
});

function loadMinorCode(parentId){
	if (!parentId) {
		$('#minorCode').empty();
		$('#minorCode').append($('<option>').text('Select from below').attr('value', ''));
		return;
	} else {
		
		$.ajax({
			method : "GET",
			url : "/services/EGF/masters/coareport/ajax/getMinorCode",
			data : {
				parentId : parentId
			},
			async : true
		}).done(
				function(response) {
					$('#minorCode').empty();
					var output = '<option value="">Select</option>';
					$.each(response, function(index, value) {
						output += '<option value='
								+ value.id + '>'
								+ value.glcode + ' - '
								+ value.name + '</option>';
					});
					$('#minorCode').append(output);
				});

		
	}
}



